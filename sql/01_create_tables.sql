CREATE TABLE Persona (
    DNI INTEGER,
    nombre VARCHAR(20),
    apellido VARCHAR(20),
    telefono VARCHAR(9),
    correo VARCHAR(100)
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
    telefono VARCHAR(9),
    correo VARCHAR(100),
    representante VARCHAR(20),
    estado VARCHAR(10)
);

CREATE TABLE Empleado (
    DNI INTEGER,
    codEmpleado BIGINT,
    sueldo DECIMAL(10,2)
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
