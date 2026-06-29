import random
import math

# Capacidad promedio por estante utilizada para escalar la infraestructura.
# El rango de capacidades por estante es [50, 150], con media ≈ 100.
CAPACIDAD_PROMEDIO_ESTANTE = 100

def generate_infraestructura(total_materiales=1000):
    """
    Genera la infraestructura física de la biblioteca escalando el número de
    estantes en función del total de materiales a almacenar.

    Parameters
    ----------
    total_materiales : int
        Número total de materiales que se almacenarán. Determina cuántos
        estantes se crean para garantizar capacidad suficiente.

    Returns
    -------
    tuple
        (pisos, zonas, sala_estantes, sala_lectura, administracion, estantes)
    """
    pisos = []
    zonas = []
    sala_estantes = []
    sala_lectura = []
    administracion = []
    estantes = []

    id_zonas = ['A', 'B', 'C', 'D']

    # Calcular cuántos estantes se necesitan.
    # Se agrega un margen del 10 % para absorber variaciones en la capacidad.
    estantes_necesarios = math.ceil(total_materiales / CAPACIDAD_PROMEDIO_ESTANTE * 1.10)

    # Distribución: 2 de cada 4 zonas son SalaEstantes (índices 0 y 1).
    # Con 4 pisos, hay 4 * 2 = 8 zonas de estantes.
    zonas_estantes_totales = 4 * 2  # pisos × zonas_estantes_por_piso
    estantes_por_zona = max(10, math.ceil(estantes_necesarios / zonas_estantes_totales))

    for num_piso in range(1, 5):  # Pisos 1 a 4
        pisos.append({
            'numeroDePiso': num_piso,
            'aforo': random.randint(100, 300)
        })

        for idx, id_zona in enumerate(id_zonas):
            aforo_zona = random.randint(20, 80)
            zonas.append({
                'numeroDePiso': num_piso,
                'idZona': id_zona,
                'aforoZona': aforo_zona
            })

            if idx == 0 or idx == 1:
                sala_estantes.append({
                    'numeroDePiso': num_piso,
                    'idZona': id_zona
                })
                for id_estante in range(1, estantes_por_zona + 1):
                    capacidad = random.randint(50, 150)
                    estantes.append({
                        'numeroDePiso': num_piso,
                        'idZona': id_zona,
                        'idEstante': id_estante,
                        'capacidad': capacidad
                    })
            elif idx == 2:
                sala_lectura.append({
                    'numeroDePiso': num_piso,
                    'idZona': id_zona,
                    'numeroDeSillas': random.randint(10, 40)
                })
            else:
                administracion.append({
                    'numeroDePiso': num_piso,
                    'idZona': id_zona
                })

    # ── Validaciones de dominio ──────────────────────────────────────────────

    pisos_existentes = {p['numeroDePiso'] for p in pisos}
    zonas_existentes = {(z['numeroDePiso'], z['idZona']) for z in zonas}

    errores = []

    for e in estantes:
        clave = (e['numeroDePiso'], e['idZona'], e['idEstante'])

        if e['capacidad'] <= 0:
            errores.append(
                f"Estante {clave} tiene capacidad inválida: {e['capacidad']}"
            )
        if e['numeroDePiso'] not in pisos_existentes:
            errores.append(
                f"Estante {clave} referencia un piso inexistente: {e['numeroDePiso']}"
            )
        if (e['numeroDePiso'], e['idZona']) not in zonas_existentes:
            errores.append(
                f"Estante {clave} referencia una zona inexistente: "
                f"({e['numeroDePiso']}, {e['idZona']})"
            )

    if errores:
        raise ValueError(
            "Errores de validación en infraestructura:\n" + "\n".join(errores)
        )

    capacidad_total = sum(e['capacidad'] for e in estantes)
    print(
        f"  Infraestructura generada: {len(pisos)} pisos, "
        f"{len(estantes)} estantes, "
        f"capacidad total = {capacidad_total:,}"
    )

    return (
        pisos,
        zonas,
        sala_estantes,
        sala_lectura,
        administracion,
        estantes
    )
