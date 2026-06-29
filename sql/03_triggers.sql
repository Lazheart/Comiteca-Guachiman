-- Enlazamiento de tri

-- 1. Verificacion si el ejemplar ya fue prestado
CREATE OR REPLACE FUNCTION fn_validar_prestamo_antes_insertar()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM Ejemplar 
        WHERE material_id = NEW.material_id 
          AND numeroCopia = NEW.numeroCopia 
          AND disponibilidad = 'Disponible'
    ) THEN
        RAISE EXCEPTION 'Operación cancelada: El ejemplar no se encuentra disponible.';
    END IF;

    IF EXISTS (
        SELECT 1 FROM Sancion 
        WHERE miembro_DNI = NEW.miembro_DNI
    ) THEN
        RAISE EXCEPTION 'Operación cancelada: El miembro cuenta con sanciones activas en el sistema.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_prestamo_antes_insertar
BEFORE INSERT ON Prestamo
FOR EACH ROW
EXECUTE FUNCTION fn_validar_prestamo_antes_insertar();

-- 2. Cambia el estado del ejemplar a Prestado
CREATE OR REPLACE FUNCTION fn_actualizar_ejemplar_prestado()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE Ejemplar
    SET disponibilidad = 'Prestado'
    WHERE material_id = NEW.material_id 
      AND numeroCopia = NEW.numeroCopia;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_ejemplar_prestado
AFTER INSERT ON Prestamo
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_ejemplar_prestado();

-- 3. Cambio de estado a Disponible despues de regresar el ejemplar 
CREATE OR REPLACE FUNCTION fn_actualizar_ejemplar_devuelto()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fechaDevolucion IS NOT NULL AND OLD.fechaDevolucion IS NULL THEN
        UPDATE Ejemplar
        SET disponibilidad = 'Disponible'
        WHERE material_id = NEW.material_id 
          AND numeroCopia = NEW.numeroCopia;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_ejemplar_devuelto
AFTER UPDATE ON Prestamo
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_ejemplar_devuelto();

-- 4. Generacion de sanciones
CREATE OR REPLACE FUNCTION fn_generar_sancion_automatica()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fechaDevolucion IS NOT NULL AND OLD.fechaDevolucion IS NULL THEN
        IF NEW.fechaDevolucion > NEW.fechaLimite THEN
            INSERT INTO Sancion (idSancion, miembro_DNI, bibliotecario_DNI, motivo, fecha)
            VALUES (
                (SELECT COALESCE(MAX(idSancion), 0) + 1 FROM Sancion), -- Genera ID autoincremental simple
                NEW.miembro_DNI, 
                NEW.bibliotecario_DNI, 
                'Retraso en devolución: El ejemplar fue entregado fuera de la fecha límite.', 
                CURRENT_DATE
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_sancion_automatica
AFTER UPDATE ON Prestamo
FOR EACH ROW
EXECUTE FUNCTION fn_generar_sancion_automatica();

-- 5. Control de capacidad del estante 
CREATE OR REPLACE FUNCTION fn_verificar_capacidad_estante()
RETURNS TRIGGER AS $$
DECLARE
    v_capacidad_max INT;
    v_total_actual INT;
BEGIN
    SELECT capacidad INTO v_capacidad_max 
    FROM Estante 
    WHERE numeroDePiso = NEW.numeroDePiso 
      AND idZona = NEW.idZona 
      AND idEstante = NEW.idEstante;

    SELECT COUNT(*) INTO v_total_actual 
    FROM Almacenamiento
    WHERE numeroDePiso = NEW.numeroDePiso 
      AND idZona = NEW.idZona 
      AND idEstante = NEW.idEstante;

    IF v_total_actual >= v_capacidad_max THEN
        RAISE EXCEPTION 'Operación cancelada: El estante seleccionado ha alcanzado su capacidad máxima física.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_verificar_capacidad_estante
BEFORE INSERT ON Almacenamiento
FOR EACH ROW
EXECUTE FUNCTION fn_verificar_capacidad_estante();

-- 6. Control para el aforo por evento
CREATE OR REPLACE FUNCTION fn_control_aforo_evento()
RETURNS TRIGGER AS $$
DECLARE
    v_aforo_max INT;
    v_inscritos_actuales INT;
BEGIN
    -- Asegúrate de haber agregado numeroDePiso e idZona a la tabla Evento primero
    SELECT z.aforoZona INTO v_aforo_max
    FROM Evento e
    JOIN Zona z ON e.numeroDePiso = z.numeroDePiso AND e.idZona = z.idZona
    WHERE e.id = NEW.evento_id;

    SELECT COUNT(*) INTO v_inscritos_actuales 
    FROM Inscripcion 
    WHERE evento_id = NEW.evento_id;

    IF v_inscritos_actuales >= v_aforo_max THEN
        RAISE EXCEPTION 'Operación cancelada: No quedan cupos disponibles, la zona del evento se encuentra al límite de su aforo.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_control_aforo_evento
BEFORE INSERT ON Inscripcion
FOR EACH ROW
EXECUTE FUNCTION fn_control_aforo_evento();