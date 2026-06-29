import csv
import os
import random
import argparse
from faker import Faker

# Import generator functions
from generate_personas import generate_personas
from generate_infraestructura import generate_infraestructura
from generate_empleados import generate_empleados
from generate_miembros import generate_miembros
from generate_visitantes import generate_visitantes
from generate_eventos import generate_ponentes, generate_eventos_y_relaciones
from generate_materiales import generate_materiales
from generate_prestamos import generate_prestamos_y_transacciones

def main():
    parser = argparse.ArgumentParser(description="Generar datos sintéticos para Comicteca Guachimán.")
    parser.add_argument('--size', type=str, choices=['1k', '10k', '100k', '1m'], default='10k',
                        help='Tamaño aproximado del dataset a generar (1k, 10k, 100k, 1m)')
    args = parser.parse_args()

    print(f"Iniciando la generación de datos sintéticos (Tamaño: {args.size})...")
    
    # Configuración inicial
    random.seed(42)
    Faker.seed(42)
    fake = Faker('es_ES')
    
    # Directorio de salida
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    def save_csv(data_list, filename):
        if not data_list:
            return
        path = os.path.join(data_dir, f"{filename}.csv")
        with open(path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=data_list[0].keys())
            writer.writeheader()
            writer.writerows(data_list)
        print(f"  - Generado {filename}.csv ({len(data_list)} registros)")

    # Factores de escala según el tamaño deseado
    scales = {
        '1k': 0.25,
        '10k': 2.5,
        '100k': 25,
        '1m': 250
    }
    m = scales[args.size]

    # Calcular cantidades
    c_personas = int(800 * m)
    c_empleados = int(80 * m)
    c_miembros = int(300 * m)
    c_visitantes = int(150 * m)
    c_ponentes = int(30 * m)
    c_novelas = int(500 * m)
    c_comics = int(300 * m)
    c_mangas = int(200 * m)
    c_eventos = int(60 * m)
    c_instituciones = int(25 * m)
    c_prestamos = int(1200 * m)
    c_sanciones = int(80 * m)
    c_reservas = int(150 * m)
    c_donaciones = int(50 * m)

    # 1. Personas (Base)
    print("\n1. Generando Personas...")
    df_personas = generate_personas(fake, num_personas=c_personas)
    save_csv(df_personas, 'Persona')
    
    dnis_disponibles = [p['DNI'] for p in df_personas]
    
    # 2. Infraestructura (escalada al volumen de materiales)
    total_materiales = c_novelas + c_comics + c_mangas
    print(f"\n2. Generando Infraestructura (para {total_materiales:,} materiales)...")
    df_pisos, df_zonas, df_sala_estantes, df_sala_lectura, df_administracion, df_estantes = generate_infraestructura(
        total_materiales=total_materiales
    )
    save_csv(df_pisos, 'Piso')
    save_csv(df_zonas, 'Zona')
    save_csv(df_sala_estantes, 'SalaEstantes')
    save_csv(df_sala_lectura, 'SalaLectura')
    save_csv(df_administracion, 'Administracion')
    save_csv(df_estantes, 'Estante')
    
    # 3. Empleados (Depende de Personas y Zonas)
    print("\n3. Generando Empleados, Bibliotecarios y Seguridad...")
    df_empleados, df_bibliotecarios, df_seguridad, dnis_usados_empleados = generate_empleados(
        fake, dnis_disponibles, df_zonas, num_empleados=c_empleados
    )
    save_csv(df_empleados, 'Empleado')
    save_csv(df_bibliotecarios, 'Bibliotecario')
    save_csv(df_seguridad, 'Seguridad')
    
    dnis_disponibles = list(set(dnis_disponibles) - dnis_usados_empleados)
    
    # 4. Miembros y Visitantes (Dependen de Personas)
    print("\n4. Generando Miembros y Visitantes...")
    df_miembros, dnis_usados_miembros = generate_miembros(fake, dnis_disponibles, num_miembros=c_miembros)
    save_csv(df_miembros, 'Miembro')
    dnis_disponibles = list(set(dnis_disponibles) - dnis_usados_miembros)
    
    df_visitantes, dnis_usados_visitantes = generate_visitantes(fake, dnis_disponibles, num_visitantes=c_visitantes)
    save_csv(df_visitantes, 'Visitante')
    dnis_disponibles = list(set(dnis_disponibles) - dnis_usados_visitantes)
    
    # 5. Ponentes
    print("\n5. Generando Ponentes...")
    df_ponentes, dnis_usados_ponentes = generate_ponentes(fake, dnis_disponibles, num_ponentes=c_ponentes)
    save_csv(df_ponentes, 'Ponente')
    dnis_disponibles = list(set(dnis_disponibles) - dnis_usados_ponentes)
    
    # 6. Materiales (Dependen de Estantes para Almacenamiento)
    print("\n6. Generando Materiales y Ejemplares...")
    df_materiales, df_novelas, df_comics, df_mangas, df_ejemplares, df_almacenamiento = generate_materiales(
        fake, df_estantes, num_novelas=c_novelas, num_comics=c_comics, num_mangas=c_mangas
    )
    save_csv(df_materiales, 'Material')
    save_csv(df_novelas, 'Novela')
    save_csv(df_comics, 'Comic')
    save_csv(df_mangas, 'Manga')
    save_csv(df_ejemplares, 'Ejemplar')
    save_csv(df_almacenamiento, 'Almacenamiento')
    
    # 7. Eventos e Instituciones
    print("\n7. Generando Eventos e Instituciones...")
    df_instituciones, df_eventos, df_asistencias, df_inscripciones, df_patrocinados, df_organizacion = generate_eventos_y_relaciones(
        fake, df_miembros, df_visitantes, df_ponentes, num_eventos=c_eventos, num_instituciones=c_instituciones
    )
    save_csv(df_instituciones, 'Institucion')
    save_csv(df_eventos, 'Evento')
    save_csv(df_asistencias, 'Asistencia')
    save_csv(df_inscripciones, 'Inscripcion')
    save_csv(df_patrocinados, 'Patrocinado')
    save_csv(df_organizacion, 'OrganizacionEvento')
    
    # 8. Transaccionales (Prestamos, etc.)
    print("\n8. Generando Préstamos y otras transacciones...")
    df_prestamos, df_sanciones, df_reservas, df_donaciones = generate_prestamos_y_transacciones(
        fake, df_miembros, df_bibliotecarios, df_ejemplares, df_instituciones,
        num_prestamos=c_prestamos, num_sanciones=c_sanciones, num_reservas=c_reservas, num_donaciones=c_donaciones
    )
    save_csv(df_prestamos, 'Prestamo')
    save_csv(df_sanciones, 'Sancion')
    save_csv(df_reservas, 'ReservaGestionada')
    save_csv(df_donaciones, 'Donacion')

    print("\n¡Generación de datos completada exitosamente!")
    
if __name__ == "__main__":
    main()
