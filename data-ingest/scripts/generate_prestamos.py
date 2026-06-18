import random
from datetime import timedelta

def generate_prestamos_y_transacciones(fake, miembros, bibliotecarios, ejemplares, instituciones, num_prestamos=1000, num_sanciones=50, num_reservas=100, num_donaciones=40):
    prestamos = []
    sanciones = []
    reservas = []
    donaciones = []
    
    miembros_list = [m['DNI'] for m in miembros]
    biblio_list = [b['DNI'] for b in bibliotecarios]
    ejemplares_list = [(e['material_id'], e['numeroCopia']) for e in ejemplares]
    inst_list = [i['id'] for i in instituciones]
    
    # PRESTAMOS
    estados_prestamo = ['Devuelto', 'En Curso', 'Vencido']
    for i in range(1, num_prestamos + 1):
        fecha_prestamo = fake.date_between(start_date='-1y', end_date='today')
        fecha_limite = fecha_prestamo + timedelta(days=14)
        
        estado = random.choice(estados_prestamo)[:20]
        if estado == 'Devuelto':
            fecha_devolucion = fecha_prestamo + timedelta(days=random.randint(1, 20))
            if fecha_devolucion > fecha_limite:
                estado = 'Devuelto con Retraso'
        elif estado == 'Vencido':
            fecha_devolucion = None
            if fake.date_object() < fecha_limite:
                estado = 'En Curso'
        else:
            fecha_devolucion = None
            
        ejemplar = random.choice(ejemplares_list)
        
        prestamos.append({
            'id': i,
            'miembro_DNI': random.choice(miembros_list),
            'bibliotecario_DNI': random.choice(biblio_list),
            'material_id': ejemplar[0],
            'numeroCopia': ejemplar[1],
            'fechaPrestamo': fecha_prestamo,
            'fechaLimite': fecha_limite,
            'fechaDevolucion': fecha_devolucion,
            'estado': estado[:20]
        })
        
    # SANCIONES
    motivos_sancion = ['Retraso en devolucion', 'Material dañado', 'Pérdida de material', 'Comportamiento indebido']
    for i in range(1, num_sanciones + 1):
        sanciones.append({
            'idSancion': i,
            'miembro_DNI': random.choice(miembros_list),
            'bibliotecario_DNI': random.choice(biblio_list),
            'motivo': random.choice(motivos_sancion)[:200],
            'fecha': fake.date_between(start_date='-1y', end_date='today')
        })
        
    # RESERVAS GESTIONADAS
    estados_reserva = ['Pendiente', 'Atendida', 'Cancelada']
    for i in range(1, num_reservas + 1):
        ejemplar = random.choice(ejemplares_list)
        reservas.append({
            'miembro_DNI': random.choice(miembros_list),
            'bibliotecario_DNI': random.choice(biblio_list),
            'material_id': ejemplar[0],
            'numeroCopia': ejemplar[1],
            'fechaReserva': fake.date_between(start_date='-1y', end_date='today'),
            'estadoReserva': random.choice(estados_reserva)[:20]
        })
        
    # DONACIONES
    for i in range(1, num_donaciones + 1):
        ejemplar = random.choice(ejemplares_list) # Just picking a material_id
        donaciones.append({
            'institucion_id': random.choice(inst_list) if inst_list else 1,
            'bibliotecario_DNI': random.choice(biblio_list),
            'material_id': ejemplar[0],
            'fechaDonacion': fake.date_between(start_date='-2y', end_date='today'),
            'cantidad': random.randint(1, 50)
        })
        
    # Deduplicate manual
    seen_reservas = set()
    reservas_uniq = []
    for r in reservas:
        key = (r['miembro_DNI'], r['bibliotecario_DNI'], r['material_id'], r['numeroCopia'], r['fechaReserva'])
        if key not in seen_reservas:
            seen_reservas.add(key)
            reservas_uniq.append(r)
            
    seen_donaciones = set()
    donaciones_uniq = []
    for d in donaciones:
        key = (d['institucion_id'], d['bibliotecario_DNI'], d['material_id'], d['fechaDonacion'])
        if key not in seen_donaciones:
            seen_donaciones.add(key)
            donaciones_uniq.append(d)
        
    return (
        prestamos,
        sanciones,
        reservas_uniq,
        donaciones_uniq
    )
