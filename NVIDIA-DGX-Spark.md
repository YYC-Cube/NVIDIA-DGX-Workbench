# DGX Spark GB10 双机部署 · 标准路径 + 全局环境变量模板文档

## 一、集群硬件与基础信息（双DGX Spark GB10）

- 架构：Blackwell GB10 单卡128GB统一内存，TP=2张量并行
- 互联：ConnectX-7 200G RoCEv2，开启GPUDirect RDMA
- 集群节点：
  - node01（主节点RoCE IP）：192.168.10.10
  - node02（从节点RoCE IP）：192.168.10.11
- 组织ID：`0949861471075582` | 团队：`yyc3`
- 镜像仓库：nvcr.io（使用vLLM免费容器，无NIM订阅）
- 量化标准：MoE FFN=NVFP4 / Attention&路由=BF16 / KV缓存=FP8

## 二、全集群标准目录路径（双机完全统一，NFS共享）

### 1. 系统运维标准路径

```bash
# NGC CLI配置（本机密钥存储，禁止写入环境变量）
/home/yyc3/.ngc/config
# Docker nvcr登录凭证
/home/yyc3/.docker/config.json
# 全局部署脚本目录
/opt/dgx_spark/deploy/
# 环境变量配置文件存放目录
/opt/dgx_spark/env/
# 日志持久化目录
/opt/dgx_spark/logs/
# 容器数据持久目录
/opt/dgx_spark/volume/
# 共享NFS模型存储（双机统一挂载，核心标准路径）
/shared/model_store/
# NGC模型下载缓存
/shared/model_cache/
# vLLM运行缓存
/shared/cache/vllm
# Huggingface权重缓存
/shared/cache/huggingface
# 启动脚本、自检脚本
/opt/dgx_spark/scripts/
```

### 2. 共享模型目录分层规范

```
/shared/model_store/
├── nemotron-mini-4b-instruct/       # 轻量测试MoE
├── nemotron-3-super-120b-a12b/      # 单机120B MoE
├── nemotron-3-ultra-550b-a55b/      # 双机550B旗舰MoE
├── glm-5.2/                          # 中文政企MoE
├── embedding/                        # RAG嵌入模型
├── rerank/                           # 重排模型
└── ocr/                              # OCR文档解析模型
```

### 3. 容器挂载标准映射（docker run统一-v参数）

```
宿主机共享路径           容器内路径
/shared/model_store      /model
/shared/cache/vllm        /root/.cache/vllm
/shared/cache/huggingface /root/.cache/huggingface
/opt/dgx_spark/logs      /logs
/opt/dgx_spark/volume    /volume
```

## 三、全局环境变量文件：/opt/dgx_spark/env/dgx_spark_tp2.env

文件权限：`chmod 600 /opt/dgx_spark/env/dgx_spark_tp2.env`

