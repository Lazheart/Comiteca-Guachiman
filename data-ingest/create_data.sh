#!/bin/bash

# ── Configuración ─────────────────────────────────────────────────────────────
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

# Colores
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
BOLD="\033[1m"
RESET="\033[0m"

header() {
    echo -e "\n${CYAN}${BOLD}══════════════════════════════════════════════${RESET}"
    echo -e "${CYAN}${BOLD}    Generador de Datos — Comicteca Guachimán${RESET}"
    echo -e "${CYAN}${BOLD}══════════════════════════════════════════════${RESET}"
}

# ── 1. Entorno virtual ────────────────────────────────────────────────────────
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creando entorno virtual...${RESET}"
    python3 -m venv venv
fi

source venv/bin/activate

# ── 2. Dependencias ───────────────────────────────────────────────────────────
echo -e "${YELLOW}Verificando dependencias...${RESET}"
pip install -q Faker pandas

# ── 3. Menú de selección ──────────────────────────────────────────────────────
header
echo ""
echo -e "  Seleccione el tamaño del dataset a generar:"
echo ""
echo -e "  ${BOLD}1)${RESET} 1k   — Dataset pequeño    (~1.000 materiales)"
echo -e "  ${BOLD}2)${RESET} 10k  — Dataset mediano   (~10.000 materiales)"
echo -e "  ${BOLD}3)${RESET} 100k — Dataset grande   (~100.000 materiales)"
echo -e "  ${BOLD}4)${RESET} 1m   — Dataset muy grande (~1.000.000 materiales)"
echo ""
read -p "  Ingrese una opción (1-4): " OPCION

case $OPCION in
    1) SIZE="1k"   ;;
    2) SIZE="10k"  ;;
    3) SIZE="100k" ;;
    4) SIZE="1m"   ;;
    *)
        echo -e "${RED}Opción inválida. Saliendo...${RESET}"
        deactivate
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}${BOLD}Iniciando generación (tamaño: ${SIZE})...${RESET}"
echo -e "${CYAN}══════════════════════════════════════════════${RESET}\n"

# ── 4. Ejecución con salida en tiempo real ────────────────────────────────────
# PYTHONUNBUFFERED=1 fuerza a Python a no hacer buffer en stdout/stderr,
# garantizando que las barras de progreso aparezcan inmediatamente.

START_TIME=$SECONDS

PYTHONUNBUFFERED=1 python3 scripts/generate_all.py --size "$SIZE"
EXIT_CODE=$?

ELAPSED=$(( SECONDS - START_TIME ))
ELAPSED_MIN=$(( ELAPSED / 60 ))
ELAPSED_SEC=$(( ELAPSED % 60 ))

echo ""
echo -e "${CYAN}══════════════════════════════════════════════${RESET}"

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ Proceso finalizado correctamente.${RESET}"
    echo -e "  Tiempo total: ${ELAPSED_MIN}m ${ELAPSED_SEC}s"
    echo -e "  CSVs en: ${BASE_DIR}/data/"
else
    echo -e "${RED}${BOLD}✗ El proceso finalizó con errores (código: ${EXIT_CODE}).${RESET}"
    echo -e "  Revisa la salida anterior para más detalles."
fi

echo -e "${CYAN}══════════════════════════════════════════════${RESET}\n"

deactivate
exit $EXIT_CODE
