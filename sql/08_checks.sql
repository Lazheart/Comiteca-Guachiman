--Checks
ALTER TABLE Persona ADD CONSTRAINT chk_telefono_formato 
CHECK (telefono ~ '^[0-9]{9}$');

-- Validar sueldo del empleado
ALTER TABLE Empleado ADD CONSTRAINT chk_sueldo_positivo 
CHECK (sueldo > 0);

-- la devolución no puede ser antes del préstamo
ALTER TABLE Prestamo ADD CONSTRAINT chk_fechas_prestamo 
CHECK (fechaDevolucion >= fechaPrestamo OR fechaDevolucion IS NULL);

-- Validar aforo en Zonas 
ALTER TABLE Zona ADD CONSTRAINT chk_aforo_positivo 
CHECK (aforoZona > 0);

-- validacion de tiempo de evento
ALTER TABLE Evento ADD CONSTRAINT chk_horario_evento 
CHECK (horaFin > horaInicio);

-- verificcacion de fecha de publicacion
ALTER TABLE Material ADD CONSTRAINT chk_fecha_publicacion 
CHECK (fechaPublicacion <= CURRENT_DATE);

-- escriba bien señora !
ALTER TABLE Ejemplar ADD CONSTRAINT chk_disponibilidad_ejemplar 
CHECK (disponibilidad IN ('Disponible', 'Prestado', 'Mantenimiento', 'Perdido'));

-- a chistoso
ALTER TABLE Donacion ADD CONSTRAINT chk_cantidad_donacion_valida 
CHECK (cantidad > 0);