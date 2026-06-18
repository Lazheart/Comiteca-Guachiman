import random
from datetime import datetime, timedelta

def generate_materiales(fake, estantes, num_novelas=400, num_comics=300, num_mangas=300):
    materiales = []
    novelas = []
    comics = []
    mangas = []
    ejemplares = []
    almacenamiento = []
    
    total_materiales = num_novelas + num_comics + num_mangas
    
    generos = ['Accion', 'Aventura', 'Fantasia', 'Ciencia Ficcion', 'Misterio', 'Terror', 'Romance', 'Historico', 'Comedia', 'Drama']
    paises = ['Japon', 'EEUU', 'Espana', 'Francia', 'Corea', 'Peru', 'Mexico', 'Argentina']
    
    estantes_list = [(e['numeroDePiso'], e['idZona'], e['idEstante']) for e in estantes]
    
    for i in range(1, total_materiales + 1):
        material_id = i
        
        fecha_pub = fake.date_between(start_date='-30y', end_date='today')
        
        materiales.append({
            'id': material_id,
            'titulo': fake.sentence(nb_words=4)[:30].replace('.', ''),
            'autor': fake.name()[:20],
            'genero': random.choice(generos)[:10],
            'ilustracion': fake.name()[:20] if random.choice([True, False]) else None,
            'editorial': fake.company()[:20],
            'fechaPublicacion': fecha_pub,
            'paisOrigen': random.choice(paises)[:10]
        })
        
        if i <= num_novelas:
            narraciones = ['Primera Persona', 'Tercera Persona', 'Testigo', 'Omnisciente']
            novelas.append({
                'id': material_id,
                'narracion': random.choice(narraciones)[:20]
            })
        elif i <= num_novelas + num_comics:
            tipos_comic = ['Grapa', 'Tomo', 'Integral', 'Novela Grafica']
            serializaciones = ['Semanal', 'Mensual', 'Bimestral', 'Finalizado']
            comics.append({
                'id': material_id,
                'tipoComic': random.choice(tipos_comic)[:20],
                'serializacion': random.choice(serializaciones)[:20]
            })
        else:
            mangas.append({
                'id': material_id
            })
            
        # Generar ejemplares (1 a 3 por material)
        num_ejemplares = random.randint(1, 3)
        estados = ['Nuevo', 'Bueno', 'Regular', 'Malo']
        disponibilidades = ['Disponible', 'Prestado', 'Mantenimiento']
        
        for num_copia in range(1, num_ejemplares + 1):
            ejemplares.append({
                'material_id': material_id,
                'numeroCopia': num_copia,
                'estadoConservacion': random.choice(estados)[:20],
                'disponibilidad': 'Disponible' # Set them to available by default
            })
            
        # Asignar a un estante (Almacenamiento)
        estante = random.choice(estantes_list)
        almacenamiento.append({
            'numeroDePiso': estante[0],
            'idZona': estante[1],
            'idEstante': estante[2],
            'material_id': material_id
        })
        
    return (
        materiales,
        novelas,
        comics,
        mangas,
        ejemplares,
        almacenamiento
    )
