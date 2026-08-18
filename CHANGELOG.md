# 变更日志 · Changelog

本项目所有显著变更均记录于此文件。
格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本管理遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Changed

- **docs**：基于开源社区标准新增开发者文档体系 —— [CONTRIBUTING.md](CONTRIBUTING.md)（贡献指南）、[SECURITY.md](SECURITY.md)（安全策略）、[.editorconfig](.editorconfig)（编辑器规范）
- **docs**：新增 [LICENSE](LICENSE)（版权声明），README 同步更新项目结构与文档导航

### Removed

- **chore**：移除与站点项目无关的本地运维脚本 `clean-dsstore.sh`、`ngc_health_check.sh`、`sudo-ops-summary.sh`（其中包含内网拓扑等敏感运维信息，且会被 Pages 流水线整体发布至公网）

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

[Unreleased]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/commits/v0.1.0
[0.1.0]: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/commits/v0.1.0
