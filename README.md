# Comiteca Guachimán

## Descripción

Este repositorio contiene el diseño, implementación y documentación de un sistema de base de datos para la gestión de una comiteca. El proyecto incluye el modelo relacional, restricciones de integridad, mecanismos de automatización mediante triggers, vistas, índices, generación de datos sintéticos y una interfaz de demostración para visualizar la información almacenada.

La documentación completa del proyecto puede encontrarse en la carpeta `docs/`.

---

## Tecnologías Utilizadas

* **PostgreSQL** como sistema gestor de bases de datos.
* **Python** para la generación masiva de datos sintéticos y simulación de datos faltantes.
* **React / Next.js** para la interfaz de demostración del sistema.
* **Docker Compose** para facilitar el despliegue del entorno de desarrollo.

---

## Estructura del Proyecto

```text
├── data-ingest
│   ├── load_data.sql
│   └── scripts
│       ├── generate_all.py
│       ├── generate_empleados.py
│       ├── generate_eventos.py
│       ├── generate_materiales.py
│       ├── generate_miembros.py
│       ├── generate_missing_data.py
│       ├── generate_personas.py
│       ├── generate_prestamos.py
│       └── generate_visitantes.py
├── docs
└── sql
    ├── 01_create_tables.sql
    ├── 02_constraints.sql
    ├── 03_triggers.sql
    ├── 04_views.sql
    ├── 05_indexes.sql
    ├── 06_seed_data.sql
    └── 07_queries.sql
```

---

## Organización de los Scripts SQL

| Archivo                | Descripción                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `01_create_tables.sql` | Definición de las tablas del modelo relacional.               |
| `02_constraints.sql`   | Restricciones de integridad, claves primarias y foráneas.     |
| `03_triggers.sql`      | Definición de triggers y funciones asociadas.                 |
| `04_views.sql`         | Vistas utilizadas para consultas y reportes.                  |
| `05_indexes.sql`       | Índices para optimización de consultas.                       |
| `06_seed_data.sql`     | Datos de prueba controlados para demostraciones y validación. |
| `07_queries.sql`       | Consultas requeridas por el proyecto y ejemplos de uso.       |

---

## Generación e Ingesta de Datos

La carpeta `data-ingest/` contiene las herramientas necesarias para poblar la base de datos con información sintética.

### Generación de Datos

Los scripts ubicados en `data-ingest/scripts/` generan registros aleatorios respetando las restricciones del modelo relacional y las dependencias entre tablas.

Además, algunos scripts permiten simular escenarios de datos incompletos mediante la inserción controlada de valores faltantes (`NULL`) en atributos seleccionados.

### Carga de Datos

El archivo `load_data.sql` contiene las instrucciones necesarias para importar los archivos CSV generados en la carpeta `generated/` hacia la base de datos PostgreSQL.

---

## Datos de Demostración

El archivo `06_seed_data.sql` contiene un conjunto reducido de datos cuidadosamente seleccionados para demostrar consultas, vistas, triggers y casos de uso específicos durante la presentación del proyecto.

Estos datos son independientes de los conjuntos masivos generados mediante los scripts de ingesta.
