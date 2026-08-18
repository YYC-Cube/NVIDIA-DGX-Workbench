# 贡献指南 · Contributing Guide

感谢关注 **NVIDIA DGX Workbench · DGX Spark 操作中心**！本文说明如何参与本项目的开发与内容维护。开始前请先阅读 [README.md](README.md) 了解项目定位与架构。

---

## 目录

- [项目约定](#项目约定)
- [环境准备](#环境准备)
- [开发流程](#开发流程)
- [数据维护规范](#数据维护规范)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)
- [自检清单](#自检清单)

---

## 项目约定

本项目为**零依赖静态单文件站点**，请务必遵守以下核心约定：

1. **单一部署入口**：GitHub Pages 线上只渲染根目录 `index.html`。
2. **双文件同步原则**：`index.html` 与 `DGX-SPARK-HUB-OFFLINE.html` 内容必须保持一致。数据变更流程为：
   ```bash
   # 在 DGX-SPARK-HUB-OFFLINE.html 中完成修改后
   cp DGX-SPARK-HUB-OFFLINE.html index.html
   ```
3. **推送即上线**：`main` 分支的每次 push 都会触发 [pages-deploy.yml](.github/workflows/pages-deploy.yml) 自动构建发布（约 1 分钟），请谨慎对待每一次提交。
4. **无关文件不入库**：本地运维脚本、IDE 配置、系统临时文件等与站点无关的内容不得提交（参见 [.gitignore](.gitignore)）。

## 环境准备

| 依赖 | 要求 | 用途 |
| ------ | ------ | ------ |
| 浏览器 | Chrome / Edge / Safari / Firefox 任一现代版本 | 预览与调试 |
| Git | ≥ 2.30 | 版本控制 |
| Python 3 或 Node.js | 可选 | 本地 HTTP 预览服务 |

无构建步骤、无包管理器、无框架依赖，克隆即可开发：

```bash
git clone git@github.com:YYC-Cube/NVIDIA-DGX-Workbench.git
cd NVIDIA-DGX-Workbench
python3 -m http.server 8000   # 或 npx serve .
# 浏览器访问 http://localhost:8000
```

## 开发流程

```bash
# 1. 从 main 拉取最新代码并创建功能分支
git checkout main && git pull
git checkout -b feat/your-feature     # 或 fix/、docs/ 前缀

# 2. 修改内容（数据变更请遵循下节规范）

# 3. 本地验证（见「自检清单」），确认无误后提交
git add <变更文件>
git commit -m "feat: 简明描述变更内容"

# 4. 推送并创建 Pull Request
git push -u origin feat/your-feature
```

## 数据维护规范

线上数据为 `index.html` 内联的 `GUIDES` / `SKILLS` 数组（206 条指南 + 105 条技能），字段结构定义见 [README.md · 数据维护指南](README.md#数据维护指南)。

新增 / 修改一条指南时：

1. 在 `GUIDES` 数组追加或修改对象，保证：
   - `id` 全局唯一（用作 localStorage 进度键，**发布后不可变更**，否则用户进度丢失）
   - `order` 不与其他条目重复
2. 若引入新分类：需同时在 `getCategoryLabels()` 与 `getCategoryColors()` 注册，并更新 README 的「分类注册表」
3. `steps` 内的 `code` 字段格式为 `[语言, 代码]` 二元数组
4. 修改完成后执行 `cp DGX-SPARK-HUB-OFFLINE.html index.html` 同步部署入口
5. 外部链接需可公开访问，不得引用内网地址、密钥或私有凭证

## 代码规范

- **JS 字符串一律使用单引号**，避免内嵌引号破坏语法
- 缩进 2 空格，编码 UTF-8，换行 LF（由 [.editorconfig](.editorconfig) 约束）
- CSS 遵循现有设计体系：暗色优先、CSS 变量（`:root`）驱动主题、768px 移动端断点
- 不引入任何外部 CDN、构建工具或运行时框架，保持零依赖单文件架构
- 不改动 localStorage 键格式（`guide-done-{id}` / `step-done-{id}-{n}` / `step-open-{id}-{n}`），保证用户进度兼容

## 提交信息规范

采用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，描述使用中文，与现有历史保持一致：

| 类型 | 用途 | 示例 |
| ------ | ------ | ------ |
| `feat` | 新功能 / 新指南内容 | `feat: 新增模型量化指南 2 篇` |
| `fix` | 缺陷修复 | `fix: 修复侧边栏搜索在 Safari 下失效` |
| `docs` | 文档变更 | `docs: README 补充部署验证步骤` |
| `ci` | CI / 部署流水线 | `ci: pages 工作流增加构建缓存` |
| `chore` | 构建 / 杂项 | `chore: 清理无关运维脚本` |

## Pull Request 流程

1. PR 目标分支为 `main`，标题遵循上述提交信息规范
2. 描述中说明变更动机、影响范围（数据条数变化、分类变更等）
3. 等待 GitHub Pages 的 Actions 预览通过（PR 不触发部署，合入 `main` 后自动上线）
4. 至少一名维护者 review 通过后合入

## 自检清单

提交前请逐项确认：

- [ ] `python3 -m http.server 8000` 本地预览功能正常（导航 / 搜索 / 步骤勾选 / 主题切换）
- [ ] `index.html` 与 `DGX-SPARK-HUB-OFFLINE.html` 已同步（`diff` 无差异或差异符合预期）
- [ ] 新增条目的 `id` / `order` 无冲突，分类已在注册表中登记
- [ ] 浏览器控制台无报错（重点检查 CSS 变量名拼写，如 `var(--font-mono)`）
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] 未引入与站点无关的文件、内网信息或敏感凭证

---

## 许可证

提交即表示你同意贡献内容遵循 [LICENSE](LICENSE) 中的授权条款。
