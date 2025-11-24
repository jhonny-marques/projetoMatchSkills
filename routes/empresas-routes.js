const express = require('express');
const router = express.Router();
const path = require('path');
const empresasController = require('../controllers/empresas-controller.js');

// API

router.get('/api/empresas/buscar', empresasController.buscar_empresas_por_nome);
router.get('/api/empresas/:id', empresasController.buscar_empresa_por_id);
router.get('/api/empresas/completo/:id', empresasController.buscar_empresa_completa_por_id);
router.get('/api/empresas', empresasController.buscar_empresas_aleatorias);
router.put('/api/empresas/:id', empresasController.atualizar_empresa);

// Front-end

router.get('/buscar-empresas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'buscar-empresas.html'));
});

router.get('/empresa-home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'empresa-home.html'));
});

router.get('/perfil-empresa', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'perfil-empresa.html'));
});

router.get('/ver-empresa', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'ver-empresa.html'));
});

module.exports = router;