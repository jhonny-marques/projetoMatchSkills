const db = require('../config/db.js');

const vagasModel = {
    criar_vaga: async (id_empresa, titulo, descricao, localizacao, modalidade, salario) => {
        try {
            const sql = 'CALL criar_vaga(?, ?, ?, ?, ?, ?)';
            const [vaga] = await db.execute(sql, [id_empresa, titulo, descricao, localizacao, modalidade, salario]);
            return vaga;
        } catch (error) {
            console.log('Erro ao criar vaga.', error);
            throw error;
        }
    },
    buscar_vagas_por_empresa: async (id) => {
        try {
            const sql = 'CALL buscar_vagas_por_empresa(?)';
            const [vagas] = await db.execute(sql, [id]);
            return vagas;
        } catch (error) {
            console.log('Erro ao buscar vagas por empresa.', error);
            throw error;
        }
    },
    buscar_vaga_por_id: async (id) => {
        try {
            const sql = 'CALL buscar_vaga_por_id(?)';
            const [vaga] = await db.execute(sql, [id]);
            return vaga;
        } catch (error) {
            console.log('Erro ao buscar vaga por id.', error);
            throw error;
        }
    },
    buscar_vagas_aleatorias: async (id_candidato) => {
        try {
            const sql = 'CALL buscar_vagas_aleatorias(?)';
            const [vagas] = await db.execute(sql, [id_candidato]);
            return vagas;
        } catch (error) {
            console.log('Erro ao buscar vagas aleatórias.', error);
            throw error;
        }
    },
    buscar_vagas_por_habilidades: async (habilidades, id_candidato) => {
        try {
            const sql = 'CALL buscar_vagas_por_habilidades(?, ?)';
            const [vagas] = await db.execute(sql, [habilidades, id_candidato]);
            return vagas;
        } catch (error) {
            console.log('Erro ao buscar vagas por habilidades.', error);
            throw error;
        }
    },
    deletar_vaga_por_id: async (id) => {
        try {
            const sql = 'CALL deletar_vaga_por_id(?)';
            const [result] = await db.execute(sql, [id]);
            return result;
        } catch (error) {
            console.log('Erro ao deletar vaga por id.', error);
            throw error;
        }
    },
    atualizar_vaga_por_id: async (id_vaga, titulo, descricao, localizacao, modalidade, salario) => {
        try {
            const sql = 'CALL atualizar_vaga_por_id(?, ?, ?, ?, ?, ?)';
            const [result] = await db.execute(sql, [id_vaga, titulo, descricao, localizacao, modalidade, salario]);
            return result;
        } catch (error) {
            console.log('Erro ao atualizar vaga por id.', error);
            throw error;
        }
    },
    buscar_candidatos_por_vaga: async (id_vaga) => {
        try {
            const sql = 'CALL buscar_candidatos_por_vaga(?)';
            const [candidatos] = await db.execute(sql, [id_vaga]);
            return candidatos;
        } catch (error) {
            console.log('Erro ao buscar candidatos por vaga.', error);
            throw error;
        }
    },
    deletar_todas_candidaturas_para_vaga: async (id_vaga) => {
        try {
            const sql = 'CALL deletar_todas_candidaturas_para_vaga(?)';
            await db.execute(sql, [id_vaga]);
            return true;
        } catch (error) {
            console.log('Erro ao deletar candidaturas para a vaga.', error);
            throw error;
        }
    }
};

module.exports = vagasModel;