```bash
#!/bin/bash
set -a
# ====================== 1.集群网络RoCE NCCL通信（GB10双机核心） ======================
# RoCE高速网卡设备（ibdev2netdev查询mlx5设备）
export NCCL_IB_HCA=mlx5_0,mlx5_1
export NCCL_IB_DISABLE=0
export NCCL_IB_GID_INDEX=3
export NCCL_IB_ROCE_VERSION_NUM=2
# GPUDirect RDMA开启，GB10硬件直通
export NCCL_NET_GDR_LEVEL=5
export NCCL_CROSS_NIC=1
export NCCL_IB_TIMEOUT=22
# 控制通信网卡IP段
export NCCL_SOCKET_IFNAME=ens4f0
export UCX_NET_DEVICES=ens4f0
# NCCL性能优化
export NCCL_MIN_NRINGS=4
export NCCL_ASYNC_ERROR_HANDLING=1
export NCCL_DEBUG=INFO
# 双机张量并行配置
export TENSOR_PARALLEL_SIZE=2
export RDVZ_ENDPOINT=192.168.10.10:29400
export HEAD_ROCE_IP=192.168.10.10
export WORKER_ROCE_IP=192.168.10.11

# ====================== 2.GB10 MoE NVFP4量化专属配置 ======================
export VLLM_QUANTIZATION=nvfp4
# Attention、路由层强制BF16，仅FFN专家NVFP4（官方标准）
export VLLM_NVFP4_ATTN_BF16=true
export VLLM_NVFP4_ROUTER_BF16=true
# KV缓存FP8压缩，降低128GB内存占用
export VLLM_KV_CACHE_DTYPE=fp8
# MoE专家内核优化（Blackwell专用）
export VLLM_MOE_ROUTING_OPTIMIZE=true
export VLLM_MAX_TOKENS_PER_EXPERT_FP4_MOE=163840
export VLLM_FP8_MOE_BACKEND=flashinfer-cutlass
# 开启GB10硬件算子加速
export VLLM_BLACKWELL_ENABLE=true
export CUTE_DSL_ARCH=sm_121a

# ====================== 3.模型与推理基础参数 ======================
# 共享存储模型根路径（双机统一）
export MODEL_ROOT=/shared/model_store
# 旗舰550B MoE模型路径，按需切换
export MODEL_NAME=nemotron-3-ultra-550b-a55b
export MODEL_PATH=${MODEL_ROOT}/${MODEL_NAME}
export SERVED_MODEL_NAME=nemotron-550b-moe-tp2
# 百万上下文窗口适配MoE
export MAX_MODEL_LEN=1048576
# GB10统一内存利用率阈值
export VLLM_GPU_MEMORY_UTIL=0.85
export VLLM_MAX_NUM_SEQS=5
# 服务端口
export VLLM_API_PORT=8000
export VLLM_LOG_INTERVAL=10

# ====================== 4.Docker镜像固定版本（无NIM订阅免费vLLM） ======================
export VLLM_DOCKER_IMAGE=nvcr.io/nvidia/vllm:26.04-py3
export CUDA_BASE_IMAGE=nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04

# ====================== 5.NGC仓库鉴权（禁止写入shell rc） ======================
# Service Key仅存 ~/.ngc/config，不持久化环境变量
export NGC_ORG_ID=0949861471075582
export NGC_TEAM=yyc3
# 不设置NGC_API_KEY环境，避免覆盖本地配置文件

# ====================== 6.容器资源限制 ======================
export DOCKER_SHM_SIZE=64g
export CONTAINER_NAME=dgx-moe-tp2
set +a
```

## 四、配套启动脚本 /opt/dgx_spark/scripts/start_tp2.sh

```bash
#!/bin/bash
# 加载全局环境变量
source /opt/dgx_spark/env/dgx_spark_tp2.env
# 清理旧容器
docker rm -f ${CONTAINER_NAME}
# 双机TP=2 vLLM启动容器命令
docker run -d \
  --name ${CONTAINER_NAME} \
  --gpus all \
  --shm-size ${DOCKER_SHM_SIZE} \
  --privileged \
  -p ${VLLM_API_PORT}:8000 \
  -v ${MODEL_ROOT}:/model \
  -v /shared/cache/vllm:/root/.cache/vllm \
  -v /shared/cache/huggingface:/root/.cache/huggingface \
  -v /opt/dgx_spark/logs:/logs \
  # 注入全部NCCL、NVFP4环境变量
  -e NCCL_IB_HCA=${NCCL_IB_HCA} \
  -e NCCL_IB_DISABLE=${NCCL_IB_DISABLE} \
  -e NCCL_NET_GDR_LEVEL=${NCCL_NET_GDR_LEVEL} \
  -e TENSOR_PARALLEL_SIZE=${TENSOR_PARALLEL_SIZE} \
  -e RDVZ_ENDPOINT=${RDVZ_ENDPOINT} \
  -e VLLM_QUANTIZATION=${VLLM_QUANTIZATION} \
  -e VLLM_NVFP4_ATTN_BF16=${VLLM_NVFP4_ATTN_BF16} \
  -e VLLM_NVFP4_ROUTER_BF16=${VLLM_NVFP4_ROUTER_BF16} \
  -e VLLM_KV_CACHE_DTYPE=${VLLM_KV_CACHE_DTYPE} \
  -e MAX_MODEL_LEN=${MAX_MODEL_LEN} \
  -e VLLM_GPU_MEMORY_UTIL=${VLLM_GPU_MEMORY_UTIL} \
  ${VLLM_DOCKER_IMAGE} \
  vllm serve /model/${MODEL_NAME} \
  --served-model-name ${SERVED_MODEL_NAME} \
  --tensor-parallel-size ${TENSOR_PARALLEL_SIZE} \
  --distributed-executor-backend nccl \
  --nccl-ib-rdma \
  --max-model-len ${MAX_MODEL_LEN} \
  --gpu-memory-utilization ${VLLM_GPU_MEMORY_UTIL} \
  --host 0.0.0.0 \
  --port 8000
echo "双机TP=2 MoE服务启动完成，监听端口：${VLLM_API_PORT}"
echo "模型路径：${MODEL_PATH}"
```

