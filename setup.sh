#!/bin/bash
# ─────────────────────────────────────────────
# Aether AI — One-click setup script
# ─────────────────────────────────────────────
set -e

echo ""
echo "  ╔══════════════════════════════════╗"
echo "  ║  Aether AI — Setup Script        ║"
echo "  ╚══════════════════════════════════╝"
echo ""

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Backend ───────────────────────────────────
echo "📦  Setting up backend..."
cd "$ROOT/backend"

if command -v python3 &>/dev/null; then
  PYTHON=python3
else
  PYTHON=python
fi

$PYTHON -m venv venv
source venv/bin/activate
pip install -q -r requirements.txt
echo "✅  Backend ready."

# ── Frontend ─────────────────────────────────
echo ""
echo "📦  Installing frontend dependencies..."
cd "$ROOT/frontend"
npm install --silent
echo "✅  Frontend ready."

echo ""
echo "  ══════════════════════════════════════"
echo "  ✅  Setup complete! Start the app:"
echo ""
echo "  Terminal 1 (backend):"
echo "    cd backend && source venv/bin/activate"
echo "    uvicorn main:app --reload --port 8000"
echo ""
echo "  Terminal 2 (frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo "  ══════════════════════════════════════"
