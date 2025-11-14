use pet_me;
-- REGISTROS PARA DB PET_ME

-- TABLA USUARIO
INSERT INTO usuario (nombre, apellido, email, username, password, telefono, estado, ciudad, foto_perfil, fecha_registro, activo) VALUES
('Carlos', 'Ramírez', 'carlos.ramirez@example.com', 'carlosr', 'pass123', '5551001001', 'CDMX', 'Benito Juárez', 'carlos.jpg', NOW(), 1),
('María', 'González', 'maria.gonzalez@example.com', 'mariag', 'secure456', '5551001002', 'CDMX', 'Coyoacán', 'maria.jpg', NOW(), 1),
('Luis', 'Fernández', 'luis.fernandez@example.com', 'luisf', 'clave789', '5551001003', 'CDMX', 'Miguel Hidalgo', 'luis.jpg', NOW(), 1),
('Ana', 'Martínez', 'ana.martinez@example.com', 'anam', 'contraseña321', '5551001004', 'CDMX', 'Tlalpan', 'ana.jpg', NOW(), 1),
('Jorge', 'López', 'jorge.lopez@example.com', 'jorgel', 'pass999', '5551001005', 'CDMX', 'Iztapalapa', 'jorge.jpg', NOW(), 1);

SELECT * FROM usuario;
-- REGISTROS MASCOTAS
DESCRIBE mascotas;
INSERT INTO mascotas (nombre_mascota, especie, edad, tamaño, sexo, descripcion, foto_principal, estado_adopcion, fecha_publicacion, fecha_actualizacion, usuario_id_usuario) VALUES
('Max', 'perro', 3, 'mediano', 'macho', 'Juguetón y amigable', 'max.jpg', 'disponible', NOW(), NOW(), 1),
('Luna', 'gato', 2, 'pequeño', 'hembra', 'Tranquila y cariñosa', 'luna.jpg', 'disponible', NOW(), NOW(), 2),
('Rocky', 'perro', 4, 'grande', 'macho', 'Protector y enérgico', 'rocky.jpg', 'en_proceso', NOW(), NOW(), 3),
('Mia', 'gato', 1, 'mediano', 'hembra', 'Curiosa y juguetona', 'mia.jpg', 'adoptado', NOW(), NOW(), 4),
('Simba', 'perro', 5, 'grande', 'macho', 'Leal y tranquilo', 'simba.jpg', 'disponible', NOW(), NOW(), 5);

SELECT * FROM mascotas;

-- TABLA FOTOS_MASCOTAS
DESCRIBE fotos_mascotas;
INSERT INTO fotos_mascotas (url_foto, orden, fecha_subida, mascotas_id_mascotas, mascotas_usuario_id_usuario) VALUES
('max1.jpg', 1, NOW(), 1, 1),
('luna1.jpg', 1, NOW(), 2, 2),
('rocky1.jpg', 1, NOW(), 3, 3),
('mia1.jpg', 1, NOW(), 4, 4),
('simba1.jpg', 1, NOW(), 5, 5);

SELECT * FROM fotos_mascotas;

-- TABLA NOTIFICACIONES
DESCRIBE notificaciones;
INSERT INTO notificaciones (tipo, titulo, contenido, leida, url_relacionada, fecha_creacion, usuario_id_usuario) VALUES
('sistema', 'Bienvenido', 'Gracias por registrarte en nuestra plataforma', 0, '/inicio', NOW(), 1),
('adopcion', 'Solicitud recibida', 'Tu mascota Max tiene una nueva solicitud', 0, '/adopciones', NOW(), 1),
('mensaje', 'Nuevo mensaje', 'Has recibido un mensaje de María', 1, '/mensajes', NOW(), 2),
('sistema', 'Actualización de perfil', 'Tu perfil ha sido actualizado correctamente', 0, '/perfil', NOW(), 3),
('adopcion', 'Adopción completada', 'Mia ha sido adoptada con éxito', 1, '/mascotas/4', NOW(), 4);

SELECT * FROM notificaciones;

-- TABLA FAVORITOS
DESCRIBE favoritos;
INSERT INTO favoritos (id_favoritos, fecha_agregado) VALUES
(1, NOW()),
(2, NOW()),
(3, NOW()),
(4, NOW()),
(5, NOW());

SELECT * FROM favoritos;


-- TABLA ADOPCIONES
DESCRIBE adopciones;

INSERT INTO adopciones (fecha_solicitud, fecha_aprobacion, estado, comentarios, fk_mascotas, fk_publicador_mascotas, fk_usuario_adoptante) VALUES
(NOW(), NOW(), 'aprobada', 'Max ha sido adoptado por María', 1, 1, 2),
(NOW(), NOW(), 'pendiente', 'Solicitud en revisión para Luna', 2, 2, 1),
(NOW(), NOW(), 'rechazada', 'Rocky no está disponible actualmente', 3, 3, 5),
(NOW(), NOW(), 'completada', 'Mia encontró un hogar', 4, 4, 3),
(NOW(), NOW(), 'pendiente', 'Simba está en proceso de adopción', 5, 5, 4);
SELECT * FROM adopciones;

-- TABLA PUBLICACIONES
DESCRIBE publicaciones;
INSERT INTO publicaciones (id_publicaciones, titulo_publicaciones, tipo, fecha_publicacion, likes, usuario_id_usuario, mascotas_id_mascotas, mascotas_usuario_id_usuario) VALUES
(1, 'Max busca familia', 'adopcion', NOW(), 10, 1, 1, 1),
(2, 'Luna y su ternura', 'historia', NOW(), 8, 2, 2, 2),
(3, 'Consejos para adoptar', 'consejo', NOW(), 15, 3, 3, 3),
(4, 'Mia fue adoptada', 'historia', NOW(), 12, 4, 4, 4),
(5, 'Simba necesita hogar', 'adopcion', NOW(), 5, 5, 5, 5);

SELECT * FROM publicaciones;

-- TABLA MENSAJES
DESCRIBE mensajes;
INSERT INTO mensajes (mensaje, leido, fecha_envio) VALUES
('Hola, estoy interesado en Max', 0, CURDATE()),
('¿Luna sigue disponible?', 1, CURDATE()),
('Gracias por aceptar mi solicitud', 0, CURDATE()),
('Quiero conocer a Simba', 0, CURDATE()),
('Me encantó la historia de Mia', 1, CURDATE());

SELECT * FROM mensajes;

-- TABLE MENSAJES_HAS_USUARIO 
DESCRIBE mensajes_has_usuario;

INSERT INTO mensajes_has_usuario (fk_remitente, fk_destinatario) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

SELECT * FROM mensajes_has_usuario;

-- TABLA FAVORITOS_HAS_MASCOTAS
DESCRIBE favoritos_has_mascotas;
INSERT INTO favoritos_has_mascotas (favoritos_id_favoritos, mascotas_id_mascotas, mascotas_usuario_id_usuario) VALUES
(1, 2, 2),
(2, 1, 1),
(3, 5, 5),
(4, 3, 3),
(5, 4, 4);

SELECT * FROM favoritos_has_mascotas;

-- TABLA FAVORITOS_HAS_USUARIO
DESCRIBE favoritos_has_usuario;
INSERT INTO favoritos_has_usuario (favoritos_id_favoritos, usuario_id_usuario) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);
SELECT * FROM favoritos_has_usuario;