const db  = require('../config/db.js');

const habilidadesModel = {

    criar_habilidade: async(nome, categoria)=> {

        try {
            const sql = 'CALL criar_habilidade (?, ?)';
            await db.execute(sql, [nome, categoria]);
            return true;

        } catch (error) {
            console.log('Erro ao criar a habilidade.', error);
            throw error;
        }
    },

    criar_habilidade_candidato: async(id_candidato, id_habilidade, nivel)=> {

        try {
            const sql = 'CALL criar_habilidade_candidato (?, ?, ?)';
            await db.execute(sql, [id_candidato, id_habilidade, nivel]);
            return true;

        } catch (error) {
            console.log('Erro ao criar a habilidade do candidato.', error);
            throw error;
        }
    },

    criar_habilidade_vaga: async(id_vaga, id_habilidade, obrigatoria)=> {

        try {
            const sql = 'CALL criar_habilidade_vaga (?, ?, ?)';
            await db.execute(sql, [id_vaga, id_habilidade, obrigatoria]);
            return true;

        } catch (error) {
            console.log('Erro ao criar a habilidade da vaga.', error);
            throw error;
        }
    },

    //parte de buscar as habilidades feita pelo Angelo
    listar_habilidade: async()=>{
        try {
            const [rows] = await db.execute('SELECT * FROM habilidades');
            return rows;
        } catch (error) {
            console.error('Erro ao listar habilidades no modelo:', error);
            throw error;
        }
    },

    buscar_habilidade: async()=>{
        try {
            const [rows] = await db.execute(
                'SELECT * FROM habilidades WHERE nome LIKE ? OR categoria LIKE ?',
                [`%${termo_busca}%`, `%${termo_busca}%`]
            );
            return rows;
        } catch (error) {
            console.error('Erro ao buscar habilidades no modelo:', error);
            throw error;
        }
    },

    buscar_habilidades_por_vaga: async(id_vaga)=> {
        try {
            const sql = 'CALL buscar_habilidades_por_vaga(?)';
            const [rows] = await db.execute(sql, [id_vaga]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar habilidades por vaga no modelo:', error);
            throw error;
        }
    },

    buscar_habilidades_por_candidato: async(id_candidato)=> {
        try {
            const sql = 'CALL buscar_habilidades_por_candidato(?)';
            const [rows] = await db.execute(sql, [id_candidato]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar habilidades por candidato no modelo:', error);
            throw error;
        }
    },

    buscar_todas_informacoes_habilidades_por_candidato: async(id_candidato) => {
        try {
            const sql = 'CALL buscar_todas_informacoes_habilidades_por_candidato(?)';
            const [rows] = await db.execute(sql, [id_candidato]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar todas as informações de habilidades por candidato no modelo:', error);
            throw error;
        }
    },

    atualizar_habilidades_vaga: async(id_vaga, habilidades_obrigatorias, habilidades_diferenciais) => {
        try {
            const sql = 'CALL atualizar_habilidades_vaga(?, ?, ?)';
            const obrigatoriasStr = habilidades_obrigatorias.join(',');
            const diferenciaisStr = habilidades_diferenciais.join(',');
            await db.execute(sql, [id_vaga, obrigatoriasStr, diferenciaisStr]);
            return true;
        } catch (error) {
            console.error('Erro ao atualizar habilidades da vaga no modelo:', error);
            throw error;
        }
    }
}

module.exports = habilidadesModel;