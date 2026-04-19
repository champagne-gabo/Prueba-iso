const database = require('../db');

const createTable = (req, res) => {
    const createQuery = `
        CREATE TABLE IF NOT EXISTS solicitante (
            rut VARCHAR(15) PRIMARY KEY,
            nombre VARCHAR(100),
            correo VARCHAR(100)
        );
    `;

    const insertQuery = `
        INSERT IGNORE INTO solicitante (rut, nombre, correo) VALUES
        ('20.798.317-9', 'Chayanne Campos', 'chayCampos@gmail.com'),
        ('20.075.943-5', 'Al Goritmo Perez', 'algoco@gmail.com');
    `;

    database.query(createQuery, (err) => {
        if (err) {
            console.error('Error creando la tabla:', err);
            return res.status(500).send('Error al crear la tabla');
        }

        database.query(insertQuery, (err2) => {
            if (err2) {
                console.error('Error insertando datos:', err2);
                return res.status(500).send('Error insertando los datos');
            }

            res.send('Tabla creada con 2 solicitantes por defecto');
        });
    });
};

const leer = (req, res) => {
    const leerQuery = `
        SELECT * FROM solicitante;
    `;

    database.query(leerQuery, (err, results) => {
        if (err) {
            console.error('Error leyendo la tabla:', err);
            return res.status(500).send('Error al leer la tabla');
        }
        res.json(results);
    });
};

module.exports = { createTable, leer };
