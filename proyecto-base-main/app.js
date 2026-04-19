const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const INTEREST_RATE = 0.06;
const SEGUROS_TASAS = { degravamen: 0.0004, cesantia: 0.0003 };

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('public/templates', express.static(path.join(__dirname, 'public/templates')));

app.use(session({
    secret: 'clave',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/templates'));

// --- Rutas: Sesión ---
app.post('/guardar_rut', (req, res) => {
    const { rut } = req.body;
    if (rut) {
        req.session.rut = rut;
        console.log(`RUT guardado: ${rut}`);
        return res.sendStatus(204);
    }
    return res.status(400).send('No se recibió RUT');
});

app.post('/guardar_nombre', (req, res) => {
    const { nombre, apellido } = req.body;
    if (nombre) {
        req.session.nombre = nombre;
        if (apellido) req.session.apellido = apellido;
        console.log(`Nombre guardado: ${nombre}${apellido ? ' ' + apellido : ''}`);
        return res.sendStatus(204);
    }
    return res.status(400).send('No se recibió nombre');
});

// --- Rutas: Simulador ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/templates', 'index.html'));
});

app.all('/simulator', (req, res) => {
    if (!req.session.simulations) req.session.simulations = [];

    if (req.method === 'POST') {
        try {
            const monto = parseInt(req.body.monto);
            const cuotas = parseInt(req.body.cuotas);

            if (isNaN(monto) || monto <= 0 || isNaN(cuotas) || cuotas < 1) {
                return res.redirect('/simulator');
            }

            let j_denominator = 0;
            for (let i = 1; i <= cuotas; i++) {
                j_denominator += 1 / Math.pow((1 + INTEREST_RATE), i);
            }

            const valor_cuota = j_denominator > 0 ? Math.round(monto / j_denominator) : 0;
            const total_pagado = valor_cuota * cuotas;
            const interes_pagado = total_pagado - monto;

            req.session.simulations.push({ monto, cuotas, valor_cuota, total: total_pagado, interes: interes_pagado });
            return res.redirect('/simulator');
        } catch (error) {
            console.error(error);
        }
    }

    res.render('simulator.ejs', {
        simulations: req.session.simulations,
        interest_rate: Math.round(INTEREST_RATE * 10000) / 100,
        rut: req.session.rut || ''
    });
});

app.get('/clear', (req, res) => {
    delete req.session.simulations;
    res.redirect('/simulator');
});

app.post('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (req.session.simulations && index >= 0 && index < req.session.simulations.length) {
        req.session.simulations.splice(index, 1);
    }
    res.redirect('/simulator');
});

// --- Rutas: Crédito ---
app.get('/credito_form', (req, res) => {
    const monto = req.query.monto || '';
    const cuotas = req.query.cuotas || '';
    const rut = req.session.rut || '';
    let monto_formateado = '';
    if (monto) {
        try {
            monto_formateado = `$${parseInt(monto).toLocaleString('es-CL')}`;
        } catch {
            monto_formateado = '';
        }
    }
    res.render('credito_form.ejs', { monto, cuotas, monto_formateado, rut });
});

app.post('/credito_directo', (req, res) => {
    try {
        const { monto, cuotas, rut, fecha_primer_pago, activar_no_pago, mes_sin_pago, seguros } = req.body;

        const montoNum = parseInt(monto);
        const cuotasNum = parseInt(cuotas);

        if (isNaN(montoNum) || montoNum <= 0 || isNaN(cuotasNum) || cuotasNum < 1) {
            return res.status(400).send('Datos inválidos: monto y plazo deben ser positivos');
        }

        req.session.datosCredito = {
            rut,
            monto: montoNum,
            cuotas: cuotasNum,
            fecha_pago: fecha_primer_pago,
            no_pago: activar_no_pago === 'on' ? mes_sin_pago : null,
            seguros: Array.isArray(seguros) ? seguros : (seguros ? [seguros] : [])
        };

        res.redirect('/subir_documentos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get('/credito', (req, res) => {
    const datos = req.session.datosCredito;
    if (!datos) return res.redirect('/simulator');

    const { monto, cuotas } = datos;

    let j_denominator = 0;
    for (let i = 1; i <= cuotas; i++) {
        j_denominator += 1 / Math.pow((1 + INTEREST_RATE), i);
    }

    const valor_cuota = j_denominator > 0 ? Math.round(monto / j_denominator) : 0;

    const seguros = datos.seguros || [];
    const costo_seguros = seguros.reduce((acc, s) => acc + Math.round(monto * (SEGUROS_TASAS[s] || 0)), 0);
    const cuota_total = valor_cuota + costo_seguros;

    const tiene_no_pago = !!datos.no_pago;
    const cuotas_totales = tiene_no_pago ? cuotas + 1 : cuotas;
    const total = cuota_total * cuotas_totales;

    res.render('credito.ejs', {
        simulacion: {
            monto,
            cuotas,
            valor_cuota,
            seguros,
            costo_seguros,
            cuota_total,
            total,
            tiene_no_pago,
            mes_no_pago: datos.no_pago
        }
    });
});

app.get('/firma', (req, res) => {
    res.render('firma');
});

app.get('/final', (req, res) => {
    res.render('final.ejs');
});

// --- Rutas: Documentos ---
app.get('/subir_documentos', (req, res) => {
    if (!req.session.rut) {
        return res.redirect('/');
    }
    res.render('documento.ejs', {
        rut: req.session.rut,
        nombre: req.session.nombre || 'Usuario'
    });
});

app.get('/api/leer', (req, res) => {
    const leerQuery = `SELECT * FROM solicitante;`;

    database.query(leerQuery, (err, results) => {
        if (err) {
            console.error('Error leyendo la tabla:', err);
            return res.status(500).send('Error al leer la tabla');
        }
        res.json(results);
    });
});

// --- Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
