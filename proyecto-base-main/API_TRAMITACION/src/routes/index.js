const express = require('express');
const router = new express.Router();
const index = require('../controllers/index');

// --- Endpoints ---
router.get('/', (req, res) => res.json({ message: 'Probando... La prueba de API_Tramitacion fue un éxito!' }));

router.get('/createTable', index.createTable);
router.get('/leerTabla', index.leer);

module.exports = router;