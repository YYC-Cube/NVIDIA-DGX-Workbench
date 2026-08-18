#!/usr/bin/env bash
# YYC³ 集群运维操作 — 需要 root 权限的操作汇总
# 用法: sudo bash ~/YYC3-专属文档/scripts/sudo-ops-summary.sh
# 创建: 2026-08-04 | Crush (AI) × YYC³ Team
#
# 本脚本执行以下操作:
#   1. R1: 更新 /etc/hosts 双机 QSFP 新拓扑
#   2. 安装 Embedding/Reranker/Memory systemd 服务
# 执行前请在 N1 上也复制此脚本(scp)

set -euo pipefail

echo "============================================"
echo "  YYC³ 集群运维操作 (root)"
echo "  节点: $(hostname)"
echo "  日期: $(date)"
echo "============================================"
echo ""

# ========== R1: /etc/hosts 更新 ==========
echo "[1/2] R1: 更新 /etc/hosts QSFP 新拓扑..."
HOSTS_FILE="/etc/hosts"
if grep -q "169.254.2.176" "$HOSTS_FILE" || grep -q "169.254.67.14" "$HOSTS_FILE"; then
    cp "$HOSTS_FILE" "${HOSTS_FILE}.bak.$(date +%Y%m%d-%H%M%S)"
    sed -i '/169\.254\.2\.176/d; /169\.254\.67\.14/d' "$HOSTS_FILE"
    echo "  ✅ 旧 link-local 条目已移除"
fi

if ! grep -q "yyc3-n1-1" "$HOSTS_FILE"; then
    cat >> "$HOSTS_FILE" << 'EOF'

# === QSFP 双链路新拓扑 (2026-08-04 更新) ===
# Link-1: enp1s0f0np0 (10.100.168.x)
10.100.168.2    yyc3-n1-1
10.100.168.1    yyc3-n2-1
# Link-2: enP2p1s0f0np0 (10.100.169.x)
10.100.169.2    yyc3-n1-2
10.100.169.1    yyc3-n2-2
EOF
    echo "  ✅ 新拓扑条目已写入"
else
    echo "  ℹ️  新拓扑条目已存在"
fi
echo ""

# ========== 安装 systemd 服务 ==========
echo "[2/2] 安装 Embedding/Reranker/Memory systemd 服务..."

PROJECTS_DIR="/home/yyc3/yyc3-102-projects"

for svc in yyc3-embedding yyc3-reranker yyc3-memory; do
    if [ -f "${PROJECTS_DIR}/${svc}.service" ]; then
        cp "${PROJECTS_DIR}/${svc}.service" /etc/systemd/system/
        echo "  ✅ ${svc}.service 已安装"
    fi
done

systemctl daemon-reload
systemctl enable yyc3-embedding yyc3-reranker yyc3-memory 2>/dev/null || true

echo ""
echo "============================================"
echo "  操作完成!"
echo "============================================"
echo ""
echo "验证:"
echo "  ping yyc3-n1-1   # 应返回 10.100.168.2"
echo "  systemctl status yyc3-embedding"
echo "  systemctl status yyc3-reranker"
echo "  systemctl status yyc3-memory"
echo ""
echo "注意: 在 N1 (yyc3-101) 上也需要执行同样的 hosts 更新"
