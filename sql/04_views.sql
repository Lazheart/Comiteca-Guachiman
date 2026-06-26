-- 1. Inventario detallado
CREATE VIEW vista_inventario_completo AS
SELECT m.titulo, m.autor, e.numeroCopia, e.estadoConservacion, e.disponibilidad, 
       a.numeroDePiso, a.idZona, a.idEstante
FROM Material m
JOIN Ejemplar e ON m.id = e.material_id
JOIN Almacenamiento a ON m.id = a.material_id;

-- 2. Estados de los miembros 
CREATE VIEW vista_estado_miembros AS
SELECT p.nombre, p.apellido, s.motivo, s.fecha as fecha_sancion
FROM Persona p
JOIN Miembro m ON p.DNI = m.DNI
LEFT JOIN Sancion s ON m.DNI = s.miembro_DNI;

-- 3. Registro de patrocinios (Donaciones)
CREATE VIEW vista_auditoria_donaciones AS
SELECT 
    inst.nombre AS institucion_donante,
    m.titulo AS material_recibido,
    d.fechaDonacion,
    d.cantidad AS ejemplares_donados,
    p_bib.nombre || ' ' || p_bib.apellido AS bibliotecario_receptor
FROM Donacion d
JOIN Institucion inst ON d.institucion_id = inst.id
JOIN Material m ON d.material_id = m.id
JOIN Persona p_bib ON d.bibliotecario_DNI = p_bib.DNI;

-- 4. Vista de estado de prestamos 
CREATE VIEW vista_prestamos_alertas AS
SELECT 
    p.id AS id_prestamo,
    per.nombre || ' ' || per.apellido AS miembro_nombre,
    m.titulo AS titulo_material,
    p.fechaPrestamo,
    p.fechaLimite,
    p.fechaDevolucion,
    p.estado AS estado_registro,
    CASE 
        WHEN p.fechaDevolucion IS NULL AND p.fechaLimite < CURRENT_DATE THEN 'ALERTA: VENCIDO'
        WHEN p.fechaDevolucion IS NULL THEN 'EN CURSO: ACTIVO'
        ELSE 'FINALIZADO: DEVUELTO'
    END AS estado_tiempo_real
FROM Prestamo p
JOIN Persona per ON p.miembro_DNI = per.DNI
JOIN Material m ON p.material_id = m.id;

-- 5. Tipo de materiales 
CREATE VIEW vista_catalogo_especializado AS
SELECT 
    m.id AS material_id,
    m.titulo,
    m.autor,
    m.editorial,
    CASE 
        WHEN c.id IS NOT NULL THEN 'Cómic'
        WHEN ma.id IS NOT NULL THEN 'Manga'
        WHEN n.id IS NOT NULL THEN 'Novela Gráfica'
        ELSE 'General'
    END AS tipo_formato,
    COALESCE(c.tipoComic, 'N/A') AS tipo_comic,
    COALESCE(c.serializacion, 'N/A') AS serializacion,
    COALESCE(n.narracion, 'N/A') AS tipo_narracion
FROM Material m
LEFT JOIN Comic c ON m.id = c.id
LEFT JOIN Manga ma ON m.id = ma.id
LEFT JOIN Novela n ON m.id = n.id;

-- 6. Ocupacion de los estantes 
CREATE VIEW vista_capacidad_estantes AS
SELECT 
    e.numeroDePiso,
    e.idZona,
    e.idEstante,
    e.capacidad AS capacidad_maxima,
    COUNT(a.material_id) AS volumen_actual,
    (e.capacidad - COUNT(a.material_id)) AS espacios_disponibles
FROM Estante e
LEFT JOIN Almacenamiento a 
    ON e.numeroDePiso = a.numeroDePiso 
   AND e.idZona = a.idZona 
   AND e.idEstante = a.idEstante
GROUP BY e.numeroDePiso, e.idZona, e.idEstante, e.capacidad;