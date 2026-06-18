import random
import os

def generate_personas(fake, num_personas=1000):
    personas = []
    dnis_generated = set()
    while len(personas) < num_personas:
        dni = random.randint(10000000, 99999999)
        if dni in dnis_generated:
            continue
        dnis_generated.add(dni)
        personas.append({
            'DNI': dni,
            'nombre': fake.first_name()[:20],
            'apellido': fake.last_name()[:20],
            'telefono': f"9{random.randint(10000000, 99999999)}",
            'correo': fake.unique.email()[:40]
        })
    return personas
