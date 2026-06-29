-- Para pruebas sin indices, ejecutar antes de correr y despues de haber activado con 00_indexes
DROP INDEX IF EXISTS idx_prestamo_bibliotecario;
DROP INDEX IF EXISTS idx_prestamo_material;
DROP INDEX IF EXISTS idx_almacenamiento_material;
DROP INDEX IF EXISTS idx_bibliotecario_zona;

DROP INDEX IF EXISTS idx_prestamo_ejemplar;
DROP INDEX IF EXISTS idx_material_genero;
DROP INDEX IF EXISTS idx_material_genero_titulo;

DROP INDEX IF EXISTS idx_prestamo_miembro;
DROP INDEX IF EXISTS idx_sancion_miembro;
DROP INDEX IF EXISTS idx_prestamo_fechas;
DROP INDEX IF EXISTS idx_prestamo_estado;

DROP INDEX IF EXISTS idx_almacenamiento_ubicacion;
DROP INDEX IF EXISTS idx_ejemplar_disponibilidad;
DROP INDEX IF EXISTS idx_material_titulo;