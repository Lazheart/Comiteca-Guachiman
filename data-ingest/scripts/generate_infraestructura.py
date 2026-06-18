import random

def generate_infraestructura():
    pisos = []
    zonas = []
    sala_estantes = []
    sala_lectura = []
    administracion = []
    estantes = []
    
    id_zonas = ['A', 'B', 'C', 'D']
    
    for num_piso in range(1, 5): # Pisos 1 to 4
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
            
            # Distribute zone types
            if idx == 0 or idx == 1:
                sala_estantes.append({
                    'numeroDePiso': num_piso,
                    'idZona': id_zona
                })
                # Generar estantes para esta zona
                for id_estante in range(1, 11): # 10 estantes por zona
                    estantes.append({
                        'numeroDePiso': num_piso,
                        'idZona': id_zona,
                        'idEstante': id_estante,
                        'capacidad': random.randint(50, 150)
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
                
    return (
        pisos,
        zonas,
        sala_estantes,
        sala_lectura,
        administracion,
        estantes
    )
