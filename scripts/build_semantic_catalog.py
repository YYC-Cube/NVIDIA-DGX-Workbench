#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_semantic_catalog.py — 语义目录生成器
============================================

把 DGX Spark Hub 的四类知识资产结构化为机器可读 catalog（YAML）：

  · GUIDES            —— index.html 内嵌脚本（经 dump-data.mjs 导出）
  · SKILLS            —— index.html 内嵌脚本（同上，401 项 NVIDIA 技能索引）
  · NIM 模型          —— NVIDIA-NIM-全量模型-分析报告.md（10 大类表格，138 款）
  · AI 资源矩阵        —— AI-资源矩阵-统一知识图谱.md（6 大域小节表格）

输出目录（默认 catalog/）：

  index.yaml  guides.yaml  skills.yaml  nim-models.yaml  resources.yaml

设计约束：
  · 仅依赖 Python 3 标准库（含内置迷你 YAML 发射器；字符串始终加引号，
    产物同时可被 PyYAML / yq / 任何 YAML 1.2 解析器读取）
  · 输出确定性：不含墙钟时间，仅记录来源文件 sha256 短哈希，
    便于 CI 用 ``git diff --exit-code`` 做新鲜度校验

用法：
  node scripts/dump-data.mjs > build/data.json
  python3 scripts/build_semantic_catalog.py --data build/data.json
"""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

RESOURCE_DOMAINS = {
    "1": ("nvidia-official", "NVIDIA 官方技术栈"),
    "2": ("nvidia-github", "NVIDIA GitHub 开源生态"),
    "3": ("nlp-aigc-llm", "NLP / AIGC / LLM 资源库"),
    "4": ("dev-toolchain", "开发工具链"),
    "5": ("dgx-spark-community", "DGX Spark 社区生态"),
    "6": ("platform-infra", "平台服务与基础设施"),
}

NIM_COLUMN_MAP = (
    ("模型名称", "name"),
    ("发布方", "publisher"),
    ("核心定位", "positioning"),
    ("适用行业", "industry_fit"),
    ("单机", "single_node"),
    ("双机", "dual_node"),
    ("部署配置", "deploy_notes"),
)

MD_LINK_RE = re.compile(r"\[([^]]+)\]\((https?://[^)\s]+)\)")


# ── 迷你 YAML 发射器（JSON-safe 形状：dict/list/str/int/float/bool/None） ──


def _yaml_scalar(value: object) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    # 字符串始终 JSON 加引号：合法 YAML，且对换行/冒号/表情符号无歧义。
    return json.dumps(str(value), ensure_ascii=False)


def dump_yaml(obj: object, indent: int = 0) -> list[str]:
    pad = "  " * indent
    lines: list[str] = []
    if isinstance(obj, dict):
        if not obj:
            return [pad + "{}"]
        for key, value in obj.items():
            if isinstance(value, (dict, list)) and value:
                lines.append(f"{pad}{key}:")
                lines.extend(dump_yaml(value, indent + 1))
            elif isinstance(value, dict):
                lines.append(f"{pad}{key}: {{}}")
            elif isinstance(value, list):
                lines.append(f"{pad}{key}: []")
            else:
                lines.append(f"{pad}{key}: {_yaml_scalar(value)}")
    elif isinstance(obj, list):
        if not obj:
            return [pad + "[]"]
        for item in obj:
            if isinstance(item, dict) and item:
                first = True
                for key, value in item.items():
                    prefix = f"{pad}- " if first else f"{pad}  "
                    first = False
                    if isinstance(value, (dict, list)) and value:
                        lines.append(f"{prefix}{key}:")
                        lines.extend(dump_yaml(value, indent + 2))
                    elif isinstance(value, (dict, list)):
                        empty = "{}" if isinstance(value, dict) else "[]"
                        lines.append(f"{prefix}{key}: {empty}")
                    else:
                        lines.append(f"{prefix}{key}: {_yaml_scalar(value)}")
            elif isinstance(item, (dict, list)):
                lines.append(f"{pad}- " + ("{}" if isinstance(item, dict) else "[]"))
            else:
                lines.append(f"{pad}- {_yaml_scalar(item)}")
    else:
        lines.append(pad + _yaml_scalar(obj))
    return lines


def write_yaml(path: Path, doc: dict) -> None:
    path.write_text("\n".join(dump_yaml(doc)) + "\n", encoding="utf-8")


# ── 输入解析 ────────────────────────────────────────────────────────────────


def sha256_short(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]


def clean_md(text: str) -> str:
    return re.sub(r"\*\*", "", text).strip()


def parse_nim_report(path: Path) -> list[dict]:
    """解析 NIM 报告 md：``### 2.x 类别名`` 之下的模型表格。"""
    models: list[dict] = []
    category = ""
    header: list[str] = []
    in_table = False
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        heading = re.match(r"^###\s+2\.\d+\s+(.+?)[：:]", line)
        if heading:
            category = clean_md(heading.group(1))
            in_table = False
            continue
        if not category:
            continue
        if line.startswith("|"):
            cells = [clean_md(c) for c in line.strip().strip("|").split("|")]
            if all(set(c) <= set("-: ") for c in cells):
                continue  # 分隔行
            if not in_table:
                header = cells
                in_table = True
                continue
            if len(cells) < 3:
                continue
            row: dict[str, object] = {"category": category}
            for idx, col in enumerate(header):
                key = next((k for pat, k in NIM_COLUMN_MAP if pat in col), None)
                if key and idx < len(cells):
                    row[key] = cells[idx]
            if row.get("name"):
                models.append(row)
        else:
            in_table = False
    return models


