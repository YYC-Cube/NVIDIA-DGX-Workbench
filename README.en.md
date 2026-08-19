# NVIDIA DGX Workbench · Hub

> **DGX Spark Hub** · YYC³ (YanYuCloudCube™)
> Live at: [https://nvidia-workbench.yyc3.vip](https://nvidia-workbench.yyc3.vip)

**Languages / 文档语言**：[简体中文](README.md) · **English** (this file)

A **full-stack operations guide platform** for the NVIDIA DGX Spark / GB10 desktop-class AI supercomputer. It covers 9 core domains — initial setup, inference engines, model fine-tuning, cluster interconnect, model quantization, AI applications, data science, developer tooling, and security sandboxing — and integrates NVIDIA official resources, the NIM model library (138 models), and the AI resource matrix knowledge graph (900+ resources). **The site UI ships with built-in Chinese/English bilingual support (works fully offline, one-click switching).**

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Custom Domain Binding](#custom-domain-binding)
- [Data Maintenance Guide](#data-maintenance-guide)
- [Developer Guide](#developer-guide)
- [Documentation](#documentation)
- [License](#license)

---

## System Architecture

### 1. End-to-End Architecture Overview

```
                ┌─────────────────────────────────────────────────────────┐
                │              nvidia-workbench.yyc3.vip                  │
                │              DGX Spark Hub · YYC³                       │
                └──────────────────────────┬──────────────────────────────┘
                                           │ HTTPS (HTTP/2 · TLS 1.3)
                                           ▼
                ┌─────────────────────────────────────────────────────────┐
                │                    Presentation Layer                   │
                │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
                │   │ Sidebar Nav │  │ Dashboard   │  │ Guide Detail │    │
                │   │ Search/Sync │  │ Filter/Cat  │  │ Step/Toggle  │    │
                │   └─────────────┘  └─────────────┘  └─────────────┘     │
                ├─────────────────────────────────────────────────────────┤
                │                       Data Layer                        │
                │   ┌───────────────────────────────────────────────┐     │
                │   │  GUIDES ×206  │ SKILLS ×105  │ 16 categories  │     │
                │   │  Steps ×218   │ Links ×157   │ Badges/Themes  │     │
                │   └───────────────────────────────────────────────┘     │
                ├─────────────────────────────────────────────────────────┤
                │                     Storage Layer                       │
                │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
                │   │ localStorage │  │ Hash Route  │  │ localStorage │    │
                │   │ Progress     │  │ Deep links  │  │ Theme/Lang   │    │
                │   └─────────────┘  └─────────────┘  └─────────────┘     │
                └─────────────────────────────────────────────────────────┘
```

### 2. Data Flow

```
┌──────────┐   DOMContentLoaded   ┌──────────┐   render    ┌──────────┐
│  init()  │ ───────────────────▶ │ buildSide│ ──────────▶ │ Sidebar/ │
└──────────┘                      │ bar()    │             │ Cards    │
      │                           └──────────┘             └──────────┘
      │ setInterval(1s)                │ filterByCategory       │ click
      ▼                                ▼                        ▼
┌──────────┐                      ┌──────────┐            ┌──────────┐
│  Clock   │                      │ applyFil │            │showGuide │
└──────────┘                      │ ters()   │            └────┬─────┘
      ▲                           └──────────┘                 │ steps
      │                                                        ▼
┌──────────┐     localStorage       ┌──────────┐      ┌──────────────┐
│toggleDone│◀─────────────────────▶ │ Progress │◀──── │  toggleStep  │
└──────────┘  guide-done-{id}       │   KV     │      │  Done (n)    │
                                   └──────────┘      └──────────────┘
```

### 3. Deployment & CI/CD Pipeline

```
┌──────────┐  git push  ┌───────────────┐  trigger  ┌──────────────────┐
│  Local   │ ─────────▶ │ GitHub Remote │ ────────▶ │ GitHub Actions   │
│  Repo    │            │ YYC-Cube/     │           │ pages-deploy.yml │
└──────────┘            │ NVIDIA-DGX-   │           └────────┬─────────┘
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

### 4. Content Category Architecture (16 Top-Level Categories)

```
                     ┌──────────────────────────┐
                     │    DGX Spark Hub         │
                     │  206 guides · 218 steps  │
                     └────────────┬─────────────┘
        ┌────────────┬────────────┼────────────┬──────────────┐
        ▼            ▼            ▼            ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐
│ 🚀 Getting  │ │ ⚡ Inference│ │ 🎯 Fine- │ │ 🔗 Cluster│ │ 📉 Quant-  │
│ Started ×1  │ │ Engines ×9 │ │ tuning ×6│ │ Interconnect│ │ ization ×1│
└─────────────┘ └──────────┘ └──────────┘ │ ×5        │ └────────────┘
┌────────────┐ ┌──────────┐ ┌──────────┐ └──────────┘ ┌────────────┐
│ 🤖 AI Apps │ │ 📊 Data  │ │ 🛠️ Dev   │ │ 🛡️ Security│ │ 📦 GitHub  │
│   ×11      │ │ Science ×4│ │ Tools ×7 │ │ Sandbox ×1 │ │ Repos ×17  │
└────────────┘ └──────────┘ └──────────┘ └──────────┘ └────────────┘
┌────────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────┐
│ 📘 NVIDIA  │ │ 🔶 Mid-  │ │ 🗺️ Resource  │ │ 🧠 NIM    │ │ 🔧 YYC3   │
│ Docs ×131  │ │ term ×9  │ │ Matrix ×8    │ │ Models ×12│ │ Ops ×4    │
└────────────┘ └──────────┘ └──────────────┘ └──────────┘ └──────────┘
```

> Plus 21 NVIDIA Skills sub-categories (RAG / Megatron / cuOpt / Holoscan / TAO … 105 skills in total), installable via `npx skills add`.

---

## Project Structure

```
nvidia-workbench/
├── index.html                  # Deployment entry (single-file offline build, all data/styles inlined)
├── DGX-SPARK-HUB-OFFLINE.html  # Data source file (zero dependencies, double-click to run)
├── README.md                   # Project overview & developer docs (Chinese)
├── README.en.md                # English documentation (this file)
├── CONTRIBUTING.md             # Contributing guide: workflow / data conventions / commit & PR rules
├── CHANGELOG.md                # Changelog (Keep a Changelog format)
├── SECURITY.md                 # Security policy: reporting channels & content red lines
├── LICENSE                     # Copyright notice (MIT)
├── .editorconfig               # Editor conventions (UTF-8 / LF / 2-space indent)
├── AI-资源矩阵-统一知识图谱.md  # Source doc: 900+ resources, categorized (Chinese)
├── NVIDIA-NIM-全量模型-分析报告.md  # Source doc: 138 NIM models analysis (Chinese)
├── NVIDIA-DGX-Spark.md         # DGX Spark hardware notes (Chinese)
└── .github/workflows/pages-deploy.yml  # CI: auto-deploy GitHub Pages on push to main
```

> The repository keeps only site-related files; local ops scripts, IDE configs, and other unrelated content are excluded by [.gitignore](.gitignore) and never committed or published.

### Deployment Files

| File | Role | Notes |
| ------ | ------ | ------ |
| `DGX-SPARK-HUB-OFFLINE.html` | **Single source of truth** | Fully inlined `GUIDES` / `SKILLS` arrays; all data changes are maintained here |
| `index.html` | Deployment entry | Default GitHub Pages entry, byte-identical copy of the data source (`cp DGX-SPARK-HUB-OFFLINE.html index.html`) |

---

## Features

### Content Scale (mirrors the live site)

| Metric | Count |
| -------- | ------ |
| Operation guides | **206** (incl. 157 external resources) |
| Operation steps | **218** |
| NVIDIA Skills | **105** across 21 skill domains |
| Top-level categories | **16** |
| Content sources | AI Resource Matrix (900+ resources) + NIM model library (138 models) |

### Core Features

- 🗂️ **16-category navigation**: Getting Started, Inference Engines, Fine-tuning, Cluster Interconnect, Quantization, AI Applications, Data Science, Dev Tools, Security Sandbox + NVIDIA official resources and more
- 📦 **NVIDIA official resources**: GitHub repositories (17), official docs (131), AI Workbench references
- 🧠 **NIM model library**: all 138 models archived across 10 categories
- 🗺️ **AI resource matrix**: unified knowledge graph of 900+ resources
- ✅ **Progress tracking**: two-level completion state (guide/step), persisted in localStorage
- 🔍 **Global search**: dual entry points — sidebar + topbar
- 📤 **Progress import/export**: JSON format for migration and backup
- 🎨 **Dark/light theme**: one-click toggle with local persistence
- 🌐 **Bilingual UI (zh/en)**: one-click topbar switcher, dictionary fully inlined with zero network requests — works offline; preference persisted in localStorage
- ♿ **Accessibility & responsiveness**: keyboard focus rings, `prefers-reduced-motion` support, dual-breakpoint (768px / 480px) mobile layouts

---

## Quick Start

### Option 1: Open locally (zero dependencies)

```
open index.html
```

`index.html` is a self-contained single-file application with no external CDN dependencies — double-click to run it in a browser.

### Option 2: Local HTTP server

```bash
# Python 3
python3 -m http.server 8000

# or Node.js
npx serve .

# Visit http://localhost:8000
```

> Serving over HTTP is recommended to avoid potential `file://` restrictions on localStorage and the Clipboard API.

---

## Local Development

### Requirements

- Any modern browser (Chrome / Edge / Safari / Firefox)
- Optional: Python 3 or Node.js (for a local HTTP server)
- **No build step, no package manager, no framework dependencies**

### Tech Stack

| Item | Choice |
|------|------|
| Language | Vanilla HTML + CSS + JavaScript |
| Framework | None (zero dependencies) |
| Storage | localStorage (progress persistence) |
| Deployment | GitHub Pages (static hosting) |

---

## GitHub Pages Deployment

> **Current deployment mode**: GitHub Actions workflow (`build_type: workflow`), see [.github/workflows/pages-deploy.yml](.github/workflows/pages-deploy.yml)

### 1. Initialize and push the repository

```bash
git init
git add .
git commit -m "feat: DGX Spark Hub initial release"
git branch -M main
git remote add origin https://github.com/YYC-Cube/NVIDIA-DGX-Workbench.git
git push -u origin main
```

### 2. Create the Pages deployment workflow

When Pages is set to **GitHub Actions** mode, the pipeline file must exist or the site will not build (it returns 404). The repository ships [pages-deploy.yml](.github/workflows/pages-deploy.yml):

```yaml
on:
  push:
    branches: [main]   # auto-trigger on push to main
  workflow_dispatch:    # manual trigger supported

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
        with: { path: '.' }          # publish the repo root
      - uses: actions/deploy-pages@v4
```

### 3. Configure GitHub Pages

1. Open the repository's **Settings → Pages**
2. Under Build and deployment → Source, choose **GitHub Actions**
3. The first `git push main` automatically triggers the Actions build

### 4. Verify the deployment

```bash
gh run list --repo YYC-Cube/NVIDIA-DGX-Workbench   # check build status
curl -I https://nvidia-workbench.yyc3.vip          # expect HTTP/2 200
```

- Default address: `https://YYC-Cube.github.io/NVIDIA-DGX-Workbench/`
- The site root entry is `index.html`; no extra routing configuration needed
- **Every `git push main` automatically rebuilds and republishes**

---

## Custom Domain Binding

Binding flow for `nvidia-workbench.yyc3.vip`:

### 1. GitHub Pages settings

Open **Settings → Pages → Custom domain** and enter:

```
nvidia-workbench.yyc3.vip
```

GitHub automatically creates the `CNAME` file and enforces HTTPS.

### 2. DNS configuration

Add a record in the DNS console of your domain provider (for yyc3.vip):

| Record type | Host | Value | TTL |
|----------|----------|--------|-----|
| CNAME | nvidia-workbench | `YYC-Cube.github.io` | 600 |

### 3. Verify propagation

```bash
dig nvidia-workbench.yyc3.vip            # CNAME → YYC-Cube.github.io
curl -I https://nvidia-workbench.yyc3.vip  # expect HTTP/2 200
```

### 4. Current live status

| Check | Status |
| -------- | ------ |
| DNS CNAME → `yyc-cube.github.io` | ✅ Verified |
| HTTPS certificate (Let's Encrypt) | ✅ Issued (valid through 2026-11-16) |
| HTTPS enforcement | ✅ Enabled (`https_enforced: true`) |
| Domain ownership | ✅ Confirmed (`protected_domain_state: verified`) |

---

## Data Maintenance Guide

### Data File Structure (single data source)

All content data lives in the inline `GUIDES` / `SKILLS` arrays inside `DGX-SPARK-HUB-OFFLINE.html` (206 guides + 105 skills + 157 external links); `index.html` is its byte-identical deployment copy. Field structure:

```js
var GUIDES = [
  {
    id: 'g01',            // unique key (used for localStorage progress keys)
    order: 1,             // sidebar sort order
    cat: 'getting-started', // category key
    title: '指南标题',      // Chinese title
    titleEn: 'English Title', // English title (falls back to `title` in EN mode when absent)
    diff: 'easy',         // easy | medium | hard
    time: '30 min',       // estimated duration
    icon: '🤖',           // card icon
    color: '#22c55e',     // theme color
    desc: '简介',          // description (Chinese)
    prereq: ['前置条件'],   // prerequisites
    overview: [['标签', '值']], // key-value overview chips
    steps: [
      {
        n: 1,             // step number
        title: '步骤标题',
        time: '5 min',
        content: '步骤说明',
        code: [['bash', 'command code']],  // [language, code]
        warning: '警告',
        tip: '提示'
      }
    ]
  }
];
```

### Adding a guide

> ⚠️ **Single-source principle**: data is maintained only in `DGX-SPARK-HUB-OFFLINE.html`. After editing, always run `cp DGX-SPARK-HUB-OFFLINE.html index.html` to sync the deployment entry, then `git push main` to trigger the rebuild.

1. Append an object to the `GUIDES` array; keep `id` unique and `order` non-duplicated
2. New category keys must be registered in `getCategoryLabels()` / `getCategoryColors()` (both the zh and en branches)
3. After changes, run `cp DGX-SPARK-HUB-OFFLINE.html index.html` to keep the deployed copy in sync
4. Commit and push: `git push` auto-triggers the Actions rebuild (~1 minute)

### Category Registry

| key | Label (zh) | Label (en) | Theme color |
| ----- | ---------- | ---------- | -------- |
| `getting-started` | 🚀 入门配置 | Getting Started | `#22c55e` |
| `inference` | ⚡ 推理引擎 | Inference Engines | `#f59e0b` |
| `finetuning` | 🎯 模型微调 | Fine-tuning | `#8b5cf6` |
| `cluster` | 🔗 集群互联 | Cluster Interconnect | `#06b6d4` |
| `quantization` | 📉 模型量化 | Quantization | `#3b82f6` |
| `ai-application` | 🤖 AI 应用 | AI Applications | `#ec4899` |
| `data-science` | 📊 数据科学 | Data Science | `#14b8a6` |
| `development` | 🛠️ 开发工具 | Dev Tools | `#f97316` |
| `security` | 🛡️ 安全沙箱 | Security Sandbox | `#ef4444` |
| `github-repos` | 📦 GitHub 仓库 | GitHub Repos | `#6366f1` |
| `nvidia-docs` | 📘 NVIDIA 官方资源 | NVIDIA Official Docs | `#76b900` |
| `mid-term` | 🔶 中期可选 | Mid-term Optional | `#f59e0b` |
| `nvidia-resources` | 🗺️ AI 资源矩阵 | AI Resource Matrix | `#10b981` |
| `nim-models` | 🧠 NIM 模型库 | NIM Models | `#d946ef` |
| `yyc3-ops` | 🔧 YYC3 运维 | YYC3 Ops | `#f43f5e` |
| `skills` | 🧰 NVIDIA Skills | NVIDIA Skills | `#a855f7` |

---

## Developer Guide

> Full workflow, data conventions, code standards, and commit/PR rules live in [CONTRIBUTING.md](CONTRIBUTING.md); version history in [CHANGELOG.md](CHANGELOG.md). (Both are currently Chinese; English translations welcome.)

### Common Development Tasks

#### 1. Change the theme colors

Edit `--accent-v` (violet) and `--accent-c` (cyan) in the CSS `:root` block:

```css
:root {
  --accent-v: #8b5cf6;  /* brand primary */
  --accent-c: #06b6d4;  /* secondary cyan */
}
```

#### 2. Add a new category

1. Add the label mapping in `getCategoryLabels()` — both the zh and en branches
2. Add the theme color in `getCategoryColors()`
3. Use the new category key in the data

#### 3. Modify search behavior

`filterSidebar(q)` (sidebar) and `topbarSearch(val)` (topbar) are the dual search entry points, synchronized through the `searchQuery` variable. Search matches the currently displayed titles, so it works against English titles in EN mode and Chinese titles in zh mode.

#### 4. Progress storage contract

| Key format | Meaning |
| -------- | ------ |
| `guide-done-{id}` | Guide completion state ('1' / '0') |
| `step-done-{id}-{n}` | Step completion state |
| `step-open-{id}-{n}` | Step expansion state |
| `theme` | UI theme ('dark' / 'light') |
| `lang` | UI language ('zh' / 'en') |

> All localStorage access goes through the `lsGet()` / `lsSet()` safe wrappers: if storage fails (e.g. `file://` protocol or private browsing mode), it degrades silently and the UI keeps working — only persistence is lost.

### Internationalization (i18n) Guide

The site ships a **bilingual (zh/en) UI**. The entire dictionary is inlined in the `I18N` constant at the top of the application-logic script inside `DGX-SPARK-HUB-OFFLINE.html` — **zero external requests, fully offline-capable**.

#### Architecture

| Part | Location | Responsibility |
| ------ | ------ | ------ |
| `I18N` dictionary | Top of the app-logic script | `zh` / `en` language objects with identical key sets (49 keys each, plus `_code` / `_label` / `docTitle` meta keys) |
| `t(key)` | Lookup function | Current language → zh fallback → returns the key itself, so a missing translation never blanks the UI |
| `tf(key, vars)` | Template lookup | Fills `{placeholder}` variables, e.g. `tf('viewAllSteps', {n: 12})` |
| `guideTitle(g)` | Data lookup | EN mode prefers `g.titleEn`, falling back to `g.title` (Chinese) |
| `applyStaticI18n()` | Static refresh | Refreshes elements tagged with `data-i18n` / `data-i18n-ph` (placeholder) / `data-i18n-title` (tooltip); syncs `<html lang>` and `<title>` |
| `setLanguage(lang)` | Switch entry point | Persists → refreshes static text → re-renders sidebar/dashboard/skills panel/detail view and restores the active filter state |

#### Data field conventions

- `GUIDES[].titleEn`: English title. Currently 70 entries are covered; **entries without it fall back to the Chinese title in EN mode**. Fill them in progressively — no big-bang completion required.
- Body data (`desc`, `steps[].title`, `content`, …) is currently Chinese; all UI chrome text (navigation, buttons, stats, prompts, dialogs) is fully bilingual.

#### Adding a UI string

1. Add the same key to **both** `I18N.zh` and `I18N.en` (key sets must stay identical)
2. In dynamic rendering code, call `t('key')` or `tf('key', {n: xxx})`
3. In static HTML, tag the element with `data-i18n="key"` (text), `data-i18n-ph="key"` (input placeholder), or `data-i18n-title="key"` (hover title)
4. Run `cp DGX-SPARK-HUB-OFFLINE.html index.html` and commit

#### Adding a third language

1. Add a new language object to `I18N` (e.g. `ja`) with all keys plus `_code` / `_label` / `docTitle`
2. Add the code to the `currentLang` initialization whitelist and `setLanguage()`
3. Extend `getCategoryLabels()` and the `catNames` map in `renderSkillsPanel()` with a branch for the new language

#### Caveats

- **Key parity**: if key sets drift between languages, missing keys silently fall back to Chinese — no errors, but the UI becomes mixed-language. Verify before committing.
- **Placeholder parity**: template variables like `{n}` must use identical names and sets in both languages, otherwise literal `{n}` text will leak through.
- **Switch = re-render**: language switching rebuilds all dynamic views. When adding render functions, always source text from `t()` instead of hardcoding strings.

### Code Conventions

- Follow the project design system: dark-first, data-driven, single-file architecture, mobile-adapted
- JS strings use single quotes throughout (avoids embedded quotes breaking syntax)
- After data changes, sync both `index.html` (deployment entry) and `DGX-SPARK-HUB-OFFLINE.html` (archived source)
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat` / `fix` / `docs` / `ci` / `chore`), with Chinese descriptions
- Basic formatting (UTF-8 / LF / 2-space indent) is enforced by [.editorconfig](.editorconfig)

### FAQ

**Q: Why do both index.html and the OFFLINE file exist?**
A: `DGX-SPARK-HUB-OFFLINE.html` is the single maintenance source (distinctly named, double-click to run offline); `index.html` is the default GitHub Pages entry (the only thing the live site renders), generated by copying the former. The two stay byte-identical.

**Q: Changes don't show up on the live site?**
A: Confirm you edited `index.html` at the repository root on `main`, then `git push` to trigger the GitHub Actions rebuild (~1 minute). Check status with `gh run list --repo YYC-Cube/NVIDIA-DGX-Workbench`.

**Q: Does language switching work offline (no network / double-clicked file)?**
A: Yes. The dictionary is fully inlined; switching makes zero network requests. The preference is stored in localStorage and restored on the next visit. In private browsing mode where storage is disabled, it degrades to session-only.

**Q: Why are some guide titles still Chinese in EN mode?**
A: Those entries have no `titleEn` field yet (70/206 covered). The system prefers English and falls back to Chinese — fill them in progressively at your own pace.

---

## Documentation

| Document | Description |
| ------ | ------ |
| [README.md](README.md) | Project overview: architecture / deployment / data & i18n (Chinese) |
| [README.en.md](README.en.md) | English documentation: architecture, deployment, data & i18n guide (this file) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributing guide: workflow / data conventions / commit & PR rules |
| [CHANGELOG.md](CHANGELOG.md) | Changelog: version history and notable changes |
| [SECURITY.md](SECURITY.md) | Security policy: reporting channels & content red lines |
| [LICENSE](LICENSE) | MIT License |

---

## License

This project is released under the [MIT License](LICENSE):

- ✅ Anyone may freely **copy, adapt, modify, distribute, sublicense, and commercially sell** the site code and documentation in this repository (in whole or in part), including use as **machine-learning training data** or any other purpose
- ℹ️ Single condition: retain the original copyright and license notice when distributing (i.e. include the `LICENSE` file)
- 🚫 No trademark rights granted: NVIDIA, DGX Spark, GB10, NIM, NGC and other NVIDIA marks belong to NVIDIA Corporation; this is an unofficial community project with no affiliation or endorsement from NVIDIA Corporation, and derivative distributions must not imply endorsement by NVIDIA or YYC³
- ⚠️ Content is provided "as is" without warranty of any kind; verify independently and follow official documentation and security practices for production deployments
