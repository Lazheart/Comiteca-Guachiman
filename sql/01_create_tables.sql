CREATE TABLE Persona (
    DNI INTEGER,
    nombre VARCHAR(20),
    apellido VARCHAR(20),
    telefono INTEGER,
    correo VARCHAR(40)
);

CREATE TABLE Miembro (DNI INTEGER);
CREATE TABLE Visitante (DNI INTEGER);

CREATE TABLE Ponente (
    DNI INTEGER,
    taller VARCHAR(50),
    especialidad VARCHAR(20)
);

CREATE TABLE Institucion (
    id BIGINT,
    nombre VARCHAR(50),
    tipoInstitucion VARCHAR(50),
    direccion VARCHAR(200),
    telefono INTEGER,
    correo VARCHAR(20),
    representante VARCHAR(20),
    estado VARCHAR(10)
);

CREATE TABLE Empleado (
    DNI INTEGER,
    codEmpleado BIGINT,
    sueldo DECIMAL(5,2)
);

CREATE TABLE Piso (
    numeroDePiso INT,
    aforo INT
);

CREATE TABLE Zona (
    numeroDePiso INT,
    idZona VARCHAR(2),
    aforoZona INT
);


CREATE TABLE Seguridad (
    DNI INTEGER,
    arma VARCHAR(20),
    numeroDePiso INT,
    idZona VARCHAR(2)
);

CREATE TABLE Bibliotecario (
    DNI INTEGER,
    numeroDePiso INT,
    idZona VARCHAR(2)
);

CREATE TABLE SalaEstantes (
    numeroDePiso INT,
    idZona VARCHAR(2)
);

CREATE TABLE SalaLectura (
    numeroDePiso INT,
    idZona VARCHAR(2),
    numeroDeSillas INT
);

CREATE TABLE Administracion (
    numeroDePiso INT,
    idZona VARCHAR(2)
);

CREATE TABLE Material (
    id BIGINT,
    titulo VARCHAR(30),
    autor VARCHAR(20),
    genero VARCHAR(10),
    ilustracion VARCHAR(50),
    editorial VARCHAR(20),
    fechaPublicacion DATE,
    paisOrigen VARCHAR(10)
);

CREATE TABLE Novela (
    id BIGINT,
    narracion VARCHAR(20)
);

CREATE TABLE Comic (
    id BIGINT,
    tipoComic VARCHAR(20),
    serializacion VARCHAR(20)
);

CREATE TABLE Manga (
    id BIGINT
);

CREATE TABLE Ejemplar (
    material_id BIGINT,
    numeroCopia INT,
    estadoConservacion VARCHAR(20),
    disponibilidad VARCHAR(15)
);

CREATE TABLE Estante (
    numeroDePiso INT,
    idZona VARCHAR(2),
    idEstante INT,
    capacidad INT
);

CREATE TABLE Evento (
    id BIGINT,
    tema VARCHAR(100),
    fecha DATE,
    horaInicio TIME,
    horaFin TIME
);

CREATE TABLE Prestamo (
    id INT,
    miembro_DNI INTEGER,
    bibliotecario_DNI INTEGER,
    material_id BIGINT,
    numeroCopia INT,
    fechaPrestamo DATE,
    fechaLimite DATE,
    fechaDevolucion DATE,
    estado VARCHAR(20)
);

CREATE TABLE Sancion (
    idSancion INT,
    miembro_DNI INTEGER,
    bibliotecario_DNI INTEGER,
    motivo VARCHAR(200),
    fecha DATE
);

CREATE TABLE Asistencia (
    visitante_DNI INTEGER,
    evento_id BIGINT
);

CREATE TABLE Inscripcion (
    miembro_DNI INTEGER,
    evento_id BIGINT,
    fechaInscripcion DATE
);

CREATE TABLE Almacenamiento (
    numeroDePiso INT,
    idZona VARCHAR(2),
    idEstante INT,
    material_id BIGINT
);

CREATE TABLE Patrocinado (
    institucion_id BIGINT,
    evento_id BIGINT,
    montoPatrocinio DECIMAL(10,2)
);

CREATE TABLE ReservaGestionada (
    miembro_DNI INTEGER,
    bibliotecario_DNI INTEGER,
    material_id BIGINT,
    numeroCopia INT,
    fechaReserva DATE,
    estadoReserva VARCHAR(20)
);

CREATE TABLE Donacion (
    institucion_id BIGINT,
    bibliotecario_DNI INTEGER,
    material_id BIGINT,
    fechaDonacion DATE,
    cantidad INT
);

CREATE TABLE OrganizacionEvento (
    institucion_id BIGINT,
    evento_id BIGINT,
    ponente_DNI INTEGER
);

