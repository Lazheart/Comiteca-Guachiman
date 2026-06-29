-- querys
--- 1. Auditoría de Seguridad Espacial (El "Ejemplar Fantasma")
--- Sirve para detectar una anomalía operativa crítica: contrastar la tabla Prestamo
--- con Almacenamiento, Estante y Bibliotecario para aislar los registros donde un
--- encargado procesó la salida de un cómic que físicamente pertenece a una zona ajena a su jurisdicción.
WITH DetallePrestamo AS (
    SELECT 
        p.id AS prestamo_id,
        p.bibliotecario_DNI,
        p.material_id,
        b.idZona AS zona_asignada
    FROM Prestamo p
    INNER JOIN Bibliotecario b ON p.bibliotecario_DNI = b.DNI
),
UbicacionMaterial AS (
    SELECT 
        a.material_id,
        a.idZona AS zona_fisica,
        a.idEstante
    FROM Almacenamiento a
)
SELECT 
    dp.prestamo_id,
    dp.bibliotecario_DNI,
    dp.zona_asignada,
    um.zona_fisica,
    um.idEstante,
    dp.material_id
FROM DetallePrestamo dp
INNER JOIN UbicacionMaterial um ON dp.material_id = um.material_id
WHERE dp.zona_asignada <> um.zona_fisica;

--- 2. Reporte Analítico de Popularidad por Género
--- Requerimos generar reportes analíticos de los materiales más solicitados utilizando funciones agregadas.
--- Esta consulta utiliza la función ventana RANK() para calcular cuáles son los títulos más prestados de la Comicteca,
--- segmentados por su género literario, mostrando solo el "Top 3" de cada categoría.
WITH ConteoPrestamos AS (
    SELECT 
        m.genero,
        m.titulo,
        COUNT(p.id) AS total_prestamos
    FROM Prestamo p
    INNER JOIN Ejemplar e ON p.material_id = e.material_id AND p.numeroCopia = e.numeroCopia
    INNER JOIN Material m ON e.material_id = m.id
    GROUP BY m.genero, m.titulo
),
RankingGeneros AS (
    SELECT 
        genero,
        titulo,
        total_prestamos,
        RANK() OVER(PARTITION BY genero ORDER BY total_prestamos DESC) as ranking
    FROM ConteoPrestamos
)
SELECT 
    genero,
    ranking,
    titulo,
    total_prestamos
FROM RankingGeneros
WHERE ranking <= 3
ORDER BY genero ASC, ranking ASC;

--- 3. Control de Morosidad Histórica y Sanciones Vigentes
--- Dado que el sistema debe manejar el estado de los préstamos (Vigente, Devuelto, Demorado) y registrar penalizaciones,
--- esta consulta cruza el historial de los miembros para identificar a los usuarios más problemáticos.
--- Calcula la cantidad total de días de retraso acumulados en toda su historia y cuenta cuántas sanciones formales 
--- han recibido.
SELECT 
    per.nombre,
    per.apellido,
    m.DNI,
    COUNT(DISTINCT s.idSancion) AS cantidad_sanciones,
    SUM(
        CASE 
            WHEN p.fechaDevolucion > p.fechaLimite THEN (p.fechaDevolucion - p.fechaLimite)
            WHEN p.fechaDevolucion IS NULL AND CURRENT_DATE > p.fechaLimite THEN (CURRENT_DATE - p.fechaLimite)
            ELSE 0 
        END
    ) AS dias_retraso_acumulados
FROM Miembro m
INNER JOIN Persona per ON m.DNI = per.DNI
LEFT JOIN Prestamo p ON m.DNI = p.miembro_DNI
LEFT JOIN Sancion s ON m.DNI = s.miembro_DNI
GROUP BY m.DNI, per.nombre, per.apellido
HAVING COUNT(DISTINCT s.idSancion) > 0 OR 
       SUM(CASE WHEN p.fechaDevolucion > p.fechaLimite THEN 1 ELSE 0 END) > 0
ORDER BY dias_retraso_acumulados DESC;


--- 4. Análisis de Rentabilidad y Deserción en Eventos (El "ROI Wachiman")
--- Evalúa el éxito de los eventos organizados por la Comicteca cruzando los fondos
--- recibidos por patrocinios, la expectativa (inscritos) y la realidad (asistentes).
--- Calcula la tasa de "No-Show" (deserción) para medir el verdadero impacto.
WITH TotalInscritos AS (
    SELECT 
        evento_id, 
        COUNT(miembro_DNI) AS inscritos
    FROM Inscripcion
    GROUP BY evento_id
),
TotalAsistentes AS (
    SELECT 
        evento_id, 
        COUNT(visitante_DNI) AS asistentes
    FROM Asistencia
    GROUP BY evento_id
),
TotalPatrocinio AS (
    SELECT 
        evento_id, 
        SUM(montoPatrocinio) AS presupuesto_total
    FROM Patrocinado
    GROUP BY evento_id
)
SELECT 
    e.id AS evento_id,
    e.tema,
    e.fecha,
    COALESCE(tp.presupuesto_total, 0.00) AS total_recaudado,
    COALESCE(ti.inscritos, 0) AS total_inscritos,
    COALESCE(ta.asistentes, 0) AS total_asistentes,
    -- Calculamos el porcentaje de gente que se inscribió pero no fue
    CASE 
        WHEN COALESCE(ti.inscritos, 0) = 0 THEN 0
        ELSE ROUND(((COALESCE(ti.inscritos, 0) - COALESCE(ta.asistentes, 0))::NUMERIC / ti.inscritos) * 100, 2)
    END AS porcentaje_desercion
FROM Evento e
LEFT JOIN TotalInscritos ti ON e.id = ti.evento_id
LEFT JOIN TotalAsistentes ta ON e.id = ta.evento_id
LEFT JOIN TotalPatrocinio tp ON e.id = tp.evento_id
ORDER BY porcentaje_desercion DESC, total_recaudado DESC;
