#!/bin/bash

# Directorio base
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR"

# 1. Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
fi

# 2. Activar entorno virtual
source venv/bin/activate

# 3. Instalar dependencias (Faker es necesario)
echo "Verificando/instalando dependencias..."
pip install -q Faker

# 4. Mostrar menú
echo "=========================================="
echo "    Generador de Datos - Comicteca"
echo "=========================================="
echo "Seleccione la cantidad aproximada de datos a generar:"
echo "  1) 1k  (Dataset pequeño)"
echo "  2) 10k (Dataset medio)"
echo "  3) 100k (Dataset grande)"
echo "  4) 1 Millón (Dataset muy grande)"
echo "=========================================="
read -p "Ingrese una opción (1-4): " OPCION

# 5. Mapear opción al parámetro de tamaño
case $OPCION in
    1)
        SIZE="1k"
        ;;
    2)
        SIZE="10k"
        ;;
    3)
        SIZE="100k"
        ;;
    4)
        SIZE="1m"
        ;;
    *)
        echo "Opción inválida. Saliendo..."
        exit 1
        ;;
esac

echo "=========================================="
echo "Iniciando generación con tamaño: $SIZE..."
echo "=========================================="

# 6. Ejecutar script de Python con el tamaño seleccionado
python scripts/generate_all.py --size "$SIZE"

echo "=========================================="
echo "Proceso finalizado exitosamente."
echo "=========================================="
