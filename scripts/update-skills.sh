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
SITE_ROOT="https://nvidia-workbench.yyc3.vip/"
LIVE_URL="https://nvidia-workbench.yyc3.vip/Skills.md"
# 本脚本管理的全部产物
MANAGED_FILES=("$OUTPUT" "$ROOT_DIR/DGX-SPARK-HUB-OFFLINE.html" "$ROOT_DIR/index.html")

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

# ── 2. 重建 Skills.md 与站点 HTML（内含未编排/重复/缺描述校验）─────────
c_step "2/5 重建 Skills.md 与站点页面数据"
python3 "$SCRIPT_DIR/build-skills-catalog.py" \
  --upstream "$CACHE_DIR" --output "$OUTPUT"
python3 "$SCRIPT_DIR/build-skills-html.py" \
  --upstream "$CACHE_DIR" \
  --html "$ROOT_DIR/DGX-SPARK-HUB-OFFLINE.html" \
  --html "$ROOT_DIR/index.html"
TOTAL="$(sed -n '/^```text$/,/^```$/p' "$OUTPUT" | sed '1d;$d' | grep -c '^[a-z0-9][a-z0-9-]*$')"
c_ok "技能总数: $TOTAL"

if [ "$DO_PUSH" -eq 0 ]; then
  c_step "完成（--no-push）"
  echo "  本地文件: $OUTPUT"
  echo "  如需发布: bash scripts/update-skills.sh"
  exit 0
fi

# ── 3. 提交并推送 ──────────────────────────────────────────────────────
c_step "3/5 提交并推送 main"
cd "$ROOT_DIR"
PUSHED_SHA=""
if [ -z "$(git status --porcelain -- "${MANAGED_FILES[@]}")" ]; then
  c_warn "全部产物与上游 $UPSTREAM_COMMIT 一致，无变更，跳过提交"
else
  git add "${MANAGED_FILES[@]}"
  git commit -m "chore(skills): 同步上游 @${UPSTREAM_COMMIT}，技能库更新至 ${TOTAL} 项"
  git_retry git push origin main
  PUSHED_SHA="$(git rev-parse HEAD)"
  c_ok "已推送 ${PUSHED_SHA:0:7}，Pages 部署工作流已触发"
fi

# ── 4. 等待 Pages 工作流完成 ───────────────────────────────────────────
c_step "4/5 等待 GitHub Pages 部署完成"
RUN_ID=""
if [ -n "$PUSHED_SHA" ]; then
  # 精确匹配本次提交；run 注册有延迟，最多等待 60s
  for _ in 1 2 3 4 5 6; do
    RUN_ID="$(gh run list --workflow="$WORKFLOW" --commit="$PUSHED_SHA" \
      --json databaseId --jq '.[0].databaseId' 2>/dev/null)"
    [ -n "$RUN_ID" ] && break
    sleep 10
  done
else
  RUN_ID="$(gh run list --workflow="$WORKFLOW" --branch=main --limit 1 \
    --json databaseId --jq '.[0].databaseId')"
fi
[ -n "$RUN_ID" ] || { echo "未找到 Pages 部署工作流运行" >&2; exit 1; }
c_ok "工作流运行: https://github.com/YYC-Cube/NVIDIA-DGX-Workbench/actions/runs/${RUN_ID}"
gh run watch "$RUN_ID" --exit-status --interval 10 >/dev/null
c_ok "Pages 部署成功"

# ── 5. 线上访问验证 ────────────────────────────────────────────────────
if [ "$DO_VERIFY" -eq 1 ]; then
  c_step "5/5 线上访问验证"
  LOCAL_IDS="$(sed -n '/^```text$/,/^```$/p' "$OUTPUT" | sed '1d;$d')"
  verified=0
  for attempt in 1 2 3 4 5; do
    cb="$(date +%s)"
    REMOTE_FILE="$(curl -fsSL --retry 2 --retry-delay 5 \
      "${LIVE_URL}?cb=${cb}")"
    REMOTE_IDS="$(echo "$REMOTE_FILE" | sed -n '/^```text$/,/^```$/p' | sed '1d;$d')"
    REMOTE_SITE="$(curl -fsSL --retry 2 --retry-delay 5 \
      "${SITE_ROOT}?cb=${cb}")"
    if echo "$REMOTE_FILE" | grep -q "^total_skills: $TOTAL$" \
       && [ "$REMOTE_IDS" = "$LOCAL_IDS" ] \
       && echo "$REMOTE_SITE" | grep -q "order: ${TOTAL},"; then
      verified=1
      break
    fi
    c_warn "边缘节点尚未同步，15s 后重试（${attempt}/5）…"
    sleep 15
  done
  [ "$verified" -eq 1 ] || { echo "线上文件多次验证仍不一致" >&2; exit 1; }
  c_ok "线上 Skills.md 与站点首页均已更新（${TOTAL} 项）"
  echo "  $LIVE_URL"
  echo "  $SITE_ROOT"
else
  c_warn "已跳过线上验证（--no-verify）"
fi

c_step "全部完成"
