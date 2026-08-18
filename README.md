# NVIDIA DGX Workbench · 操作中心

> **DGX Spark 操作中心** · YYC³ (YanYuCloudCube™)
> 在线访问：[https://nvidia-workbench.yyc3.vip](https://nvidia-workbench.yyc3.vip)

NVIDIA DGX Spark / GB10 桌面级 AI 超算的**全链路操作指南平台**。涵盖入门配置、推理引擎、模型微调、集群互联、模型量化、AI 应用、数据科学、开发工具与安全沙箱等 9 大核心领域，并集成 NVIDIA 官方资源、NIM 模型库（138 款）与 AI 资源矩阵知识图谱（900+ 资源）。

---

## 目录

- [项目结构](#项目结构)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [本地开发](#本地开发)
- [GitHub Pages 部署](#github-pages-部署)
- [自定义域名绑定](#自定义域名绑定)
- [数据维护指南](#数据维护指南)
- [开发者指南](#开发者指南)
- [许可证](#许可证)

---

## 项目结构

```
nvidia-workbench/
├── index.html                  # 部署入口（单文件离线版，内联全部数据与样式）
├── DGX-SPARK-HUB-OFFLINE.html  # 离线版源文件（零依赖，可直接双击运行）
├── DGX-SPARK-HUB.html          # 在线版（引用 DGX-SPARK-DATA.js 分离数据）
├── DGX-SPARK-DATA.js           # 数据文件（GUIDES 指南 + SKILLS 技能）
├── README.md                   # 开发者文档（本文件）
├── AI-资源矩阵-统一知识图谱.md  # 数据源文档：900+ 资源分类归档
├── NVIDIA-NIM-全量模型-分析报告.md  # 数据源文档：138 款 NIM 模型分析
├── NVIDIA-DGX-Spark.md         # DGX Spark 硬件说明文档
├── YYC3-HTML-设计指导文档.md   # YYC³ HTML 应用统一设计规范
├── YYC3-Node-运维手册.md       # Node 服务标准化运维手册
├── YYC3-My管理思维-*.md        # 管理思维转型文档
├── YYC3-管理思维-智能一体化转型.html  # 管理思维可视化页面
├── ngc_health_check.sh         # NGC 环境健康自检脚本
└── clean-dsstore.sh            # 清理 .DS_Store 辅助脚本
```

### 部署文件说明

| 文件 | 类型 | 说明 |
| ------ | ------ | ------ |
| `index.html` | 部署入口 | GitHub Pages 默认入口，基于离线版构建，内联全部数据 |
| `DGX-SPARK-HUB.html` + `DGX-SPARK-DATA.js` | 在线分离版 | 数据与页面分离，便于独立维护数据 |
| `DGX-SPARK-HUB-OFFLINE.html` | 单文件归档 | 全量内联，适合离线分发/本地存档 |

---

## 功能特性

- 🗂️ **9 大核心领域**：入门配置、推理引擎、模型微调、集群互联、模型量化、AI 应用、数据科学、开发工具、安全沙箱
- 📦 **NVIDIA 官方资源**：GitHub 仓库、官方文档、AI Workbench 参考
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

### 1. 初始化仓库并推送

```bash
git init
git add .
git commit -m "feat: DGX Spark 操作中心初始发布"
git branch -M main
git remote add origin https://github.com/YYC-Cube/NVIDIA-DGX-Workbench.git
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选择 **main**，目录选择 **/ (root)**
4. 保存后等待构建（约 1 分钟）

### 3. 验证部署

- 默认地址：`https://YYC-Cube.github.io/NVIDIA-DGX-Workbench/`
- 站点根入口为 `index.html`，无需额外路由配置

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
dig nvidia-workbench.yyc3.vip
curl -I https://nvidia-workbench.yyc3.vip
```

DNS 解析生效一般需 5~30 分钟。

---

## 数据维护指南

### 数据文件结构

**在线版数据**（`DGX-SPARK-DATA.js`）：

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

### 离线版数据

`index.html` / `DGX-SPARK-HUB-OFFLINE.html` 的 `GUIDES` 数组内联在 `<script>` 标签中，结构同上。

### 新增一条指南

1. 在 `GUIDES` 数组中追加对象，保证 `id` 唯一、`order` 不重复
2. 分类 key 需在 `getCategoryLabels()` / `getCategoryColors()` 中注册（若为新分类）
3. 离线版与在线版需**同步维护**数据

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

- 遵循 `YYC3-HTML-设计指导文档.md` 中定义的设计体系（暗色优先、数据驱动、单文件架构）
- JS 字符串一律使用单引号（避免内嵌引号破坏语法）
- 新增数据时同步维护离线版与在线版

### 常见问题（FAQ）

**Q: 为什么需要 index.html 和 OFFLINE 版两个文件？**
A: `index.html` 是 GitHub Pages 的默认入口文件，`DGX-SPARK-HUB-OFFLINE.html` 是带独立命名的离线归档源文件，两者内容一致。

**Q: 修改数据后线上不生效？**
A: 确认修改的是仓库 `main` 分支根目录的 `index.html`，并等待 GitHub Pages 重新构建（约 1 分钟）。

**Q: 浏览器控制台报 `var(--mono)` 未定义？**
A: 该错误已修复，统一使用 `var(--font-mono)`。如遇自定义样式，请检查 CSS 变量名拼写。

---

## 许可证

© 2025 YYC³ (YanYuCloudCube™) · NVIDIA DGX Workbench 操作中心

本项目的站点代码与内容归 YYC³ 所有。涉及的 NVIDIA 品牌、模型名称与第三方链接版权归其各自所有者。示例代码仅供学习参考，生产环境请遵循官方文档与安全规范。
