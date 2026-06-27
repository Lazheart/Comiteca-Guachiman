import random
from datetime import datetime, timedelta

def generate_ponentes(fake, dnis_disponibles, num_ponentes=20):
    dnis_ponentes = random.sample(dnis_disponibles, num_ponentes)
    ponentes = []
    especialidades = ['Comics', 'Manga', 'Novela', 'Dibujo', 'Guion', 'Edicion', 'Historia', 'Arte']
    for dni in dnis_ponentes:
        ponentes.append({
            'DNI': dni,
            'taller': fake.sentence(nb_words=3)[:50].replace('.', ''),
            'especialidad': random.choice(especialidades)[:20]
        })
    return ponentes, set(dnis_ponentes)

def generate_eventos_y_relaciones(fake, miembros, visitantes, ponentes, num_eventos=50, num_instituciones=20):
    instituciones = []
    tipos_inst = ['Universidad', 'Colegio', 'Editorial', 'Asociacion Cultural', 'Empresa Privada']
    estados_inst = ['Activo', 'Inactivo']
    
    for i in range(1, num_instituciones + 1):
        instituciones.append({
            'id': i,
            'nombre': fake.company()[:50],
            'tipoInstitucion': random.choice(tipos_inst)[:50],
            'direccion': fake.address().replace('\n', ' ')[:200],
            'telefono': f"9{random.randint(10000000, 99999999)}",
            'correo': fake.unique.company_email()[:50],
            'representante': fake.name()[:20],
            'estado': random.choice(estados_inst)[:10]
        })
        
    eventos = []
    for i in range(1, num_eventos + 1):
        fecha = fake.date_between(start_date='-1y', end_date='+1m')
        hora_inicio_h = random.randint(9, 18)
        hora_inicio = f"{hora_inicio_h:02d}:00:00"
        hora_fin = f"{hora_inicio_h + random.randint(1, 4):02d}:00:00"
        
        eventos.append({
            'id': i,
            'tema': fake.sentence(nb_words=5)[:100].replace('.', ''),
            'fecha': fecha,
            'horaInicio': hora_inicio,
            'horaFin': hora_fin,
            'numeroDePiso': random.randint(1, 4),
            'idZona': random.choice(['A', 'B', 'C', 'D'])
        })
        
    asistencias = []
    inscripciones = []
    patrocinados = []
    organizacion_eventos = []
    
    visitantes_list = [v['DNI'] for v in visitantes]
    miembros_list = [m['DNI'] for m in miembros]
    ponentes_list = [p['DNI'] for p in ponentes]
    
    for evento in eventos:
        evento_id = evento['id']
        
        # Asistencias (Visitantes)
        num_asistencias = random.randint(0, 10)
        asistentes = random.sample(visitantes_list, min(num_asistencias, len(visitantes_list)))
        for dni in asistentes:
            asistencias.append({
                'visitante_DNI': dni,
                'evento_id': evento_id
            })
            
        # Inscripciones (Miembros)
        num_inscripciones = random.randint(5, 20)
        inscritos = random.sample(miembros_list, min(num_inscripciones, len(miembros_list)))
        for dni in inscritos:
            inscripciones.append({
                'miembro_DNI': dni,
                'evento_id': evento_id,
                'fechaInscripcion': fake.date_between(start_date='-2y', end_date=evento['fecha'])
            })
            
        # Patrocinado
        if random.random() < 0.5: # 50% chance of having a sponsor
            inst_id = random.randint(1, num_instituciones)
            patrocinados.append({
                'institucion_id': inst_id,
                'evento_id': evento_id,
                'montoPatrocinio': round(random.uniform(100.0, 5000.0), 2)
            })
            
        # OrganizacionEvento
        if ponentes_list and random.random() < 0.7: # 70% chance of having an organizer/ponente
            inst_id = random.randint(1, num_instituciones)
            ponente_dni = random.choice(ponentes_list)
            organizacion_eventos.append({
                'institucion_id': inst_id,
                'evento_id': evento_id,
                'ponente_DNI': ponente_dni
            })
            
    return (
        instituciones,
        eventos,
        asistencias,
        inscripciones,
        patrocinados,
        organizacion_eventos
    )
