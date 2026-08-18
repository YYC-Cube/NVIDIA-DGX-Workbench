YYC3双DGX节点 Node服务标准化运维手册（最终落地版）
一、文档说明
文档用途：统一两台DGX节点 Node运行架构、Systemd托管规范、故障排查标准，彻底解决跨用户权限报错、环境混乱、服务启动失败等历史问题。
适用集群：YYC3双NVIDIA DGX Spark集群
文档归档保存路径（集群统一标准）：
/home/yyc3/YYC3-Docs/YYC3-Node-运维手册.md
若无目录，提前创建：
mkdir -p /home/yyc3/YYC3-Docs
二、集群硬件与账号架构（最终定型）
2.1 节点对应关系（唯一标准答案）

- 物理机：yyc3-101 ｜ 远程别名：yyc3-n1
- 物理机：yyc3-102 ｜ 远程别名：yyc3-n2
2.2 用户架构（已统一整改）
历史问题：前期使用 yyc3-101/yyc3-102 部署Node，项目代码在 yyc3 用户目录，造成跨用户权限隔离、CHDIR报错、Permission denied。
最终统一架构（永久执行）：
- 统一运行用户：yyc3（SSH默认登录用户，全程无权限冲突）
- Node环境归属用户：yyc3
- 项目源码归属目录：/home/yyc3/xxx-projects
- Systemd运行用户：yyc3（杜绝一切跨用户授权）
三、全局环境基线（两台节点完全一致）
3.1 NVM & Node版本
- NVM版本：0.40.4
- Node版本：v22.23.1（默认常驻版本）
- Node绝对路径（全局唯一启动路径）：/home/yyc3/.nvm/versions/node/v22.23.1/bin/node
3.2 NPM镜像源
已统一配置国内镜像，永久生效：
npm config set registry <https://registry.npmmirror.com>
3.3 NVM环境加载标准脚本（通用）
所有自定义脚本、开机脚本必须使用POSIX兼容写法：
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
四、节点项目目录规范
4.1 yyc3-n1（yyc3-101）
- 项目根目录：/home/yyc3/yyc3-101-projects
4.2 yyc3-n2（yyc3-102）
- 项目根目录：/home/yyc3/yyc3-102-projects
强制规范：所有Node业务代码必须存放于对应根目录内，禁止跨目录、跨节点挂载运行。
五、Systemd服务标准化模板（最终定稿）
服务文件名统一：yyc3-node.service
5.1 yyc3-n1 正式模板
[Unit]
Description=YYC3 Node Service (yyc3-n1)
After=network.target

[Service]
User=yyc3
Group=yyc3
WorkingDirectory=/home/yyc3/yyc3-101-projects
ExecStart=/home/yyc3/.nvm/versions/node/v22.23.1/bin/node 【替换为真实JS入口文件】
Restart=on-failure
RestartSec=3
StandardOutput=journal+console
StandardError=journal+console

[Install]
WantedBy=multi-user.target
5.2 yyc3-n2 正式模板
[Unit]
Description=YYC3 Node Service (yyc3-n2)
After=network.target

[Service]
User=yyc3
Group=yyc3
WorkingDirectory=/home/yyc3/yyc3-102-projects
ExecStart=/home/yyc3/.nvm/versions/node/v22.23.1/bin/node 【替换为真实JS入口文件】
Restart=on-failure
RestartSec=3
StandardOutput=journal+console
StandardError=journal+console

[Install]
WantedBy=multi-user.target
六、服务部署标准流程（固定步骤，严禁跳过）
部署前置铁律：必须手动测试启动成功后，再写入Systemd！
6.1 步骤1：查找项目JS入口
cd /home/yyc3/对应项目目录
find . -type f -name "*.js"
6.2 步骤2：手动测试启动（必做）
/home/yyc3/.nvm/versions/node/v22.23.1/bin/node 你的入口文件.js
6.3 步骤3：写入Systemd服务
sudo nano /etc/systemd/system/yyc3-node.service
6.4 步骤4：生效并启动服务
sudo systemctl daemon-reload
sudo systemctl enable --now yyc3-node.service
6.5 步骤5：查验状态与日志

# 查看运行状态

sudo systemctl status yyc3-node.service

# 实时日志排查

journalctl -u yyc3-node.service -f
七、常用运维命令汇总（速查）

# 停止服务

sudo systemctl stop yyc3-node.service

# 重启服务

sudo systemctl restart yyc3-node.service

# 取消开机自启

sudo systemctl disable yyc3-node.service

# 重载配置（修改service后必执行）

sudo systemctl daemon-reload
八、历史故障复盘与根治方案
8.1 故障1：status=200/CHDIR
原因：跨用户运行、上层目录无遍历权限、WorkingDirectory目录错误
根治：统一 yyc3 用户运行，消除所有跨用户权限依赖
8.2 故障2：MODULE_NOT_FOUND app.js
原因：项目无 app.js，入口文件名硬编码错误
根治：动态查找真实JS入口，禁止固定app.js模板
8.3 故障3：Permission denied
原因：yyc3-101/102 访问 yyc3 用户目录权限不足
根治：全员统一 yyc3 用户，无需ACL授权
九、集群永久运维规范（SOP）

1. 三统一原则：运行用户、Node环境、项目目录，必须统一为 yyc3
2. 路径强制原则：Systemd 禁止简写 node，必须使用完整绝对路径
3. 前置测试原则：手动终端启动成功，方可托管系统服务
4. 配置重载原则：修改.service文件后，必须 daemon-reload
5. 环境归一原则：废弃 yyc3-101/102 的NVM环境，避免环境混淆
十、当前集群状态快照（2026-07-28）

- ✅ 双节点Node环境基线完全统一
- ✅ 彻底解决跨用户权限报错问题
- ✅ Systemd标准化模板已落地
- ✅ NPM国内镜像配置完成
- ✅ 文档已完整归档、集群环境标准化落地，仅待业务Node JS代码部署上线
