#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# NVIDIA DGX Skills · 一键更新脚本
#
# 流程：同步上游 NVIDIA/skills → 重建 Skills.md → 完整性校验
#       → 提交并推送 main（自动触发 GitHub Pages 部署）→ 线上访问验证
#
# 用法：
#   bash scripts/update-skills.sh              # 全流程（含推送与线上验证）
#   bash scripts/update-skills.sh --no-push    # 仅本地重建，不提交不推送
#   bash scripts/update-skills.sh --no-verify  # 推送后跳过线上访问验证
#   bash scripts/update-skills.sh -h|--help
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

# ── 路径与常量 ──────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
UPSTREAM_URL="https://github.com/NVIDIA/skills.git"
CACHE_DIR="$ROOT_DIR/.cache/nvidia-skills-upstream"
OUTPUT="$ROOT_DIR/Skills.md"
WORKFLOW="pages-deploy.yml"
LIVE_URL="https://nvidia-workbench.yyc3.vip/Skills.md"

DO_PUSH=1
DO_VERIFY=1
for arg in "$@"; do
  case "$arg" in
    --no-push)   DO_PUSH=0 ;;
    --no-verify) DO_VERIFY=0 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//' | head -12
      exit 0 ;;
    *) echo "未知参数: $arg" >&2; exit 2 ;;
  esac
done

c_ok()   { printf '\033[32m✔ %s\033[0m\n' "$1"; }
c_step() { printf '\n\033[36m▶ %s\033[0m\n' "$1"; }
c_warn() { printf '\033[33m! %s\033[0m\n' "$1"; }

# ── 1. 同步上游到本地缓存 ──────────────────────────────────────────────
c_step "1/5 同步上游 NVIDIA/skills 最新主干"
git_retry() {
  local n=0
  until "$@"; do
    n=$((n + 1))
    [ "$n" -ge 3 ] && return 1
    c_warn "git 操作失败，${n}/3 次重试中…"
    sleep 3
  done
}
if [ -d "$CACHE_DIR/.git" ]; then
  git_retry git -C "$CACHE_DIR" fetch --depth 1 origin main
  git -C "$CACHE_DIR" reset --hard origin/main
else
  mkdir -p "$(dirname "$CACHE_DIR")"
  git_retry git clone --depth 1 "$UPSTREAM_URL" "$CACHE_DIR"
fi
UPSTREAM_COMMIT="$(git -C "$CACHE_DIR" rev-parse --short HEAD)"
c_ok "上游版本: $UPSTREAM_COMMIT"

# ── 2. 重建 Skills.md（内含未编排/重复/缺描述校验）────────────────────
c_step "2/5 重建 Skills.md"
python3 "$SCRIPT_DIR/build-skills-catalog.py" \
  --upstream "$CACHE_DIR" --output "$OUTPUT"
TOTAL="$(sed -n '/^```text$/,/^```$/p' "$OUTPUT" | sed '1d;$d' | grep -c '^[a-z0-9][a-z0-9-]*$')"
c_ok "机器索引条目数: $TOTAL"

if [ "$DO_PUSH" -eq 0 ]; then
  c_step "完成（--no-push）"
  echo "  本地文件: $OUTPUT"
  echo "  如需发布: bash scripts/update-skills.sh"
  exit 0
fi

# ── 3. 提交并推送 ──────────────────────────────────────────────────────
c_step "3/5 提交并推送 main"
cd "$ROOT_DIR"
if [ -z "$(git status --porcelain -- "$OUTPUT")" ]; then
  c_warn "Skills.md 与上游 $UPSTREAM_COMMIT 一致，无变更，跳过提交"
else
  git add "$OUTPUT"
  git commit -m "chore(skills): 同步上游 @${UPSTREAM_COMMIT}，目录更新至 ${TOTAL} 项"
  git_retry git push origin main
  c_ok "已推送，Pages 部署工作流已触发"
fi

# ── 4. 等待 Pages 工作流完成 ───────────────────────────────────────────
c_step "4/5 等待 GitHub Pages 部署完成"
RUN_ID="$(gh run list --workflow="$WORKFLOW" --branch=main --limit 1 \
  --json databaseId --jq '.[0].databaseId')"
c_ok "工作流运行: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/actions/runs/${RUN_ID}"
gh run watch "$RUN_ID" --exit-status --interval 10 >/dev/null
c_ok "Pages 部署成功"

# ── 5. 线上访问验证 ────────────────────────────────────────────────────
if [ "$DO_VERIFY" -eq 1 ]; then
  c_step "5/5 线上访问验证"
  REMOTE_FILE="$(curl -fsSL --retry 3 --retry-delay 5 \
    "${LIVE_URL}?cb=$(date +%s)")"
  echo "$REMOTE_FILE" | grep -q "^total_skills: $TOTAL$" \
    || { echo "线上条目数与本地不一致" >&2; exit 1; }
  REMOTE_IDS="$(echo "$REMOTE_FILE" | sed -n '/^```text$/,/^```$/p' | sed '1d;$d')"
  LOCAL_IDS="$(sed -n '/^```text$/,/^```$/p' "$OUTPUT" | sed '1d;$d')"
  [ "$REMOTE_IDS" = "$LOCAL_IDS" ] \
    || { echo "线上 Skill ID 列表与本地不一致" >&2; exit 1; }
  c_ok "线上文件可访问且与本地完全一致（${TOTAL} 项）"
  echo "  $LIVE_URL"
else
  c_warn "已跳过线上验证（--no-verify）"
fi

c_step "全部完成"
