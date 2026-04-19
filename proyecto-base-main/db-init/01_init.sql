CREATE DATABASE IF NOT EXISTS BD11_TRAMITACION;
CREATE DATABASE IF NOT EXISTS BD11_VALIDACIONES;

USE BD11_TRAMITACION;

CREATE TABLE IF NOT EXISTS solicitante (
    rut     VARCHAR(15)  PRIMARY KEY,
    nombre  VARCHAR(100),
    correo  VARCHAR(100)
);

INSERT IGNORE INTO solicitante (rut, nombre, correo) VALUES
    ('20.798.317-9', 'Chayanne Campos',   'chayCampos@gmail.com'),
    ('20.075.943-5', 'Al Goritmo Perez',  'algoco@gmail.com');

USE BD11_VALIDACIONES;

CREATE TABLE IF NOT EXISTS user (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50),
    lastname  VARCHAR(50),
    email     VARCHAR(50)
);
