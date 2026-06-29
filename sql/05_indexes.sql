-- 1. Para Auditoría de Seguridad Espacial

-- Índice para JOIN entre Prestamo y Bibliotecario  
CREATE INDEX idx_prestamo_bibliotecario ON Prestamo(bibliotecario_DNI);  
  
-- Índice para JOIN entre Prestamo y Almacenamiento  
CREATE INDEX idx_prestamo_material ON Prestamo(material_id);  
  
-- Índice para búsqueda en Almacenamiento  
CREATE INDEX idx_almacenamiento_material ON Almacenamiento(material_id);  
  
-- Índice compuesto para Bibliotecario (ya cubierto por PK pero útil para zona)  
CREATE INDEX idx_bibliotecario_zona ON Bibliotecario(DNI, idZona);




-- 2. Para Reporte Analítico de Popularidad por Género

-- Índice para JOIN entre Prestamo y Ejemplar  
CREATE INDEX idx_prestamo_ejemplar ON Prestamo(material_id, numeroCopia);  
  
-- Índice para agrupación por género en Material  
CREATE INDEX idx_material_genero ON Material(genero);  
  
-- Índice compuesto para optimizar el GROUP BY  
CREATE INDEX idx_material_genero_titulo ON Material(genero, titulo);


-- 3. Para Control de Morosidad Histórica
-- Índice para JOIN entre Miembro y Prestamo  
CREATE INDEX idx_prestamo_miembro ON Prestamo(miembro_DNI);  
  
-- Índice para LEFT JOIN con Sancion  
CREATE INDEX idx_sancion_miembro ON Sancion(miembro_DNI);  
  
-- Índices para cálculos de fechas en Prestamo  
CREATE INDEX idx_prestamo_fechas ON Prestamo(fechaDevolucion, fechaLimite);  
  
-- Índice para filtrado por estado  
CREATE INDEX idx_prestamo_estado ON Prestamo(estado);


-- Índices Generales Adicionales
-- Índice para Almacenamiento (ubicación física)  
CREATE INDEX idx_almacenamiento_ubicacion ON Almacenamiento(numeroDePiso, idZona, idEstante);  
  
-- Índice para Ejemplar (disponibilidad)  
CREATE INDEX idx_ejemplar_disponibilidad ON Ejemplar(disponibilidad);  
  
-- Índice para Material (título)  
CREATE INDEX idx_material_titulo ON Material(titulo);