ALTER TABLE Persona ADD CONSTRAINT persona_pk PRIMARY KEY (DNI);
ALTER TABLE Miembro ADD CONSTRAINT miembro_pk PRIMARY KEY (DNI);
ALTER TABLE Visitante ADD CONSTRAINT visitante_pk PRIMARY KEY (DNI);
ALTER TABLE Ponente ADD CONSTRAINT ponente_pk PRIMARY KEY (DNI);
ALTER TABLE Institucion ADD CONSTRAINT institucion_pk PRIMARY KEY (id);
ALTER TABLE Empleado ADD CONSTRAINT empleado_pk PRIMARY KEY (DNI);
ALTER TABLE Piso ADD CONSTRAINT piso_pk PRIMARY KEY (numeroDePiso);
ALTER TABLE Zona ADD CONSTRAINT zona_pk PRIMARY KEY (numeroDePiso,idZona);
ALTER TABLE Seguridad ADD CONSTRAINT seguridad_pk PRIMARY KEY (DNI);
ALTER TABLE Bibliotecario ADD CONSTRAINT bibliotecario_pk PRIMARY KEY (DNI);
ALTER TABLE SalaEstantes ADD CONSTRAINT sala_estantes_pk PRIMARY KEY (numeroDePiso,idZona);
ALTER TABLE SalaLectura ADD CONSTRAINT sala_lectura_pk PRIMARY KEY (numeroDePiso,idZona);
ALTER TABLE Administracion ADD CONSTRAINT administracion_pk PRIMARY KEY (numeroDePiso,idZona);
ALTER TABLE Material ADD CONSTRAINT material_pk PRIMARY KEY (id);
ALTER TABLE Novela ADD CONSTRAINT novela_pk PRIMARY KEY (id);
ALTER TABLE Comic ADD CONSTRAINT comic_pk PRIMARY KEY (id);
ALTER TABLE Manga ADD CONSTRAINT manga_pk PRIMARY KEY (id);
ALTER TABLE Ejemplar ADD CONSTRAINT ejemplar_pk PRIMARY KEY (material_id,numeroCopia);
ALTER TABLE Estante ADD CONSTRAINT estante_pk PRIMARY KEY (numeroDePiso,idZona,idEstante);
ALTER TABLE Evento ADD CONSTRAINT evento_pk PRIMARY KEY (id);
ALTER TABLE Prestamo ADD CONSTRAINT prestamo_pk PRIMARY KEY (id);
ALTER TABLE Sancion ADD CONSTRAINT sancion_pk PRIMARY KEY (idSancion);
ALTER TABLE Asistencia ADD CONSTRAINT asistencia_pk PRIMARY KEY (visitante_dni,evento_id);
ALTER TABLE Inscripcion ADD CONSTRAINT inscripcion_pk PRIMARY KEY (miembro_dni,evento_id);
ALTER TABLE Almacenamiento ADD CONSTRAINT almacenamiento_pk PRIMARY KEY (numeroDePiso,idZona,idEstante,material_id);
ALTER TABLE Patrocinado ADD CONSTRAINT patrocinado_pk PRIMARY KEY (institucion_id,evento_id);
ALTER TABLE ReservaGestionada ADD CONSTRAINT reserva_pk PRIMARY KEY (miembro_dni,bibliotecario_dni,material_id,numeroCopia,fechaReserva);
ALTER TABLE Donacion ADD CONSTRAINT donacion_pk PRIMARY KEY (institucion_id,bibliotecario_dni,material_id,fechaDonacion);
ALTER TABLE OrganizacionEvento ADD CONSTRAINT organizacion_pk PRIMARY KEY (institucion_id,evento_id,ponente_dni);

-- FOREIGN KEYS

ALTER TABLE Miembro ADD CONSTRAINT miembro_persona_fk FOREIGN KEY (DNI) REFERENCES Persona(DNI);
ALTER TABLE Visitante ADD CONSTRAINT visitante_persona_fk FOREIGN KEY (DNI) REFERENCES Persona(DNI);
ALTER TABLE Ponente ADD CONSTRAINT ponente_persona_fk FOREIGN KEY (DNI) REFERENCES Persona(DNI);
ALTER TABLE Empleado ADD CONSTRAINT empleado_persona_fk FOREIGN KEY (DNI) REFERENCES Persona(DNI);

ALTER TABLE Zona ADD CONSTRAINT zona_piso_fk FOREIGN KEY (numeroDePiso) REFERENCES Piso(numeroDePiso);

ALTER TABLE Seguridad ADD CONSTRAINT seguridad_empleado_fk FOREIGN KEY (DNI) REFERENCES Empleado(DNI);
ALTER TABLE Seguridad ADD CONSTRAINT seguridad_zona_fk FOREIGN KEY (numeroDePiso,idZona) REFERENCES Zona(numeroDePiso,idZona);

ALTER TABLE Bibliotecario ADD CONSTRAINT bibliotecario_empleado_fk FOREIGN KEY (DNI) REFERENCES Empleado(DNI);
ALTER TABLE Bibliotecario ADD CONSTRAINT bibliotecario_zona_fk FOREIGN KEY (numeroDePiso,idZona) REFERENCES Zona(numeroDePiso,idZona);

