import random

def generate_miembros(fake, dnis_disponibles, num_miembros=300):
    dnis_miembros = random.sample(dnis_disponibles, num_miembros)
    
    miembros = [{'DNI': dni} for dni in dnis_miembros]
            
    return miembros, set(dnis_miembros)
