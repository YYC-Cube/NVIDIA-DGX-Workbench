# 变更日志 · Changelog

本项目所有显著变更均记录于此文件。
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本管理遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- **feat**：站点界面内置**中英双语（zh/en）离线支持** —— 顶栏新增语言切换按钮，`I18N` 词典（49 键 × 双语）完全内联零网络请求；语言偏好 localStorage 持久化，切换时全量重渲染侧边栏 / 仪表盘 / 指南详情 / 技能面板并保持筛选状态；指南标题按 `titleEn` 优先、中文兜底策略显示（已覆盖 70/206）
- **feat**：响应式与无障碍增强 —— 移动端顶栏瘦身（隐藏时钟 / 副标题、标题截断）、480px 窄屏断点、触屏点击目标加大、`prefers-reduced-motion` 减少动效支持、键盘焦点环、细滚动条
- **docs**：新增英文版项目文档 [README.en.md](README.en.md)，与中文版结构对齐；README.md 顶部增加语言切换入口，并新增「多语言（i18n）开发指南」章节（架构说明 / 新增文案 / 新增语言 / 注意事项）

### Changed

- **feat**：localStorage 读写统一收敛至 `lsGet()` / `lsSet()` 安全封装，`file://` 或隐私模式下静默降级，避免存储异常导致脚本中断
- **feat**：`<title>` 与 `<html lang>` 随语言切换动态更新，保证文档元信息与界面语言一致

## [0.4.0] - 2026-08-19

### Changed

- **docs**：基于开源社区标准新增开发者文档体系 —— [CONTRIBUTING.md](CONTRIBUTING.md)（贡献指南）、[SECURITY.md](SECURITY.md)（安全策略）、[.editorconfig](.editorconfig)（编辑器规范）
- **license**：许可证由"保留所有权利"变更为 **MIT License** —— 允许任何个人或组织复制、修改、分发、再许可与商业使用（含机器学习训练用途），仅需保留版权与许可声明；未授予任何商标权
- **docs**：README 同步更新项目结构与文档导航

### Removed

- **chore**：移除与站点项目无关的本地运维脚本 `clean-dsstore.sh`、`ngc_health_check.sh`、`sudo-ops-summary.sh`（含内网拓扑等敏感信息，且被 Pages 流水线整体发布至公网）
- **chore**：移除过时的在线分离版 `DGX-SPARK-HUB.html` + `DGX-SPARK-DATA.js`（仅含 24 条知识图谱子集数据，落后于全量版），数据源收敛为 `DGX-SPARK-HUB-OFFLINE.html` → `index.html` 单一链路

## [0.3.0] - 2026-08-18

### Added

- **docs**：README 增加可视化架构展示（全链路架构总览、数据流示意、CI/CD 流水线、16 大分类架构图），并对齐线上部署状态（DNS / HTTPS / 域名验证）

## [0.2.0] - 2026-08-18

### Added

- **ci**：新增 GitHub Pages 部署 workflow（`pages-deploy.yml`），`main` 分支 push 自动构建发布，支持手动触发

## [0.1.1] - 2026-08-18

### Removed

- **chore**：清理无关文档文件，README 目录结构更新

## [0.1.0] - 2026-08-18

### Added

- **feat**：DGX Spark 操作中心初始发布
  - 单文件零依赖静态站点（`index.html`）：206 篇 操作指南、218 个操作步骤、16 大主分类
  - NVIDIA Skills 技能库：105 条技能、21 大技能领域
  - 数据源文档：AI 资源矩阵统一知识图谱（900+ 资源）、NIM 全量模型分析报告（138 款）
  - 进度追踪（localStorage 持久化）、全局搜索、进度导入导出、深浅主题、响应式布局
  - 在线分离版（`DGX-SPARK-HUB.html` + `DGX-SPARK-DATA.js`）与离线归档版（`DGX-SPARK-HUB-OFFLINE.html`）

[Unreleased]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/commits/v0.1.0
[0.1.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/commits/v0.1.0