ALTER TABLE SalaEstantes ADD CONSTRAINT sala_estantes_zona_fk FOREIGN KEY (numeroDePiso,idZona) REFERENCES Zona(numeroDePiso,idZona);
ALTER TABLE SalaLectura ADD CONSTRAINT sala_lectura_zona_fk FOREIGN KEY (numeroDePiso,idZona) REFERENCES Zona(numeroDePiso,idZona);
ALTER TABLE Administracion ADD CONSTRAINT administracion_zona_fk FOREIGN KEY (numeroDePiso,idZona) REFERENCES Zona(numeroDePiso,idZona);

ALTER TABLE Novela ADD CONSTRAINT novela_material_fk FOREIGN KEY (id) REFERENCES Material(id);
ALTER TABLE Comic ADD CONSTRAINT comic_material_fk FOREIGN KEY (id) REFERENCES Material(id);
ALTER TABLE Manga ADD CONSTRAINT manga_material_fk FOREIGN KEY (id) REFERENCES Material(id);

ALTER TABLE Ejemplar ADD CONSTRAINT ejemplar_material_fk FOREIGN KEY (material_id) REFERENCES Material(id);

ALTER TABLE Estante ADD CONSTRAINT estante_zona_fk FOREIGN KEY (numeroDePiso,idZona) REFERENCES SalaEstantes(numeroDePiso,idZona);

ALTER TABLE Prestamo ADD CONSTRAINT prestamo_miembro_fk FOREIGN KEY (miembro_dni) REFERENCES Miembro(DNI);
ALTER TABLE Prestamo ADD CONSTRAINT prestamo_bibliotecario_fk FOREIGN KEY (bibliotecario_dni) REFERENCES Bibliotecario(DNI);
ALTER TABLE Prestamo ADD CONSTRAINT prestamo_ejemplar_fk FOREIGN KEY (material_id,numeroCopia) REFERENCES Ejemplar(material_id,numeroCopia);

ALTER TABLE Sancion ADD CONSTRAINT sancion_miembro_fk FOREIGN KEY (miembro_dni) REFERENCES Miembro(DNI);
ALTER TABLE Sancion ADD CONSTRAINT sancion_bibliotecario_fk FOREIGN KEY (bibliotecario_dni) REFERENCES Bibliotecario(DNI);

ALTER TABLE Asistencia ADD CONSTRAINT asistencia_visitante_fk FOREIGN KEY (visitante_dni) REFERENCES Visitante(DNI);
ALTER TABLE Asistencia ADD CONSTRAINT asistencia_evento_fk FOREIGN KEY (evento_id) REFERENCES Evento(id);

ALTER TABLE Inscripcion ADD CONSTRAINT inscripcion_miembro_fk FOREIGN KEY (miembro_dni) REFERENCES Miembro(DNI);
ALTER TABLE Inscripcion ADD CONSTRAINT inscripcion_evento_fk FOREIGN KEY (evento_id) REFERENCES Evento(id);

ALTER TABLE Almacenamiento ADD CONSTRAINT almacenamiento_estante_fk FOREIGN KEY (numeroDePiso,idZona,idEstante) REFERENCES Estante(numeroDePiso,idZona,idEstante);
ALTER TABLE Almacenamiento ADD CONSTRAINT almacenamiento_material_fk FOREIGN KEY (material_id) REFERENCES Material(id);

ALTER TABLE Patrocinado ADD CONSTRAINT patrocinado_institucion_fk FOREIGN KEY (institucion_id) REFERENCES Institucion(id);
ALTER TABLE Patrocinado ADD CONSTRAINT patrocinado_evento_fk FOREIGN KEY (evento_id) REFERENCES Evento(id);

ALTER TABLE ReservaGestionada ADD CONSTRAINT reserva_miembro_fk FOREIGN KEY (miembro_dni) REFERENCES Miembro(DNI);
ALTER TABLE ReservaGestionada ADD CONSTRAINT reserva_bibliotecario_fk FOREIGN KEY (bibliotecario_dni) REFERENCES Bibliotecario(DNI);
ALTER TABLE ReservaGestionada ADD CONSTRAINT reserva_ejemplar_fk FOREIGN KEY (material_id,numeroCopia) REFERENCES Ejemplar(material_id,numeroCopia);

ALTER TABLE Donacion ADD CONSTRAINT donacion_institucion_fk FOREIGN KEY (institucion_id) REFERENCES Institucion(id);
ALTER TABLE Donacion ADD CONSTRAINT donacion_bibliotecario_fk FOREIGN KEY (bibliotecario_dni) REFERENCES Bibliotecario(DNI);
ALTER TABLE Donacion ADD CONSTRAINT donacion_material_fk FOREIGN KEY (material_id) REFERENCES Material(id);

ALTER TABLE OrganizacionEvento ADD CONSTRAINT organizacion_institucion_fk FOREIGN KEY (institucion_id) REFERENCES Institucion(id);
ALTER TABLE OrganizacionEvento ADD CONSTRAINT organizacion_evento_fk FOREIGN KEY (evento_id) REFERENCES Evento(id);
ALTER TABLE OrganizacionEvento ADD CONSTRAINT organizacion_ponente_fk FOREIGN KEY (ponente_dni) REFERENCES Ponente(DNI);
