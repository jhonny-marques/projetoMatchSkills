const db = require('../config/db');

class Candidato {
    static async buscar_por_id(id) {
        try {
            const [results] = await db.query('CALL buscar_candidato_por_id(?)', [id]);
            return results[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async buscar_id_habilidades_por_candidato(id) {
        try {
            const [results] = await db.query('CALL buscar_id_habilidades_por_candidato(?)', [id]);
            return results[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async atualizar_candidato(id, nome, email, cpf, descricao_pessoal) {
        try {
            const [results] = await db.query('CALL atualizar_candidato(?, ?, ?, ?, ?)', [id, nome, email, cpf, descricao_pessoal]);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async buscar_curriculo_por_candidato(id) {
        try {
            const [results] = await db.query('CALL buscar_curriculo_por_candidato(?)', [id]);
            if (results[0] && results[0].length > 0) {
                return results[0][0].curriculo_link;
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar currículo do candidato:', error);
            throw error;
        }
    }

    static async atualizar_curriculo_candidato(id, curriculo_link) {
        try {
            const [results] = await db.query('CALL atualizar_curriculo_candidato(?, ?)', [id, curriculo_link]);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async atualizar_habilidades_candidato(id, habilidades) {
        try {
            // The procedure expects a comma-separated string of IDs.
            const habilidadesString = habilidades.join(',');
            const [results] = await db.query('CALL atualizar_habilidades_candidato(?, ?)', [id, habilidadesString]);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async buscar_informacoes_do_candidato(id) {
        try {
            const [results] = await db.query('CALL buscar_informacoes_do_candidato(?)', [id]);
            return results[0];
        } catch (error) {
            console.error('Erro ao buscar informações do candidato:', error);
            throw error;
        }
    }

    static async criar_candidatura(id_vaga, id_candidato) {
        try {
            const [results] = await db.query('CALL criar_candidatura(?, ?, ?)', [id_vaga, id_candidato, 'Em Análise']);
            return results;
        } catch (error) {
            console.error('Erro ao criar candidatura:', error);
            throw error;
        }
    }
}

module.exports = Candidato;