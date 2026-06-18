import random

def generate_empleados(fake, dnis_disponibles, zonas, num_empleados=80):
    dnis_empleados = random.sample(dnis_disponibles, num_empleados)
    
    empleados = []
    bibliotecarios = []
    seguridad = []
    
    zonas_list = [(z['numeroDePiso'], z['idZona']) for z in zonas]
    
    for i, dni in enumerate(dnis_empleados):
        empleados.append({
            'DNI': dni,
            'codEmpleado': random.randint(10000, 99999),
            'sueldo': round(random.uniform(1500.0, 5000.0), 2)
        })
        
        zona_asignada = random.choice(zonas_list)
        
        if i < num_empleados * 0.6: # 60% bibliotecarios
            bibliotecarios.append({
                'DNI': dni,
                'numeroDePiso': zona_asignada[0],
                'idZona': zona_asignada[1]
            })
        else: # 40% seguridad
            armas = ['Ninguna', 'Vara', 'Pistola', 'Radio']
            seguridad.append({
                'DNI': dni,
                'arma': random.choice(armas),
                'numeroDePiso': zona_asignada[0],
                'idZona': zona_asignada[1]
            })
            
    return empleados, bibliotecarios, seguridad, set(dnis_empleados)
