const express = require('express');
const router = new express.Router();
const index = require('../controllers/index');

// --- Endpoints ---
router.get('/', (req, res) => res.json({ message: 'Probando... La prueba de API_Validaciones fue un éxito!' }));

router.get('/createTable', index.createTable);

module.exports = router;