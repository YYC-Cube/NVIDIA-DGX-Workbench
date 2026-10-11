#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DGX Spark 语义目录 MCP server（stdio）

把 catalog/*.yaml 暴露为 4 个检索工具，供 PAI / Claude Code / 任意 MCP
客户端按关键词检索部署指南、NVIDIA 技能、NIM 模型与 AI 资源矩阵：

  dgx_search_guides(query, category?, difficulty?, limit?)   → 部署指南
  dgx_search_skills(query, category?, limit?)                → NVIDIA 技能索引（含安装命令）
  dgx_search_nim_models(query?, category?, limit?)           → NIM 模型（单机/双机适配）
  dgx_search_resources(query?, domain?, limit?)              → AI 资源矩阵（6 大域）

用法（任意 MCP 客户端，以 YYC3-Pai custom MCP connector 为例）：

  python mcp-server/server.py            # 默认读取 ./catalog
  DGX_CATALOG_DIR=/path/to/catalog python mcp-server/server.py

依赖：mcp>=1.10, pyyaml（见 requirements.txt）。
"""

from __future__ import annotations

import os
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml
from mcp.server.fastmcp import FastMCP

CATALOG_DIR = Path(os.environ.get("DGX_CATALOG_DIR", Path(__file__).resolve().parent.parent / "catalog"))

LAYER_FILES = {
    "guides": "guides.yaml",
    "skills": "skills.yaml",
    "nim_models": "nim-models.yaml",
    "resources": "resources.yaml",
}

mcp = FastMCP("dgx-spark-catalog")


@lru_cache(maxsize=None)
def _load_layer(layer: str) -> list[dict[str, Any]]:
    path = CATALOG_DIR / LAYER_FILES[layer]
    with path.open(encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    rows = doc.get(layer if layer != "nim_models" else "models", [])
    return [r for r in rows if isinstance(r, dict)]


def _matches(row: dict[str, Any], query: str) -> bool:
    terms = [t for t in re.split(r"\s+", query.lower()) if t]
    if not terms:
        return True
    haystack = " ".join(str(v) for v in row.values() if v is not None).lower()
    return all(t in haystack for t in terms)


def _filter(
    layer: str,
    query: str,
    *,
    field_filters: dict[str, str | None],
    limit: int,
) -> list[dict[str, Any]]:
    limit = max(1, min(limit, 50))
    out: list[dict[str, Any]] = []
    for row in _load_layer(layer):
        if any(value and row.get(key) != value for key, value in field_filters.items()):
            continue
        if not _matches(row, query):
            continue
        out.append({k: v for k, v in row.items() if v is not None})
        if len(out) >= limit:
            break
    return out


@mcp.tool()
def dgx_search_guides(
    query: str,
    category: str | None = None,
    difficulty: str | None = None,
    limit: int = 10,
) -> list[dict[str, Any]]:
    """检索 DGX Spark 部署指南（含难度、耗时、前置条件、步骤数与来源仓库）。"""
    return _filter("guides", query, field_filters={"category": category, "difficulty": difficulty}, limit=limit)


@mcp.tool()
def dgx_search_skills(
    query: str,
    category: str | None = None,
    limit: int = 10,
) -> list[dict[str, Any]]:
    """检索 NVIDIA 官方技能索引（含 npx skills add 安装命令）。"""
    return _filter("skills", query, field_filters={"category": category}, limit=limit)


@mcp.tool()
def dgx_search_nim_models(
    query: str = "",
    category: str | None = None,
    limit: int = 10,
) -> list[dict[str, Any]]:
    """检索 NIM 模型库：定位、发布方、单机/双机 DGX Spark 适配与部署配置要点。"""
    return _filter("nim_models", query, field_filters={"category": category}, limit=limit)


@mcp.tool()
def dgx_search_resources(
    query: str = "",
    domain: str | None = None,
    limit: int = 10,
) -> list[dict[str, Any]]:
    """检索 AI 资源矩阵（6 大域：nvidia-official / nvidia-github / nlp-aigc-llm /
    dev-toolchain / dgx-spark-community / platform-infra）。"""
    return _filter("resources", query, field_filters={"domain": domain}, limit=limit)


if __name__ == "__main__":
    for name in LAYER_FILES:
        if not (CATALOG_DIR / LAYER_FILES[name]).is_file():
            raise SystemExit(f"catalog layer missing: {CATALOG_DIR / LAYER_FILES[name]}")
    mcp.run()
