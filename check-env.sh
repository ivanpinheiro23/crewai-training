#!/bin/bash
echo "=========================================="
echo " VALIDAÇÃO DO AMBIENTE — CrewAI Course"
echo "=========================================="
echo ""
echo " Sistema Operacional:"
lsb_release -d
echo ""
echo " Python:"
python3 --version
echo ""
echo " Pip:"
pip3 --version
echo ""
echo " Git:"
git --version
echo ""
echo " CrewAI:"
python3 -c "import crewai; print('crewai', crewai.__version__)" 2>/dev/null || echo "❌ CrewAI não enc
echo ""
echo " API Key configurada:"
[ -n "$OPENAI_API_KEY" ] && echo " OPENAI_API_KEY definida" || echo "⚠ OPENAI_API_KEY não definida
echo ""
echo "=========================================="
echo " Hello CrewAI!"
python3 -c "print(' Ambiente Python funcionando corretamente!')"
echo "=========================================="