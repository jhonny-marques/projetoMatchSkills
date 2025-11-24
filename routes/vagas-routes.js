const express = require('express');
const router = express.Router();
const path = require('path');
const vagasController = require('../controllers/vagas-controller.js');

// API
router.get('/api/vagas/match/:id', vagasController.buscar_vagas_por_habilidades_do_candidato);
router.get('/api/vagas/aleatorias', vagasController.buscar_vagas_aleatorias);
router.get('/api/vagas/habilidades', vagasController.buscar_vagas_por_habilidades);
router.get('/api/vagas/empresa/:id', vagasController.buscar_vagas_por_empresa);
router.get('/api/vagas/:id', vagasController.buscar_vaga_por_id);
router.get('/api/vagas/:id/candidatos', vagasController.buscar_candidatos_por_vaga);
router.put('/api/vagas/:id', vagasController.atualizar_vaga_por_id);
router.post('/api/vagas', vagasController.criar_vaga);
router.delete('/api/vagas/:id', vagasController.deletar_vaga_por_id);

// Front-end

router.get('/buscar-vagas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'buscar-vagas.html'));
});

router.get('/minhas-vagas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'minhas-vagas.html'));
});

router.get('/candidaturas/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'candidaturas.html'));
});

module.exports = router;