const db = require('../config/db.js');

const empresaModel = {
    buscar_empresas_por_nome: async (nome) => {
        try {
            const sql = 'CALL buscar_empresas_por_nome(?)';
            const [empresas] = await db.execute(sql, [nome]);
            return empresas;
        } catch (error) {
            console.log('Erro ao buscar empresas por nome.', error);
            throw error;
        }
    },

    buscar_empresa_por_id: async (id) => {
        try {
            const sql = 'CALL buscar_empresa_por_id(?)';
            const [empresa] = await db.execute(sql, [id]);
            return empresa;
        } catch (error) {
            console.log('Erro ao buscar empresa por id.', error);
            throw error;
        }
    },

    buscar_empresa_completa_por_id: async (id) => {
        try {
            const sql = 'CALL buscar_empresa_completa_por_id(?)';
            const [empresa] = await db.execute(sql, [id]);
            return empresa;
        } catch (error) {
            console.log('Erro ao buscar dados completos da empresa por id.', error);
            throw error;
        }
    },

    buscar_empresas_aleatorias: async () => {
        try {
            const sql = 'CALL buscar_empresas_aleatorias()';
            const [empresas] = await db.execute(sql);
            return empresas;
        } catch (error) {
            console.log('Erro ao buscar empresas aleatórias.', error);
            throw error;
        }
    },

    criar_empresa: async (id_usuario, cnpj, razao_social, site, setor, local, tamanho) => {
        try {
            const sql = 'CALL criar_empresa(?, ?, ?, ?, ?, ?, ?)';
            await db.execute(sql, [id_usuario, cnpj, razao_social, site, setor, local, tamanho]);
            return true;
        } catch (error) {
            console.log('Erro ao criar empresa.', error);
            throw error;
        }
    },

    atualizar_empresa: async (id_empresa, cnpj, razao_social, site, setor, local, tamanho, email, descricao) => {
        try {
            const sql = 'CALL atualizar_empresa(?, ?, ?, ?, ?, ?, ?, ?, ?)';
            await db.execute(sql, [id_empresa, cnpj, razao_social, site, setor, local, tamanho, email, descricao]);
            return true;
        } catch (error) {
            console.log('Erro ao atualizar empresa.', error);
            throw error;
        }
    }
};

module.exports = empresaModel;
