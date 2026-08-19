# NVIDIA DGX Workbench · 操作中心

> **DGX Spark 操作中心** · YYC³ (YanYuCloudCube™)
> 在线访问：[https://nvidia-workbench.yyc3.vip](https://nvidia-workbench.yyc3.vip)

NVIDIA DGX Spark / GB10 桌面级 AI 超算的**全链路操作指南平台**。涵盖入门配置、推理引擎、模型微调、集群互联、模型量化、AI 应用、数据科学、开发工具与安全沙箱等 9 大核心领域，并集成 NVIDIA 官方资源、NIM 模型库（138 款）与 AI 资源矩阵知识图谱（900+ 资源）。

---

## 目录

- [系统架构](#系统架构)
- [项目结构](#项目结构)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [本地开发](#本地开发)
- [GitHub Pages 部署](#github-pages-部署)
- [自定义域名绑定](#自定义域名绑定)
- [数据维护指南](#数据维护指南)
- [开发者指南](#开发者指南)
- [文档体系](#文档体系)
- [许可证](#许可证)

---

## 系统架构

### 1. 全链路架构总览

```
                ┌─────────────────────────────────────────────────────────┐
                │              nvidia-workbench.yyc3.vip                  │
                │              DGX Spark 操作中心 · YYC³                   │
                └──────────────────────────┬──────────────────────────────┘
                                           │ HTTPS (HTTP/2 · TLS 1.3)
                                           ▼
                ┌─────────────────────────────────────────────────────────┐
                │                    表现层 (Presentation)                │
                │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
                │   │ 侧边栏导航    │  │ 仪表盘卡片   │  │ 指南详情页   │     │
                │   │ Search/Sync │  │ Filter/Cat  │  │ Step/Toggle  │     │
                │   └─────────────┘  └─────────────┘  └─────────────┘     │
                ├─────────────────────────────────────────────────────────┤
                │                    数据层 (Data)                        │
                │   ┌───────────────────────────────────────────────┐     │
                │   │  GUIDES 206 条 │ SKILLS 105 条 │ 分类 16 大    │     │
                │   │  步骤 218 步   │ 外链 157 条  │ 徽章/主题      │     │
                │   └───────────────────────────────────────────────┘     │
                ├─────────────────────────────────────────────────────────┤
                │                    存储层 (Storage)                     │
                │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
                │   │ localStorage │  │ Hash Route  │  │ localStorage │    │
                │   │ 进度持久化   │  │ 深链导航     │  │ 主题记忆     │    │
                │   └─────────────┘  └─────────────┘  └─────────────┘     │
                └─────────────────────────────────────────────────────────┘
```

### 2. 数据流示意

```
┌──────────┐   DOMContentLoaded   ┌──────────┐   render    ┌──────────┐
│  init()  │ ───────────────────▶ │ buildSide│ ──────────▶ │ 侧边栏/卡片 │
└──────────┘                      └──────────┘             └──────────┘
      │                                │                        │
      │ setInterval(1s)                │ filterByCategory       │ click
      ▼                                ▼                        ▼
┌──────────┐                      ┌──────────┐            ┌──────────┐
│ 时钟组件  │                      │ applyFilter│           │ showGuide│
└──────────┘                      └──────────┘            └────┬─────┘
      ▲                                                     │ steps
      │                                                    ▼
┌──────────┐     localStorage       ┌──────────┐      ┌──────────────┐
│ toggleDone│◀─────────────────────▶│ 进度键值   │◀──── │ toggleStep   │
└──────────┘  guide-done-{id}      └──────────┘      │ step-done-{n}│
                                                    └──────────────┘
```

### 3. 部署与 CI/CD 流水线

```
┌──────────┐  git push  ┌───────────────┐  trigger  ┌──────────────────┐
│ 本地代码库 │ ─────────▶│ GitHub 远程仓库 │ ────────▶ │ GitHub Actions   │
└──────────┘            │ YYC-Cube/     │           │ pages-deploy.yml │
                        │ NVIDIA-DGX-   │           └────────┬─────────┘
                        │ Workbench     │                    │
                        └───────────────┘                    │
                        ┌────────────────────────────────────▼──────────┐
                        │ ① actions/checkout → ② configure-pages       │
                        │ ③ upload-pages-artifact → ④ deploy-pages     │
                        └────────────────────────────────────┬──────────┘
                                                             │
                                             ┌───────────────▼───────────────┐
                                             │  GitHub Pages CDN · HTTPS     │
                                             │  https://nvidia-workbench.yyc3.vip│
                                             └───────────────────────────────┘
```

### 4. 内容分类架构（16 大主分类）

```
                     ┌──────────────────────────┐
                     │    DGX Spark 操作中心     │
                     │   206 指南 · 218 步骤    │
                     └────────────┬─────────────┘
        ┌────────────┬────────────┼────────────┬──────────────┐
        ▼            ▼            ▼            ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐
│ 🚀 入门配置  │ │ ⚡ 推理引擎│ │ 🎯 模型微调│ │ 🔗 集群互联│ │ 📉 模型量化 │
│  1 篇        │ │  9 篇     │ │  6 篇     │ │  5 篇     │ │  1 篇       │
└─────────────┘ └──────────┘ └──────────┘ └──────────┘ └────────────┘
┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐
│ 🤖 AI 应用  │ │ 📊 数据科学│ │ 🛠️ 开发工具│ │ 🛡️ 安全沙箱│ │ 📦 GitHub  │
│  11 篇      │ │  4 篇     │ │  7 篇     │ │  1 篇     │ │ 仓库 17 篇  │
└────────────┘ └──────────┘ └──────────┘ └──────────┘ └────────────┘
┌────────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────┐
│ 📘 NVIDIA   │ │ 🔶 中期   │ │ 🗺️ 资源矩阵   │ │ 🧠 NIM    │ │ 🔧 YYC3   │
│ 官方资源 131 │ │ 可选 9 篇 │ │  8 篇         │ │ 模型 12   │ │ 运维 4 篇 │
└────────────┘ └──────────┘ └──────────────┘ └──────────┘ └──────────┘
```

> 另有 21 类 NVIDIA Skills 技能子分类（RAG / Megatron / cuOpt / Holoscan / TAO 等 105 条技能），通过 `npx skills add` 一键安装。

---

## 项目结构

```
nvidia-workbench/
├── index.html                  # 部署入口（单文件离线版，内联全部数据与样式）
├── DGX-SPARK-HUB-OFFLINE.html  # 数据源文件（零依赖，可直接双击运行）
├── README.md                   # 项目总览与开发者文档（本文件）
├── CONTRIBUTING.md             # 贡献指南：开发流程 / 数据规范 / 提交与 PR 规范
├── CHANGELOG.md                # 变更日志（Keep a Changelog 格式）
├── SECURITY.md                 # 安全策略：漏洞报告渠道与内容红线
├── LICENSE                     # 版权声明（保留所有权利）
├── .editorconfig               # 编辑器基础规范（UTF-8 / LF / 2 空格缩进）
├── AI-资源矩阵-统一知识图谱.md  # 数据源文档：900+ 资源分类归档
├── NVIDIA-NIM-全量模型-分析报告.md  # 数据源文档：138 款 NIM 模型分析
├── NVIDIA-DGX-Spark.md         # DGX Spark 硬件说明文档
└── .github/workflows/pages-deploy.yml  # CI：push main 自动部署 GitHub Pages
```

> 仓库只保留与站点相关的文件；本地运维脚本、IDE 配置等无关内容由 [.gitignore](.gitignore) 排除，不入库、不发布。

### 部署文件说明

| 文件 | 类型 | 说明 |
| ------ | ------ | ------ |
| `DGX-SPARK-HUB-OFFLINE.html` | **唯一数据源** | 全量内联 `GUIDES` / `SKILLS` 数组，所有数据变更在此维护 |
| `index.html` | 部署入口 | GitHub Pages 默认入口，由数据源逐字节复制生成（`cp DGX-SPARK-HUB-OFFLINE.html index.html`） |

---

## 功能特性

### 内容规模（对齐线上站点）

| 统计项 | 数量 |
| -------- | ------ |
| 操作指南 | **206 篇**（含 157 个外部资源） |
| 操作步骤 | **218 步** |
| NVIDIA Skills 技能 | **105 条**（21 大技能领域） |
| 主分类 | **16 大** |
| 内容来源 | AI 资源矩阵（900+ 资源）+ NIM 模型库（138 款） |

### 核心功能

- 🗂️ **16 大分类导航**：入门配置、推理引擎、模型微调、集群互联、模型量化、AI 应用、数据科学、开发工具、安全沙箱 + NVIDIA 官方资源等
- 📦 **NVIDIA 官方资源**：GitHub 仓库（17）、官方文档（131）、AI Workbench 参考
- 🧠 **NIM 模型库**：138 款模型按 10 大类别全量归档
- 🗺️ **AI 资源矩阵**：900+ 资源统一知识图谱
- ✅ **进度追踪**：指南/步骤两级完成状态，localStorage 持久化
- 🔍 **全局搜索**：侧边栏 + 顶栏双搜索入口
- 📤 **进度导入/导出**：JSON 格式，支持迁移与备份
- 🎨 **深色/浅色主题**：一键切换，本地持久记忆
- 📱 **响应式布局**：768px 断点移动端适配

---

## 快速开始

### 方式一：本地直接打开（零依赖）

```
open index.html
```

`index.html` 为单文件自包含应用，无任何外部 CDN 依赖，双击即可在浏览器中运行。

### 方式二：本地 HTTP 服务

```bash
# Python 3
python3 -m http.server 8000

# 或 Node.js
npx serve .

# 访问 http://localhost:8000
```

> 建议使用 HTTP 服务方式预览，避免 `file://` 协议下 localStorage 与剪贴板 API 的潜在限制。

---

## 本地开发

### 环境要求

- 任意现代浏览器（Chrome / Edge / Safari / Firefox）
- 可选：Python 3 或 Node.js（用于本地 HTTP 服务）
- **无构建步骤、无包管理器、无框架依赖**

### 技术栈

| 项目 | 方案 |
|------|------|
| 语言 | 原生 HTML + CSS + JavaScript |
| 框架 | 无（零依赖） |
| 存储 | localStorage（进度持久化） |
| 部署 | GitHub Pages（静态托管） |

---

## GitHub Pages 部署

> **当前部署模式**：GitHub Actions workflow（`build_type: workflow`），见 [.github/workflows/pages-deploy.yml](.github/workflows/pages-deploy.yml)

### 1. 初始化仓库并推送

```bash
git init
git add .
git commit -m "feat: DGX Spark 操作中心初始发布"
git branch -M main
git remote add origin https://github.com/YYC-Cube/NVIDIA-DGX-Workbench.git
git push -u origin main
```

### 2. 创建 Pages 部署 Workflow

Pages 设置为 **GitHub Actions** 模式时，必须存在部署流水线文件，否则站点不会构建（返回 404）。仓库已内置 [pages-deploy.yml](.github/workflows/pages-deploy.yml)：

```yaml
on:
  push:
    branches: [main]   # push main 自动触发
  workflow_dispatch:    # 支持手动触发

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: '.' }          # 发布仓库根目录
      - uses: actions/deploy-pages@v4
```

### 3. 配置 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. Source 选择 **GitHub Actions**（Build and deployment → Source）
3. 首次 `git push main` 后自动触发 Actions 构建

### 4. 验证部署

```bash
gh run list --repo YYC-Cube/NVIDIA-DGX-Workbench   # 查看构建状态
curl -I https://nvidia-workbench.yyc3.vip          # 期望 HTTP/2 200
```

- 默认地址：`https://YYC-Cube.github.io/NVIDIA-DGX-Workbench/`
- 站点根入口为 `index.html`，无需额外路由配置
- **每次 `git push main` 均自动重新构建发布**

---

## 自定义域名绑定

`nvidia-workbench.yyc3.vip` 域名绑定流程：

### 1. GitHub Pages 设置

进入 **Settings → Pages → Custom domain**，填入：

```
nvidia-workbench.yyc3.vip
```

保存后 GitHub 会自动创建 `CNAME` 文件并强制 HTTPS。

### 2. DNS 解析配置

在域名服务商（yyc3.vip 的 DNS 控制台）添加记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|----------|----------|--------|-----|
| CNAME | nvidia-workbench | `YYC-Cube.github.io` | 600 |

### 3. 生效验证

```bash
dig nvidia-workbench.yyc3.vip            # CNAME → YYC-Cube.github.io
curl -I https://nvidia-workbench.yyc3.vip  # 期望 HTTP/2 200
```

### 4. 当前线上状态

| 检查项 | 状态 |
| -------- | ------ |
| DNS CNAME → `yyc-cube.github.io` | ✅ 已验证 |
| HTTPS 证书（Let's Encrypt） | ✅ 已签发（有效期至 2026-11-16） |
| HTTPS 强制跳转 | ✅ 已开启（`https_enforced: true`） |
| 域名所有权 | ✅ 已确认（`protected_domain_state: verified`） |

---

## 数据维护指南

### 数据文件结构（单一数据源）

全部内容数据维护在 `DGX-SPARK-HUB-OFFLINE.html` 内联的 `GUIDES` / `SKILLS` 数组中（206 条指南 + 105 条技能 + 157 外部链接），`index.html` 为其逐字节一致的部署副本。字段结构：

```js
var GUIDES = [
  {
    id: 'g01',            // 唯一标识（用于 localStorage 进度键）
    order: 1,             // 侧边栏排序序号
    cat: 'getting-started', // 分类 key
    title: '指南标题',
    titleEn: 'English Title',
    diff: 'easy',         // easy | medium | hard
    time: '30 min',       // 预计耗时
    icon: '🤖',           // 卡片图标
    color: '#22c55e',     // 主题色
    desc: '简介',
    prereq: ['前置条件'],
    overview: [['标签', '值']],
    steps: [
      {
        n: 1,             // 步骤序号
        title: '步骤标题',
        time: '5 min',
        content: '步骤说明',
        code: [['bash', '命令代码']],  // [语言, 代码]
        warning: '警告',
        tip: '提示'
      }
    ]
  }
];
```

### 新增一条指南

> ⚠️ **单一数据源原则**：数据只在 `DGX-SPARK-HUB-OFFLINE.html` 中维护，改完必须执行 `cp DGX-SPARK-HUB-OFFLINE.html index.html` 同步部署入口，再 `git push main` 触发自动构建。

1. 在 `GUIDES` 数组中追加对象，保证 `id` 唯一、`order` 不重复
2. 分类 key 需在 `getCategoryLabels()` / `getCategoryColors()` 中注册（若为新分类）
3. 修改后同步执行 `cp DGX-SPARK-HUB-OFFLINE.html index.html` 确保部署版本一致
4. 提交并推送：`git push` 自动触发 Actions 重新构建（约 1 分钟）

### 分类注册表

| key | 中文标签 | 主题色 |
| ----- | ---------- | -------- |
| `getting-started` | 🚀 入门配置 | `#22c55e` |
| `inference` | ⚡ 推理引擎 | `#f59e0b` |
| `finetuning` | 🎯 模型微调 | `#8b5cf6` |
| `cluster` | 🔗 集群互联 | `#06b6d4` |
| `quantization` | 📉 模型量化 | `#3b82f6` |
| `ai-application` | 🤖 AI 应用 | `#ec4899` |
| `data-science` | 📊 数据科学 | `#14b8a6` |
| `development` | 🛠️ 开发工具 | `#f97316` |
| `security` | 🛡️ 安全沙箱 | `#ef4444` |
| `github-repos` | 📦 GitHub 仓库 | `#6366f1` |
| `nvidia-docs` | 📘 NVIDIA 官方资源 | `#76b900` |
| `mid-term` | 🔶 中期可选 | `#f59e0b` |
| `nvidia-resources` | 🗺️ AI 资源矩阵 | `#10b981` |
| `nim-models` | 🧠 NIM 模型库 | `#d946ef` |
| `yyc3-ops` | 🔧 YYC3 运维 | `#f43f5e` |
| `skills` | 🧰 NVIDIA Skills | `#a855f7` |

---

## 开发者指南

> 完整开发流程、数据维护规范、代码规范与提交 / PR 规范见 [CONTRIBUTING.md](CONTRIBUTING.md)；版本历史见 [CHANGELOG.md](CHANGELOG.md)。

### 常见开发任务

#### 1. 修改主题色

在 CSS `:root` 中修改 `--accent-v`（紫）与 `--accent-c`（青）：

```css
:root {
  --accent-v: #8b5cf6;  /* 品牌主色 */
  --accent-c: #06b6d4;  /* 辅助青色 */
}
```

#### 2. 添加新分类

1. 在 `getCategoryLabels()` 添加分类名映射
2. 在 `getCategoryColors()` 添加分类主题色
3. 在数据中使用新分类 key

#### 3. 修改搜索逻辑

`filterSidebar(q)`（侧边栏）与 `topbarSearch(val)`（顶栏）为双入口搜索，二者通过 `searchQuery` 变量同步。

#### 4. 进度存储约定

| 键格式 | 含义 |
| -------- | ------ |
| `guide-done-{id}` | 指南完成状态（'1' / '0'） |
| `step-done-{id}-{n}` | 步骤完成状态 |
| `step-open-{id}-{n}` | 步骤展开状态 |

### 代码规范

- 遵循本项目的设计体系：暗色优先、数据驱动、单文件架构、移动适配
- JS 字符串一律使用单引号（避免内嵌引号破坏语法）
- 数据变更后同步更新 `index.html`（部署入口）与 `DGX-SPARK-HUB-OFFLINE.html`（归档源）
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)（`feat` / `fix` / `docs` / `ci` / `chore`），描述使用中文
- 基础格式（UTF-8 / LF / 2 空格缩进）由 [.editorconfig](.editorconfig) 统一约束

### 常见问题（FAQ）

**Q: 为什么需要 index.html 和 OFFLINE 版两个文件？**
A: `DGX-SPARK-HUB-OFFLINE.html` 是唯一的数据维护源（独立命名、可直接双击离线运行），`index.html` 是 GitHub Pages 的默认入口文件（线上渲染唯一来源），后者由前者复制生成，两者内容保持一致。

**Q: 修改数据后线上不生效？**
A: 确认修改的是仓库 `main` 分支根目录的 `index.html`，然后 `git push` 触发 GitHub Actions workflow 自动重新构建（约 1 分钟）。可用 `gh run list --repo YYC-Cube/NVIDIA-DGX-Workbench` 查看构建状态。

**Q: 浏览器控制台报 `var(--mono)` 未定义？**
A: 该错误已修复，统一使用 `var(--font-mono)`。如遇自定义样式，请检查 CSS 变量名拼写。

---

## 文档体系

| 文档 | 说明 |
| ------ | ------ |
| [README.md](README.md) | 项目总览：架构 / 部署 / 数据维护（本文件） |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献指南：开发流程 / 数据规范 / 提交与 PR 规范 |
| [CHANGELOG.md](CHANGELOG.md) | 变更日志：版本历史与显著变更 |
| [SECURITY.md](SECURITY.md) | 安全策略：漏洞报告渠道与内容红线 |
| [LICENSE](LICENSE) | 版权与授权条款（保留所有权利） |

---

## 许可证

© 2025-2026 YYC³ (YanYuCloudCube™) · NVIDIA DGX Workbench 操作中心

本项目站点代码与内容归 YYC³ 所有，详见 [LICENSE](LICENSE)。涉及的 NVIDIA 品牌、模型名称与第三方链接版权归其各自所有者。示例代码仅供学习参考，生产环境请遵循官方文档与安全规范。
