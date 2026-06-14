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