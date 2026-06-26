-- Script para cargar datos desde CSV a las tablas de PostgreSQL
-- Asegúrate de ejecutar este script desde el directorio raíz del proyecto o ajustar las rutas.
-- Comando de ejemplo: psql -U tu_usuario -d comiteca -f data-ingest/load_data.sql

-- NOTA: Usa rutas absolutas si \copy falla con rutas relativas.
-- Las sentencias a continuación asumen que psql se ejecuta desde el directorio superior a data-ingest/data/
-- y que \copy usa las rutas relativas.

\echo 'Cargando Personas y roles...'
\copy Persona FROM 'data/Persona.csv' WITH CSV HEADER;
\copy Miembro FROM 'data/Miembro.csv' WITH CSV HEADER;
\copy Visitante FROM 'data/Visitante.csv' WITH CSV HEADER;
\copy Ponente FROM 'data/Ponente.csv' WITH CSV HEADER;
\copy Empleado FROM 'data/Empleado.csv' WITH CSV HEADER;

\echo 'Cargando Infraestructura...'
\copy Piso FROM 'data/Piso.csv' WITH CSV HEADER;
\copy Zona FROM 'data/Zona.csv' WITH CSV HEADER;
\copy SalaEstantes FROM 'data/SalaEstantes.csv' WITH CSV HEADER;
\copy SalaLectura FROM 'data/SalaLectura.csv' WITH CSV HEADER;
\copy Administracion FROM 'data/Administracion.csv' WITH CSV HEADER;
\copy Estante FROM 'data/Estante.csv' WITH CSV HEADER;

\echo 'Cargando roles de empleados específicos de zona...'
\copy Seguridad FROM 'data/Seguridad.csv' WITH CSV HEADER;
\copy Bibliotecario FROM 'data/Bibliotecario.csv' WITH CSV HEADER;

\echo 'Cargando Materiales...'
\copy Material FROM 'data/Material.csv' WITH CSV HEADER;
\copy Novela FROM 'data/Novela.csv' WITH CSV HEADER;
\copy Comic FROM 'data/Comic.csv' WITH CSV HEADER;
\copy Manga FROM 'data/Manga.csv' WITH CSV HEADER;
\copy Ejemplar FROM 'data/Ejemplar.csv' WITH CSV HEADER;
\copy Almacenamiento FROM 'data/Almacenamiento.csv' WITH CSV HEADER;

\echo 'Cargando Eventos e Instituciones...'
\copy Institucion FROM 'data/Institucion.csv' WITH CSV HEADER;
\copy Evento FROM 'data/Evento.csv' WITH CSV HEADER;

\echo 'Cargando Transaccionales y relaciones N:M...'
\copy Asistencia FROM 'data/Asistencia.csv' WITH CSV HEADER;
\copy Inscripcion FROM 'data/Inscripcion.csv' WITH CSV HEADER;
\copy Patrocinado FROM 'data/Patrocinado.csv' WITH CSV HEADER;
\copy OrganizacionEvento FROM 'data/OrganizacionEvento.csv' WITH CSV HEADER;
\copy Prestamo FROM 'data/Prestamo.csv' WITH CSV HEADER;
\copy Sancion FROM 'data/Sancion.csv' WITH CSV HEADER;
\copy ReservaGestionada FROM 'data/ReservaGestionada.csv' WITH CSV HEADER;
\copy Donacion FROM 'data/Donacion.csv' WITH CSV HEADER;

\echo 'Carga de datos completada.'