赋予执行权限：`chmod +x /opt/dgx_spark/scripts/start_tp2.sh`

## 五、环境自检脚本 /opt/dgx_spark/scripts/env_check.sh

```bash
#!/bin/bash
source /opt/dgx_spark/env/dgx_spark_tp2.env
echo "==========1. NGC鉴权校验=========="
ngc user who
echo -e "\n==========2. 共享存储路径校验=========="
ls -lh ${MODEL_ROOT}
echo -e "\n==========3. vLLM镜像拉取校验=========="
docker pull ${VLLM_DOCKER_IMAGE}
echo -e "\n==========4. NCCL RoCE网络参数=========="
echo NCCL_IB_HCA=${NCCL_IB_HCA}
echo RDVZ_ENDPOINT=${RDVZ_ENDPOINT}
echo TENSOR_PARALLEL_SIZE=${TENSOR_PARALLEL_SIZE}
echo -e "\n==========5. MoE NVFP4量化参数=========="
echo VLLM_QUANTIZATION=${VLLM_QUANTIZATION}
echo VLLM_NVFP4_ATTN_BF16=${VLLM_NVFP4_ATTN_BF16}
echo VLLM_KV_CACHE_DTYPE=${VLLM_KV_CACHE_DTYPE}
echo -e "\n==========环境校验全部完成=========="
```

## 六、运维规范与关键约束

1. **密钥安全**
   - Service Key仅通过`ngc config set`写入`/home/yyc3/.ngc/config`
   - 禁止将`NGC_API_KEY`写入`.bashrc`/`.zshrc`/环境变量文件，避免覆盖配置
2. **双机同步要求**
   - node01、node02两份`dgx_spark_tp2.env`完全一致
   - `/shared/model_store`必须NFS双向挂载，权重只下载一次
3. **量化红线**
   严禁删除`VLLM_NVFP4_ATTN_BF16=true`，全模型NVFP压缩会导致代码推理逻辑错乱
4. **镜像拉取规范（无NIM订阅）**

   ```bash
   # 免费vLLM容器，无DENIED报错
   docker pull nvcr.io/nvidia/vllm:26.04-py3
   # CUDA基础环境镜像
   docker pull nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04
   # NGC下载MoE权重（不受NIM订阅限制）
   ngc registry model download-version nvidia/nemotron-3-ultra-550b-a55b:latest --dest /shared/model_store
   ```

5. **启停操作标准流程**

```bash
# 1.加载环境变量
source /opt/dgx_spark/env/dgx_spark_tp2.env
# 2.环境校验
/opt/dgx_spark/scripts/env_check.sh
# 3.启动双机推理容器（node01、node02两台都执行）
/opt/dgx_spark/scripts/start_tp2.sh
# 4.停止服务
docker stop ${CONTAINER_NAME}
```

## 七、文件快速部署复制命令

```bash
# 1.创建目录
mkdir -p /opt/dgx_spark/{env,scripts,logs,volume} /shared/{model_store,model_cache,cache}
# 2.复制env文件、脚本到对应路径
# 3.权限加固
chmod 600 /opt/dgx_spark/env/dgx_spark_tp2.env
chmod +x /opt/dgx_spark/scripts/*.sh
# 4.双机NFS挂载共享存储（两台执行）
mount -t nfs 192.168.10.10:/shared /shared
```
