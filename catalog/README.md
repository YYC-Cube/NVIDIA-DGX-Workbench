# DGX Spark 语义目录（Semantic Catalog）

把 Hub 站的知识资产结构化为机器可读 YAML，供 PAI 智能体 / MCP 客户端检索。
生成器：`scripts/dump-data.mjs` + `scripts/build_semantic_catalog.py`（见
`.github/workflows/semantic-catalog.yml` 的新鲜度校验）。

## 分层

| 文件 | 内容 | 条目 |
|------|------|------|
| `index.yaml` | schema、来源 sha256、计数 | — |
| `guides.yaml` | DGX Spark 部署指南（分类/难度/耗时/前置/步骤数/来源） | 226 |
| `skills.yaml` | NVIDIA 官方技能索引（含 `npx skills add` 安装命令） | 401 |
| `nim-models.yaml` | NIM 模型（10 大类：定位/发布方/单机适配/双机适配/部署要点） | 140 |
| `resources.yaml` | AI 资源矩阵（6 大域 × 小节 × 类型/描述/链接） | 196 |

> 计数跟随源数据实际行数：`nim-models` 为报告中 10 张表格的全部模型行
> （报告正文标注 138 款，个别跨类重复行亦忠实保留）；`resources` 为知识
> 图谱六大域表格中全部带链接的资源行。

## 消费方式

1. **MCP 检索**（推荐）：`mcp-server/server.py` 暴露 4 个检索工具
   （`dgx_search_guides` / `dgx_search_skills` / `dgx_search_nim_models` /
   `dgx_search_resources`），任意 MCP 客户端均可接入：

   ```bash
   pip install -r mcp-server/requirements.txt
   python mcp-server/server.py        # stdio；DGX_CATALOG_DIR 可指定目录
   ```

2. **直接读取**：`raw.githubusercontent.com/YYC-Cube/NVIDIA-DGX-Workbench/main/catalog/*.yaml`，
   任意 YAML 1.2 解析器可读（PyYAML / yq / Go yaml 等）。

## 再生成

```bash
node scripts/dump-data.mjs > build/data.json
python3 scripts/build_semantic_catalog.py --data build/data.json
```

输出是确定性的（无墙钟时间，仅来源 sha256），改源数据后必须提交再生成产物，
CI 会用 `git diff --exit-code catalog/` 拦截漏提交的变更。
