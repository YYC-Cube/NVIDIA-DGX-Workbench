#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NVIDIA DGX Skills 目录生成器
============================

从上游 NVIDIA/skills 克隆目录解析：
  · components.d/*.yml            —— 组件注册（name + catalog_dir）
  · catalog-exceptions.yml        —— 例外目录（dir + component）
  · .github/scripts/manual-components.yml —— 手工暂存组件目录
  · skills/<id>/SKILL.md          —— YAML frontmatter 中的 name / description

输出规范化 Skills.md；任何未编排目录、重复目录或缺失描述都会以非零码退出。
仅依赖 Python 3 标准库。
"""

import argparse
import datetime
import glob
import os
import re
import sys

# ── 章节编排：章节标题 → [(组件名, 中文说明)] ────────────────────────────
SECTIONS = [
    ('01 · GPU 加速计算与数据处理 / Accelerated Computing & Data',
        [('cuDF', 'GPU DataFrame'), ('DALI', '数据加载流水线'),
         ('Data Designer', '合成数据与数据流水线')]),
    ('02 · 优化求解 / Optimization',
        [('Portfolio Optimization', '投资组合优化'), ('cuOpt', 'GPU 加速运筹优化')]),
    ('03 · CUDA-Q 量子计算 / Quantum Computing',
        [('CUDA-Q', '量子-经典混合编程')]),
    ('04 · DeepStream 视频流分析 / Video Streaming Analytics',
        [('DeepStream', '视频流分析管道')]),
    ('05 · 医疗与数字健康 / Healthcare & Digital Health',
        [('Digital Health', '临床 ASR 飞轮'), ('Medical AI Skills', 'MONAI 医疗影像'),
         ('Nemotron Voice Agent', '环境医疗语音智能体')]),
    ('06 · Dynamo 分布式推理 / Distributed Inference',
        [('Dynamo', '推理编排与路由')]),
    ('07 · Earth2Studio 气象气候 / Weather & Climate',
        [('Earth2Studio', '天气/气候 AI')]),
    ('08 · Holoscan 实时感知 / Real-Time AI',
        [('Holoscan SDK', '实时 AI 传感器处理'), ('HoloHub', 'Holoscan 应用与模块'),
         ('Holoscan Sensor Bridge', '传感器桥开发板')]),
    ('09 · NeMo 大模型训练 / LLM Training',
        [('Megatron-Core', '大模型训练核心'), ('NeMo AutoModel', '自动化模型训练'),
         ('NeMo MBridge', 'HF↔Megatron 桥接与性能'), ('NeMo-RL', '强化学习训练'),
         ('NeMo Fabric', '训练编排'), ('NeMo Relay', '智能体运行时')]),
    ('10 · NeMo 智能体与模型 / Agents & Models',
        [('NeMo Retriever', '检索增强'), ('NemoClaw', '安全智能体沙箱'),
         ('Nemotron', 'Nemotron 模型定制'), ('Nemotron Speech', '语音 NIM')]),
    ('11 · 物理 AI 与仿真 / Physical AI & Simulation',
        [('Physical AI', '数据工厂 / Omniverse / Isaac 与基础设施'),
         ('Physical AI Augmentation', '数据增强'),
         ('Physical AI Auto-Labeling', '自动标注'),
         ('Physical AI Curation and Retrieval', '数据策展检索'),
         ('Physical AI Orchestration', '工作流编排'),
         ('FoundationPose Perception Pipeline', '6D 姿态感知'),
         ('Isaac for Healthcare Workflows', '医疗机器人工作流'),
         ('PhysicsNeMo', '物理科学机器学习'),
         ('Warp', 'GPU 仿真与可微计算')]),
    ('12 · 边缘计算与 DPU 基础设施 / Edge & DPU',
        [('Jetson BSP', 'Jetson Linux 板级支持包'), ('Jetson Device', 'Jetson 设备侧运维'),
         ('DOCA', 'BlueField DPU / ConnectX NIC')]),
    ('13 · RAG 检索增强生成 / Retrieval-Augmented Generation',
        [('RAG Blueprint', 'RAG 蓝图')]),
    ('14 · TAO Toolkit 视觉模型 / Vision AI',
        [('TAO Toolkit', '视觉模型微调与部署')]),
    ('15 · TileGym GPU 算子工程 / Kernel Engineering',
        [('TileGym', 'cuTile 算子')]),
    ('16 · VSS 视频智能系统 / Video Search & Summarization',
        [('Video Search and Summarization', '视频检索与摘要')]),
    ('17 · 桌面与创作工具 / Desktop & Creative',
        [('NVIDIA App', '驱动/游戏/笔记本'), ('NVIDIA Broadcast', '直播音视频增强'),
         ('G-Assist', '游戏与 PC 助手'), ('RTX Remix', '经典游戏重制')]),
    ('18 · BioNeMo 生物分子 AI / Biomolecular AI',
        [('BioNeMo NIMs', '生物分子 NIM 微服务'), ('BioNeMo Open Models', 'KERMT 开放模型'),
         ('BioNeMo Libraries', 'NVMolKit 分子工具包')]),
    ('19 · NVFlare 联邦学习 / Federated Learning',
        [('NVFlare', '联邦学习工作流')]),
    ('20 · 技能治理 / Skills Governance',
        [('NVIDIA Skills', '目录基础设施路由'),
         ('Skill Card Generator', '技能卡片生成'),
         ('Auto Ontology', '自动化本体管理与查询')]),
]


def fail(msg):
    print(f'[生成失败] {msg}', file=sys.stderr)
    sys.exit(1)


# ── SKILL.md frontmatter 解析 ────────────────────────────────────────────
def parse_frontmatter(path):
    """返回 SKILL.md 的 YAML frontmatter 文本（--- 之间）。"""
    try:
        with open(path, encoding='utf-8', errors='replace') as f:
            text = f.read()
    except OSError:
        return None
    m = re.match(r'^---\n(.*?)\n---', text, re.S)
    return m.group(1) if m else None


def get_scalar(fm, key):
    """从 frontmatter 取标量值，支持引号值与 >- / > / | 折叠块。"""
    lines = fm.splitlines()
    for i, line in enumerate(lines):
        m = re.match(rf'^{re.escape(key)}:\s*(.*)$', line)
        if not m:
            continue
        val = m.group(1).strip()
        if val in ('>-', '>', '|', '|-'):
            buf = []
            for ln in lines[i + 1:]:
                if re.match(r'^\s+\S', ln):
                    buf.append(ln.strip())
                elif ln.strip() == '' and buf:
                    buf.append(' ')
                else:
                    break
            return ' '.join(buf).strip()
        return val.strip('"\'')
    return ''


# ── 上游解析 ─────────────────────────────────────────────────────────────
def load_components(upstream):
    """组件名 -> [catalog_dir]，合并三个注册来源。"""
    comp = {}

    # 1) components.d/*.yml
    cdir = os.path.join(upstream, 'components.d')
    if not os.path.isdir(cdir):
        fail(f'未找到 components.d 目录：{cdir}')
    for yf in sorted(glob.glob(os.path.join(cdir, '*.yml'))):
        txt = open(yf, encoding='utf-8').read()
        mname = re.search(r'^name:\s*(.+?)\s*$', txt, re.M)
        cname = mname.group(1).strip().strip('"\'') if mname else os.path.basename(yf)
        comp.setdefault(cname, [])
        for cat in re.findall(r'catalog_dir:\s*([A-Za-z0-9_.-]+)', txt):
            if cat not in comp[cname]:
                comp[cname].append(cat)

    # 2) catalog-exceptions.yml —— 例外目录归入其声明的 component
    exc_path = os.path.join(upstream, 'catalog-exceptions.yml')
    if os.path.exists(exc_path):
        block = open(exc_path, encoding='utf-8').read()
        for m in re.finditer(r'^  - dir:\s*(.+?)\n(.*?)(?=^  - dir:|\Z)',
                             block, re.M | re.S):
            d = m.group(1).strip().strip('"\'')
            cm = re.search(r'component:\s*(.+?)\s*$', m.group(2), re.M)
            if cm:
                cname = cm.group(1).strip().strip('"\'')
                comp.setdefault(cname, [])
                if d not in comp[cname]:
                    comp[cname].append(d)

    # 3) .github/scripts/manual-components.yml —— 手工暂存目录
    manual = os.path.join(upstream, '.github', 'scripts', 'manual-components.yml')
    if os.path.exists(manual):
        cname = None
        in_dirs = False
        for line in open(manual, encoding='utf-8'):
            m = re.match(r'\s{2,}- name:\s*(.+?)\s*$', line)
            if m:
                cname = m.group(1).strip().strip('"\'')
                comp.setdefault(cname, [])
                in_dirs = False
                continue
            if re.match(r'\s{4}catalog_dirs:\s*$', line):
                in_dirs = True
                continue
            if in_dirs:
                md = re.match(r'\s{6}-\s*([A-Za-z0-9_.-]+)\s*$', line)
                if md and cname:
                    if md.group(1) not in comp[cname]:
                        comp[cname].append(md.group(1))
                elif line.strip() and not line.startswith(' ' * 6):
                    in_dirs = False
    return comp


def build(upstream, output):
    skills_root = os.path.join(upstream, 'skills')
    if not os.path.isdir(skills_root):
        fail(f'未找到 skills 目录：{skills_root}')

    all_dirs = sorted(d for d in os.listdir(skills_root)
                      if os.path.isdir(os.path.join(skills_root, d)))
    all_set = set(all_dirs)
    comp = load_components(upstream)

    # 与上游 README 生成行为对齐：仅保留 skills/ 下实际存在的目录；
    # components.d 已注册但技能目录尚未同步的条目跳过并告警。
    for cname in list(comp.keys()):
        existing, missing = [], []
        for d in comp[cname]:
            (existing if d in all_set else missing).append(d)
        if missing:
            print(f'[跳过] 组件 {cname} 已注册但目录未同步: {missing}')
        comp[cname] = existing
        if not comp[cname]:
            del comp[cname]

    # 解析每个 SKILL.md 的 description
    descriptions = {}
    no_desc = []
    for d in all_dirs:
        fm = parse_frontmatter(os.path.join(skills_root, d, 'SKILL.md'))
        desc = get_scalar(fm, 'description') if fm else ''
        if desc:
            descriptions[d] = desc
        else:
            no_desc.append(d)
    if no_desc:
        fail(f'以下技能缺失 SKILL.md 或 description：{no_desc}')

    # 按章节编排
    used, body, nav = [], [], []
    n = 0
    for title, items in SECTIONS:
        body.append(f'\n### {title}\n')
        sec_total = 0
        for cname, cdesc in items:
            dirs = comp.get(cname) or []
            if not dirs:
                fail(f'章节引用了不存在或无目录的组件：{cname}')
            body.append(f'\n**{cname}** — {cdesc}\n')
            body.append('| # | Skill ID | Description |')
            body.append('|:--:|----------|-------------|')
            for d in dirs:
                if d not in descriptions:
                    fail(f'组件 {cname} 引用了 skills/ 下不存在的目录：{d}')
                n += 1
                sec_total += 1
                desc = descriptions[d].replace('|', '\\|')
                desc = re.sub(r'\s+', ' ', desc).strip()
                body.append(f'| {n:03d} | `{d}` | {desc} |')
                used.append(d)
        nav.append((title.split(' / ')[0], sec_total))

    # 完整性校验
    if len(used) != len(set(used)):
        seen, dup = set(), []
        for d in used:
            if d in seen:
                dup.append(d)
            seen.add(d)
        fail(f'存在重复编排目录：{dup}')
    leftover = [d for d in all_dirs if d not in set(used)]
    if leftover:
        fail(f'存在未编排目录（需在 SECTIONS 中登记）：{leftover}')

    total = n
    today = datetime.date.today()
    version = f'{today.year}.{today.month}.0'

    nav_table = ['| 章节 | 技能数 |', '|:------|:-----:|']
    for t, c in nav:
        nav_table.append(f'| {t} | {c} |')
    nav_table.append(f'| **合计** | **{total}** |')

    doc = f"""---
name: nvidia-skills-catalog
title: NVIDIA DGX Skills 技能目录（中文规范版 · 全量）
version: {version}
source: NVIDIA/skills
upstream: https://github.com/NVIDIA/skills
total_skills: {total}
installer: "npx skills add NVIDIA/skills --skill <skill-id>"
language: zh-CN
updated: {today.isoformat()}
license: Apache-2.0
tags: [nvidia, dgx, skills, catalog, gpu, agent, ai]
---

# NVIDIA DGX Skills 技能目录（中文规范版 · 全量 {total} 项）

> 本目录基于上游 **NVIDIA/skills** 最新主干生成，共 **{total}** 项 Agent Skills，
> 覆盖 GPU 加速计算、优化求解、量子计算、大模型训练、分布式推理、医疗影像、
> 物理 AI、RAG、视觉模型、边缘设备、生物分子 AI、联邦学习等全栈场景。
> Description 字段取自各技能 `SKILL.md` 的 YAML Front Matter 原文，为智能体意图路由的权威依据。

---

## 一、使用方式

### 1.1 标准安装命令

```bash
# 标准格式：前缀 + 具体功能命令
npx skills add NVIDIA/skills --skill <skill-id>

# 示例：安装 cuOpt 数值优化 API
npx skills add NVIDIA/skills --skill cuopt-numerical-optimization-api
```

### 1.2 其他命令

```bash
npx skills add NVIDIA/skills --list    # 浏览全部可安装技能
npx skills add NVIDIA/skills           # 交互式选择安装
```

### 1.3 一键更新

```bash
# 同步上游最新技能 → 重建本文件 → 校验 → 推送（自动触发 GitHub Pages 部署）→ 线上验证
bash scripts/update-skills.sh
```

### 1.4 智能体调用范式

```
① 意图识别 → 按下表匹配 Skill ID 与 Description
② 安装调度 → npx skills add NVIDIA/skills --skill <skill-id>
③ 按已安装技能目录中的 SKILL.md 指引执行操作
④ 多技能协同 → 优先选择各产品域的 setup / router / discover 类技能
```

---

## 二、分类导航（{len(nav)} 个章节）

{chr(10).join(nav_table)}

---

## 三、技能详细清单
{''.join(body)}

---

## 四、全量 Skill ID 机器索引（{total}）

> 每行一个 Skill ID，与上文编号一一对应。安装时拼接：
> `npx skills add NVIDIA/skills --skill <行内ID>`

```text
{chr(10).join(used)}
```

---

**数据来源**：上游 `NVIDIA/skills` 主干（components.d 组件注册 + catalog-exceptions.yml 例外 + manual-components.yml 手工目录）
**生成方式**：`python3 scripts/build-skills-catalog.py --upstream <上游克隆> --output Skills.md`
**生成日期**：{today.isoformat()}
**© 2025-2026 YanYuCloudCube™** · Words Initiate Quadrants, Language Serves as Core for the Future
"""

    with open(output, 'w', encoding='utf-8') as f:
        f.write(doc)
    print(f'[OK] 技能总数 {total}，已写入 {output}')
    print(f'[OK] 章节数 {len(nav)}，全部目录已编排，无重复无遗漏')


def main():
    ap = argparse.ArgumentParser(description='生成 NVIDIA DGX Skills 规范化目录')
    ap.add_argument('--upstream', required=True,
                    help='上游 NVIDIA/skills 克隆目录路径')
    ap.add_argument('--output', default='Skills.md',
                    help='输出文件路径（默认 Skills.md）')
    args = ap.parse_args()
    build(os.path.abspath(args.upstream), os.path.abspath(args.output))


if __name__ == '__main__':
    main()
