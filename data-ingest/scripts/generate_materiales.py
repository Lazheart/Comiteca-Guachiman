import random
import sys
from datetime import datetime, timedelta


# ── Progreso en consola ──────────────────────────────────────────────────────

def _progreso(actual, total, prefijo="", ancho=40):
    """Imprime una barra de progreso en la misma línea."""
    fraccion = actual / total if total else 1
    llenos = int(ancho * fraccion)
    barra = "█" * llenos + "░" * (ancho - llenos)
    porcentaje = fraccion * 100
    print(f"\r  {prefijo} [{barra}] {porcentaje:5.1f}%  {actual:,}/{total:,}", end="", flush=True)
    if actual >= total:
        print()  # salto de línea al terminar


# ── Asignación eficiente sin pool gigante ────────────────────────────────────

def _construir_pesos(estantes):
    """
    Devuelve (claves, capacidades, pesos_acumulados) listos para muestreo
    ponderado eficiente.  O(num_estantes), no O(capacidad_total).
    """
    claves = [(e['numeroDePiso'], e['idZona'], e['idEstante']) for e in estantes]
    caps   = [e['capacidad'] for e in estantes]
    return claves, caps


def _asignar_estantes(claves, caps, total_materiales):
    """
    Asigna `total_materiales` materiales a estantes respetando capacidades.

    Algoritmo: muestreo ponderado con reducción de peso al llenarse.
    - O(total_materiales · log(num_estantes)) en el caso medio.
    - Memoria: O(num_estantes)  — nunca se expande el pool completo.

    Devuelve una lista de claves de longitud `total_materiales`.
    """
    # Trabajamos con listas mutables de pesos
    pesos_restantes = list(caps)      # slots disponibles por estante
    asignaciones = []

    REPORTE_CADA = max(1, total_materiales // 100)

    for i in range(total_materiales):
        if i % REPORTE_CADA == 0:
            _progreso(i, total_materiales, prefijo="  Asignando estantes")

        # random.choices con pesos = muestreo ponderado en O(num_estantes)
        idx = random.choices(range(len(claves)), weights=pesos_restantes, k=1)[0]
        asignaciones.append(claves[idx])
        pesos_restantes[idx] -= 1

        # Si el estante se llena, lo eliminamos para acelerar futuras búsquedas
        if pesos_restantes[idx] == 0:
            claves.pop(idx)
            pesos_restantes.pop(idx)

    _progreso(total_materiales, total_materiales, prefijo="  Asignando estantes")
    return asignaciones


# ── Función principal ────────────────────────────────────────────────────────

def generate_materiales(fake, estantes, num_novelas=400, num_comics=300, num_mangas=300):
    """
    Genera materiales (novelas, cómics, mangas), sus ejemplares y la tabla de
    almacenamiento respetando la capacidad física de cada estante.

    Estrategia de asignación:
      Muestreo ponderado con reducción de peso — O(N · E) tiempo, O(E) memoria
      donde N = total de materiales y E = número de estantes.
      No se materializa ningún pool de slots gigante.
    """

    materiales     = []
    novelas        = []
    comics         = []
    mangas         = []
    ejemplares     = []
    almacenamiento = []

    total_materiales = num_novelas + num_comics + num_mangas

    generos = [
        'Accion', 'Aventura', 'Fantasia', 'Ciencia Fi', 'Misterio',
        'Terror', 'Romance', 'Historico', 'Comedia', 'Drama'
    ]
    paises = ['Japon', 'EEUU', 'Espana', 'Francia', 'Corea', 'Peru', 'Mexico', 'Argentina']

    # ── 1. Validar capacidad total ───────────────────────────────────────────

    capacidad_total = sum(e['capacidad'] for e in estantes)
    if total_materiales > capacidad_total:
        raise ValueError(
            f"\nNo existe suficiente capacidad física para almacenar todos los "
            f"materiales generados.\n"
            f"  Materiales:           {total_materiales:,}\n"
            f"  Capacidad disponible: {capacidad_total:,}\n"
            f"Aumente el número de estantes o reduzca la cantidad de materiales."
        )

    capacidad_map = {
        (e['numeroDePiso'], e['idZona'], e['idEstante']): e['capacidad']
        for e in estantes
    }

    # ── 2. Asignar estantes (sin pool gigante) ───────────────────────────────

    print(f"  Calculando asignación de {total_materiales:,} materiales a estantes...")
    claves_mut, caps_mut = _construir_pesos(estantes)
    slots_asignados = _asignar_estantes(claves_mut, caps_mut, total_materiales)

    # ── 3. Generar registros ─────────────────────────────────────────────────

    narraciones    = ['Primera Persona', 'Tercera Persona', 'Testigo', 'Omnisciente']
    tipos_comic    = ['Grapa', 'Tomo', 'Integral', 'Novela Grafica']
    serializaciones = ['Semanal', 'Mensual', 'Bimestral', 'Finalizado']
    estados        = ['Nuevo', 'Bueno', 'Regular', 'Malo']

    materiales_ids   = set()
    material_asignado = {}
    ocupacion        = {}

    REPORTE_CADA = max(1, total_materiales // 100)

    print(f"  Generando registros...")
    for i in range(1, total_materiales + 1):
        material_id = i
        materiales_ids.add(material_id)

        if i % REPORTE_CADA == 0 or i == total_materiales:
            _progreso(i, total_materiales, prefijo="  Generando materiales")

        fecha_pub = fake.date_between(start_date='-30y', end_date='today')

        materiales.append({
            'id':               material_id,
            'titulo':           fake.sentence(nb_words=4)[:30].replace('.', ''),
            'autor':            fake.name()[:20],
            'genero':           random.choice(generos)[:10],
            'ilustracion':      fake.name()[:20] if random.choice([True, False]) else None,
            'editorial':        fake.company()[:20],
            'fechaPublicacion': fecha_pub,
            'paisOrigen':       random.choice(paises)[:10]
        })

        # Sub-tipo
        if i <= num_novelas:
            novelas.append({
                'id':        material_id,
                'narracion': random.choice(narraciones)[:20]
            })
        elif i <= num_novelas + num_comics:
            comics.append({
                'id':            material_id,
                'tipoComic':     random.choice(tipos_comic)[:20],
                'serializacion': random.choice(serializaciones)[:20]
            })
        else:
            mangas.append({'id': material_id})

        # Ejemplares (1–3 por material, numeroCopia consecutiva desde 1)
        num_ejemplares = random.randint(1, 3)
        for num_copia in range(1, num_ejemplares + 1):
            ejemplares.append({
                'material_id':        material_id,
                'numeroCopia':        num_copia,
                'estadoConservacion': random.choice(estados)[:20],
                'disponibilidad':     'Disponible'
            })

        # Almacenamiento
        clave_estante = slots_asignados[i - 1]
        ocupacion[clave_estante] = ocupacion.get(clave_estante, 0) + 1
        material_asignado[material_id] = clave_estante

        almacenamiento.append({
            'numeroDePiso': clave_estante[0],
            'idZona':       clave_estante[1],
            'idEstante':    clave_estante[2],
            'material_id':  material_id
        })

    # ── 4. Validaciones de dominio ───────────────────────────────────────────

    _validar_materiales(
        total_materiales, materiales_ids, material_asignado,
        ocupacion, capacidad_map, ejemplares
    )

    return (materiales, novelas, comics, mangas, ejemplares, almacenamiento)


# ── Validaciones ─────────────────────────────────────────────────────────────

def _validar_materiales(
    total_materiales, materiales_ids, material_asignado,
    ocupacion, capacidad_map, ejemplares
):
    """Ejecuta todas las validaciones de dominio y aborta si detecta errores."""

    errores = []

    # 4.1 Cada material tiene exactamente una ubicación
    sin_ubicacion = materiales_ids - set(material_asignado.keys())
    if sin_ubicacion:
        errores.append(
            f"Materiales sin ubicación: {sorted(sin_ubicacion)[:10]}..."
        )

    # 4.2 Ningún estante excede su capacidad
    for clave, ocup in ocupacion.items():
        cap = capacidad_map.get(clave, 0)
        if ocup > cap:
            errores.append(
                f"Estante {clave} excede capacidad: ocupación={ocup}, máx={cap}"
            )

    # 4.3 Integridad referencial de ejemplares
    for ej in ejemplares:
        if ej['material_id'] not in materiales_ids:
            errores.append(
                f"Ejemplar referencia material inexistente: {ej['material_id']}"
            )
            break  # un solo reporte es suficiente

    # 4.4 Números de copia consecutivos por material (comienza en 1)
    copias_por_material = {}
    for ej in ejemplares:
        copias_por_material.setdefault(ej['material_id'], []).append(ej['numeroCopia'])

    for mid, copias in copias_por_material.items():
        copias_ord = sorted(copias)
        if copias_ord != list(range(1, len(copias) + 1)):
            errores.append(
                f"Material {mid} tiene copias no consecutivas: {copias_ord}"
            )
            break

    if errores:
        raise ValueError(
            "Errores de validación en materiales:\n" + "\n".join(errores)
        )

    print(
        f"  Validación OK: {total_materiales:,} materiales, "
        f"{len(ejemplares):,} ejemplares, "
        f"{len(ocupacion)} estantes utilizados."
    )
