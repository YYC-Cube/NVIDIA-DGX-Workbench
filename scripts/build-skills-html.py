#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NVIDIA Skills 站点数据构建器
============================

基于上游 NVIDIA/skills 最新数据，更新离线站点 HTML 内嵌的：
  · const SKILLS = [...]                 —— 全量技能（cat/order/name/desc/cmd）
  · catNames / skillCatColors / catStars —— 分类名称（中英）、颜色、难度星级
  · i18n 技能库说明中的领域数

描述策略：当前 HTML 中仍存在的旧技能沿用原中文描述与名称；
         新增技能使用 SKILL.md 的英文权威描述；所有值统一转义后安全注入。

用法：
  python3 scripts/build-skills-html.py --upstream .cache/nvidia-skills-upstream \
      --html DGX-SPARK-HUB-OFFLINE.html --html index.html
"""

import argparse
import os
import re
import sys

import importlib.util
from typing import NoReturn

_spec = importlib.util.spec_from_file_location(
    'build_skills_catalog',
    os.path.join(os.path.dirname(os.path.abspath(__file__)),
                 'build-skills-catalog.py'))
assert _spec is not None and _spec.loader is not None
bsc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bsc)

CMD_PREFIX = 'npx skills add NVIDIA/skills --skill '

# ── 分类定义：cat 键 → (中文名称, 英文名称, 图标, 颜色, 难度星级) ───────
CAT_META = [
    ('data-processing', 'GPU 加速数据处理与设计', 'Accelerated Data Processing & Design', '💾', '#d97706', 2),
    ('cuopt', 'cuOpt 优化求解', 'cuOpt Mathematical Optimization', '📐', '#14b8a6', 3),
    ('cudaq', 'CUDA-Q 量子计算', 'CUDA-Q Quantum Computing', '⚛️', '#7c3aed', 4),
    ('deepstream', 'DeepStream 视频流分析', 'DeepStream Video Analytics', '🎥', '#0ea5e9', 2),
    ('digital-health', '数字健康 临床 ASR', 'Digital Health Clinical ASR', '❤️', '#7c3aed', 3),
    ('medical-imaging', '医疗影像 AI', 'Medical Imaging AI', '🩻', '#2563eb', 4),
    ('voice-agent', 'Nemotron 环境医疗语音智能体', 'Nemotron Ambient Voice Agent', '🗣️', '#0d9488', 4),
    ('dynamo', 'Dynamo 推理服务编排', 'Dynamo Inference Orchestration', '⚙️', '#f59e0b', 3),
    ('earth2', 'Earth2Studio 天气气候', 'Earth2Studio Weather & Climate', '🌤️', '#84cc16', 3),
    ('holoscan', 'Holoscan 实时 AI SDK', 'Holoscan Real-Time AI SDK', '🏥', '#f97316', 4),
    ('holohub', 'HoloHub 传感器处理模块', 'HoloHub Sensor Processing Modules', '🧩', '#0891b2', 3),
    ('hsb', 'Holoscan Sensor Bridge', 'Holoscan Sensor Bridge', '🔌', '#e11d48', 3),
    ('megatron-core', 'Megatron-Core 框架工具', 'Megatron-Core Framework Tools', '🔧', '#06b6d4', 4),
    ('nemo-automodel', 'NeMo AutoModel 训练自动化', 'NeMo AutoModel Training Automation', '🤖', '#22c55e', 3),
    ('megatron', 'Megatron-Bridge 分布式训练', 'Megatron-Bridge Distributed Training', '🧠', '#8b5cf6', 5),
    ('nemo-rl', 'NeMo-RL 强化学习', 'NeMo-RL Reinforcement Learning', '🎮', '#3b82f6', 4),
    ('nemo-fabric', 'NeMo Fabric 训练编排', 'NeMo Fabric Training Orchestration', '🧵', '#65a30d', 3),
    ('nemo-relay', 'NeMo Relay 智能体运行时', 'NeMo Relay Agent Runtime', '🔁', '#0284c7', 3),
    ('nemo-retriever', 'NeMo Retriever 检索', 'NeMo Retriever', '🔎', '#4f46e5', 3),
    ('nemoclaw', 'NemoClaw 沙箱安全生态', 'NemoClaw Sandbox Security', '🛡️', '#ef4444', 2),
    ('nemotron', 'Nemotron 模型定制', 'Nemotron Model Customization', '🤗', '#ec4899', 3),
    ('nemotron-speech', 'Nemotron Speech 语音 NIM', 'Nemotron Speech NIM', '🎤', '#db2777', 3),
    ('physical-ai', 'Physical AI 基础设施', 'Physical AI Infrastructure', '🏗️', '#e11d48', 4),
    ('pai-data', 'Physical AI 数据工程', 'Physical AI Data Engineering', '🏭', '#c026d3', 3),
    ('foundationpose', 'FoundationPose 6D 姿态感知', 'FoundationPose Pose Perception', '🎯', '#dc2626', 4),
    ('isaac-health', 'Isaac 医疗机器人工作流', 'Isaac Healthcare Robot Workflows', '🦾', '#9333ea', 4),
    ('ai4science', 'PhysicsNeMo 科学机器学习', 'PhysicsNeMo Scientific ML', '🔬', '#059669', 5),
    ('warp', 'Warp GPU 仿真计算', 'Warp GPU Simulation', '🌊', '#0e7490', 3),
    ('jetson', 'Jetson 边缘 AI', 'Jetson Edge AI', '🟢', '#16a34a', 3),
    ('doca', 'DOCA DPU/NIC 基础设施', 'DOCA DPU/NIC Infrastructure', '🔷', '#2563eb', 4),
    ('rag', 'RAG 检索增强生成', 'RAG Retrieval-Augmented Generation', '🔍', '#6366f1', 2),
    ('tao', 'TAO Toolkit 视觉 AI', 'TAO Toolkit Vision AI', '👁️', '#9333ea', 3),
    ('tilegym', 'TileGym GPU 算子工程', 'TileGym Kernel Engineering', '🧱', '#b45309', 4),
    ('vss', '视频智能检索与摘要系统', 'Video Search & Summarization', '📹', '#0d9488', 3),
    ('nvidia-app', 'NVIDIA App 驱动与游戏', 'NVIDIA App Drivers & Games', '🖥️', '#76b900', 2),
    ('nvidia-broadcast', 'NVIDIA Broadcast 直播增强', 'NVIDIA Broadcast', '📡', '#a16207', 2),
    ('g-assist', 'G-Assist 游戏助手', 'G-Assist Gaming Assistant', '💬', '#64748b', 2),
    ('rtx-remix', 'RTX Remix 游戏重制', 'RTX Remix Game Modding', '✨', '#f59e0b', 3),
    ('bionemo', 'BioNeMo 生物分子 AI', 'BioNeMo Biomolecular AI', '🧬', '#0891b2', 4),
    ('nvflare', 'NVFlare 联邦学习', 'NVFlare Federated Learning', '🤝', '#4338ca', 3),
    ('skill-governance', '技能治理', 'Skill Governance', '🏛️', '#9333ea', 1),
    ('ontology', 'Auto Ontology 本体管理', 'Auto Ontology Management', '📚', '#6d28d9', 3),
]

# 组件名 → cat 键
COMPONENT_CAT = {
    'cuDF': 'data-processing', 'DALI': 'data-processing', 'Data Designer': 'data-processing',
    'Portfolio Optimization': 'cuopt', 'cuOpt': 'cuopt',
    'CUDA-Q': 'cudaq',
    'DeepStream': 'deepstream',
    'Digital Health': 'digital-health', 'Medical AI Skills': 'medical-imaging',
    'Nemotron Voice Agent': 'voice-agent',
    'Dynamo': 'dynamo',
    'Earth2Studio': 'earth2',
    'Holoscan SDK': 'holoscan', 'HoloHub': 'holohub',
    'Holoscan Sensor Bridge': 'hsb',
    'Megatron-Core': 'megatron-core', 'NeMo AutoModel': 'nemo-automodel',
    'NeMo MBridge': 'megatron', 'NeMo-RL': 'nemo-rl',
    'NeMo Fabric': 'nemo-fabric', 'NeMo Relay': 'nemo-relay',
    'NeMo Retriever': 'nemo-retriever', 'NemoClaw': 'nemoclaw',
    'Nemotron': 'nemotron', 'Nemotron Speech': 'nemotron-speech',
    'Physical AI': 'physical-ai',
    'Physical AI Augmentation': 'pai-data', 'Physical AI Auto-Labeling': 'pai-data',
    'Physical AI Curation and Retrieval': 'pai-data',
    'Physical AI Orchestration': 'pai-data',
    'FoundationPose Perception Pipeline': 'foundationpose',
    'Isaac for Healthcare Workflows': 'isaac-health',
    'PhysicsNeMo': 'ai4science', 'Warp': 'warp',
    'Jetson BSP': 'jetson', 'Jetson Device': 'jetson', 'DOCA': 'doca',
    'RAG Blueprint': 'rag',
    'TAO Toolkit': 'tao',
    'TileGym': 'tilegym',
    'Video Search and Summarization': 'vss',
    'NVIDIA App': 'nvidia-app', 'NVIDIA Broadcast': 'nvidia-broadcast',
    'G-Assist': 'g-assist', 'RTX Remix': 'rtx-remix',
    'BioNeMo NIMs': 'bionemo', 'BioNeMo Open Models': 'bionemo',
    'BioNeMo Libraries': 'bionemo',
    'NVFlare': 'nvflare',
    'NVIDIA Skills': 'skill-governance', 'Skill Card Generator': 'skill-governance',
    'Auto Ontology': 'ontology',
}


def fail(msg) -> NoReturn:
    print(f'[构建失败] {msg}', file=sys.stderr)
    sys.exit(1)


def js_unescape(s):
    """解码 JS 单引号字符串中的转义序列。"""
    out, i = [], 0
    while i < len(s):
        if s[i] == '\\' and i + 1 < len(s):
            out.append(s[i + 1])
            i += 2
        else:
            out.append(s[i])
            i += 1
    return ''.join(out)


def js_escape(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


def html_escape(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def extract_old_skills(html):
    """现有 HTML → sid → (name, desc)，保留旧中文编纂内容。"""
    m = re.search(r'const SKILLS = \[(.*?)\];', html, re.S)
    if not m:
        fail('未找到现有 const SKILLS 数组')
    pat = re.compile(
        r"cat: '([^']+)',\s*order: \d+,\s*name: '((?:[^'\\]|\\.)*)',\s*"
        r"desc: '((?:[^'\\]|\\.)*)',\s*cmd: '((?:[^'\\]|\\.)*)'")
    old = {}
    for _cat, name, desc, cmd in pat.findall(m.group(1)):
        sid = cmd.split('--skill ')[-1]
        old[sid] = (js_unescape(name), js_unescape(desc))
    return old


def collect_skills(upstream, old):
    """按 SECTIONS 顺序产出 (cat, name, desc, cmd)。"""
    skills_root = os.path.join(upstream, 'skills')
    all_set = set(d for d in os.listdir(skills_root)
                  if os.path.isdir(os.path.join(skills_root, d)))
    comp = bsc.load_components(upstream)
    for cname in list(comp.keys()):
        comp[cname] = [d for d in comp[cname] if d in all_set]

    rows = []
    for _title, items in bsc.SECTIONS:
        for cname, _ in items:
            cat = COMPONENT_CAT.get(cname)
            if not cat:
                fail(f'组件未配置分类映射: {cname}')
            for sid in comp.get(cname, []):
                fm = bsc.parse_frontmatter(os.path.join(skills_root, sid, 'SKILL.md'))
                en_desc = re.sub(r'\s+', ' ', bsc.get_scalar(fm, 'description')).strip()
                if sid in old:
                    name, desc = old[sid]
                else:
                    name, desc = sid, en_desc
                rows.append((cat, html_escape(name), html_escape(desc), CMD_PREFIX + sid))
    if len(rows) != len(all_set):
        fail(f'编排 {len(rows)} 条与实际目录 {len(all_set)} 不一致')
    if set(r[0] for r in rows) - set(m[0] for m in CAT_META):
        fail('存在未在 CAT_META 中定义的 cat 键')
    return rows


# ── 替换片段 ─────────────────────────────────────────────────────────────
def render_skills_array(rows):
    L = ['      const SKILLS = [\n']
    for i, (cat, name, desc, cmd) in enumerate(rows, 1):
        L.append('        {\n')
        L.append(f"          cat: '{cat}',\n")
        L.append(f'          order: {i},\n')
        L.append(f"          name: '{js_escape(name)}',\n")
        L.append(f"          desc: '{js_escape(desc)}',\n")
        L.append(f"          cmd: '{js_escape(cmd)}',\n")
        L.append('        },\n')
    L.append('      ];')
    return ''.join(L)


def render_cat_names():
    def lines(name_idx):
        out = []
        for m in CAT_META:
            key = m[0]
            qkey = key if key.isidentifier() else f"'{key}'"
            out.append(f"{qkey}: ['{js_escape(m[name_idx])}', '{m[3]}'],\n")
        return out
    zh, en = lines(1), lines(2)
    ind = '                '
    return ('        const catNames =\n'
            "          currentLang === 'en'\n"
            '            ? {\n' + ''.join(ind + x for x in en) + '              }\n'
            '            : {\n' + ''.join(ind + x for x in zh) + '              };')


def render_colors():
    out = ['        const skillCatColors = {\n']
    for m in CAT_META:
        key = m[0]
        qkey = key if key.isidentifier() else f"'{key}'"
        out.append(f"          {qkey}: '{m[4]}',\n")
    out.append('        };')
    return ''.join(out)


def render_stars():
    out = ['        const catStars = {\n']
    for m in CAT_META:
        key = m[0]
        qkey = key if key.isidentifier() else f"'{key}'"
        out.append(f'          {qkey}: {m[5]},\n')
    out.append('        };')
    return ''.join(out)


def patch(html, rows):
    n_cats = len(set(r[0] for r in rows))
    total = len(rows)
    checks = []

    def sub(pattern, repl, flags=0, anchor=None):
        if anchor:
            full = pattern + r'(?=' + anchor + ')'
        else:
            full = pattern
        new, c = re.subn(full, lambda m: repl, html, count=1, flags=flags)
        checks.append(c)
        return new

    html = sub(r'      const SKILLS = \[.*?\];', render_skills_array(rows), re.S)
    html = sub(r'        const catNames =.*?;', render_cat_names(), re.S,
               anchor=r'\n\n        const skillCatColors')
    html = sub(r'        const skillCatColors = \{.*?\};', render_colors(), re.S)
    html = sub(r'        const catStars = \{.*?\};', render_stars(), re.S)
    html = sub(r'// NVIDIA Skills — \d+ 条.*',
               f'// NVIDIA Skills — {total} 条')
    html = sub(r'覆盖 \d+ 个领域', f'覆盖 {n_cats} 个领域')
    html = sub(r'across \d+ domains', f'across {n_cats} domains')

    if checks != [1] * len(checks):
        fail(f'部分代码块未命中替换：{checks}')
    return html, total, n_cats


def main():
    ap = argparse.ArgumentParser(description='更新站点 HTML 内嵌 NVIDIA Skills 数据')
    ap.add_argument('--upstream', required=True)
    ap.add_argument('--html', action='append', required=True)
    args = ap.parse_args()

    upstream = os.path.abspath(args.upstream)
    for hp in args.html:
        html = open(hp, encoding='utf-8').read()
        rows = collect_skills(upstream, extract_old_skills(html))
        html, total, n_cats = patch(html, rows)
        with open(hp, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'[OK] {hp}: {total} 条技能 / {n_cats} 个分类')


if __name__ == '__main__':
    main()
