import csv
import random
import os

def generate_missing_data(data_dir):
    # This script adds missing values to simulate real-world data
    
    # Personas: telefono and correo can be missing
    personas_path = os.path.join(data_dir, 'Persona.csv')
    if os.path.exists(personas_path):
        with open(personas_path, 'r', encoding='utf-8') as f:
            personas = list(csv.DictReader(f))
        for p in personas:
            if random.random() < 0.1: p['telefono'] = ''
            if random.random() < 0.05: p['correo'] = ''
        with open(personas_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=personas[0].keys())
            writer.writeheader()
            writer.writerows(personas)
        
    # Institucion: telefono, correo, representante can be missing
    inst_path = os.path.join(data_dir, 'Institucion.csv')
    if os.path.exists(inst_path):
        with open(inst_path, 'r', encoding='utf-8') as f:
            insts = list(csv.DictReader(f))
        for i in insts:
            if random.random() < 0.1: i['telefono'] = ''
            if random.random() < 0.05: i['correo'] = ''
            if random.random() < 0.1: i['representante'] = ''
        with open(inst_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=insts[0].keys())
            writer.writeheader()
            writer.writerows(insts)

if __name__ == '__main__':
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    generate_missing_data(data_dir)
