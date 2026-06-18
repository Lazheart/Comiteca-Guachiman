import random

def generate_visitantes(fake, dnis_disponibles, num_visitantes=100):
    dnis_visitantes = random.sample(dnis_disponibles, num_visitantes)
    
    visitantes = [{'DNI': dni} for dni in dnis_visitantes]
            
    return visitantes, set(dnis_visitantes)