def parse_resource_graph(path: Path) -> list[dict]:
    """解析资源矩阵 md：六大域（h1）→ 小节（h2）→ 三列表格。"""
    resources: list[dict] = []
    domain_id = ""
    section = ""
    subsection = ""
    in_appendix = False
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if line.startswith("# "):
            in_appendix = "附录" in line
            continue
        if in_appendix:
            continue
        h2 = re.match(r"^##\s+(\d)\.(\d+)\s*(.*)", line)
        if h2:
            domain_id = h2.group(1)
            section = clean_md(h2.group(3))
            subsection = ""
            continue
        h3 = re.match(r"^###\s+(.*)", line)
        if h3 and domain_id:
            subsection = clean_md(h3.group(1))
            continue
        if not domain_id or not line.startswith("|"):
            continue
        cells = [clean_md(c) for c in line.strip().strip("|").split("|")]
        if len(cells) < 2 or all(set(c) <= set("-: ") for c in cells):
            continue
        if cells[0] in ("资源", "名称", "项目", "模型", "工具", "平台", "服务"):
            continue  # 表头行
        # 链接可能在首列（[name](url) | 类型 | 描述），也可能在末列
        # （名称 | 类型 | 描述 | [url](...)）——统一取首个含链接的单元格。
        link_idx = next((i for i, c in enumerate(cells) if MD_LINK_RE.search(c)), None)
        if link_idx is None:
            continue
        link = MD_LINK_RE.search(cells[link_idx])
        assert link is not None
        name = cells[0] if link_idx > 0 else clean_md(link.group(1))
        rest = [c for i, c in enumerate(cells[1:], start=1) if i != link_idx]
        slug, title = RESOURCE_DOMAINS.get(domain_id, (domain_id, domain_id))
        resources.append(
            {
                "domain": slug,
                "domain_zh": title,
                "section": section,
                "subsection": subsection or None,
                "name": name,
                "url": link.group(2),
                "type": (rest[0] or None) if rest else None,
                "desc": (rest[1] or None) if len(rest) > 1 else None,
            }
        )
    return resources


def load_guides(data: dict) -> list[dict]:
    guides = []
    for g in data.get("guides", []):
        guides.append(
            {
                "id": g.get("id"),
                "order": g.get("order"),
                "category": g.get("cat"),
                "title": g.get("title"),
                "title_en": g.get("titleEn"),
                "difficulty": g.get("diff"),
                "time": g.get("time"),
                "desc": g.get("desc"),
                "prereq": g.get("prereq") or [],
                "overview": [f"{k}: {v}" for k, v in (g.get("overview") or [])],
                "steps": len(g.get("steps") or []),
                "repo": g.get("repo"),
                "site": g.get("site"),
            }
        )
    return guides


def load_skills(data: dict) -> list[dict]:
    skills = []
    for s in data.get("skills", []):
        skills.append(
            {
                "name": s.get("name"),
                "category": s.get("cat"),
                "order": s.get("order"),
                "desc": s.get("desc"),
                "install_cmd": s.get("cmd"),
            }
        )
    return skills


# ── 主流程 ──────────────────────────────────────────────────────────────────


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", default="build/data.json", help="dump-data.mjs 输出")
    parser.add_argument("--out", default="catalog", help="输出目录")
    args = parser.parse_args()

    data_path = REPO_ROOT / args.data
    nim_path = REPO_ROOT / "NVIDIA-NIM-全量模型-分析报告.md"
    graph_path = REPO_ROOT / "AI-资源矩阵-统一知识图谱.md"
    out_dir = REPO_ROOT / args.out
    out_dir.mkdir(parents=True, exist_ok=True)

    data = json.loads(data_path.read_text(encoding="utf-8"))
    guides = load_guides(data)
    skills = load_skills(data)
    models = parse_nim_report(nim_path)
    resources = parse_resource_graph(graph_path)

    if not guides or not skills or not models or not resources:
        print("解析结果为空，请检查输入文件", file=sys.stderr)
        return 1

    meta = {
        "schema": "dgx-semantic-catalog/v1",
        "source": {
            "index_html_sha256": sha256_short(REPO_ROOT / "index.html"),
            "nim_report_sha256": sha256_short(nim_path),
            "resource_graph_sha256": sha256_short(graph_path),
        },
        "counts": {
            "guides": len(guides),
            "skills": len(skills),
            "nim_models": len(models),
            "resources": len(resources),
        },
    }

    write_yaml(out_dir / "index.yaml", meta)
    write_yaml(out_dir / "guides.yaml", {"meta": meta, "guides": guides})
    write_yaml(out_dir / "skills.yaml", {"meta": meta, "skills": skills})
    write_yaml(out_dir / "nim-models.yaml", {"meta": meta, "models": models})
    write_yaml(out_dir / "resources.yaml", {"meta": meta, "resources": resources})

    print(
        f"catalog: guides={len(guides)} skills={len(skills)} "
        f"nim_models={len(models)} resources={len(resources)}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
