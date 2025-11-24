const vagasModel = require('../models/vagas-model.js');
const CandidatosController = require('../controllers/candidatos-controller.js');

const processVagas = (vagas) => {
    if (vagas.length > 0) {
        const fullMatches = vagas.filter(vaga => vaga.matching_skills === vaga.total_skills);
        const partialMatches = vagas.filter(vaga => vaga.matching_skills !== vaga.total_skills);

        if (fullMatches.length >= 10) {
            return fullMatches;
        } else {
            const needed = 10 - fullMatches.length;
            return [...fullMatches, ...partialMatches.slice(0, needed)];
        }
    }
    return [];
}

module.exports = {
    buscar_vagas_por_empresa: async (req, res) => {
        const { id } = req.params;
        try {
            const vagas = await vagasModel.buscar_vagas_por_empresa(id);

            if (vagas[0].length > 0) {
                return res.status(200).json(vagas[0]);
            } else {
                return res.status(404).json({ message: 'Nenhuma vaga encontrada para a empresa informada.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },
    buscar_vaga_por_id: async (req, res) => {
        const { id } = req.params;
        try {
            const vaga = await vagasModel.buscar_vaga_por_id(id);

            if (vaga[0].length > 0) {
                return res.status(200).json(vaga[0]);
            } else {
                return res.status(404).json({ message: 'Nenhuma vaga encontrada para o id informado.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    criar_vaga: async (req, res) => {
        const { id_empresa, titulo, descricao, localizacao, modalidade, salario } = req.body;

        if (!id_empresa || !titulo || !descricao || !localizacao || !modalidade || !salario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: id_empresa, titulo, descricao, localizacao, modalidade, salario.' });
        }

        try {
            const vaga = await vagasModel.criar_vaga(id_empresa, titulo, descricao, localizacao, modalidade, salario);
            return res.status(201).json({ message: 'Vaga criada com sucesso.', vaga });
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    buscar_vagas_aleatorias: async (req, res) => {
        const { id_candidato } = req.query;
        try {
            const vagas = await vagasModel.buscar_vagas_aleatorias(id_candidato);

            if (vagas[0].length > 0) {
                return res.status(200).json(vagas[0]);
            } else {
                return res.status(404).json({ message: 'Nenhuma vaga encontrada.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    buscar_vagas_por_habilidades: async (req, res) => {
        const { habilidades, id_candidato } = req.query;
        try {
            const vagas = await vagasModel.buscar_vagas_por_habilidades(habilidades, id_candidato);
            const processedVagas = processVagas(vagas[0]);

            if (processedVagas.length > 0) {
                return res.status(200).json(processedVagas);
            } else {
                return res.status(404).json({ message: 'Nenhuma vaga encontrada para as habilidades informadas.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    },

    buscar_vagas_por_habilidades_do_candidato: async (req, res) => {
        const { id } = req.params;
        try {
            const habilidadesString = await CandidatosController.getHabilidadesStringByCandidatoId(id);

            if (habilidadesString) {
                const vagas = await vagasModel.buscar_vagas_por_habilidades(habilidadesString, id);
                const processedVagas = processVagas(vagas[0]);

                if (processedVagas.length > 0) {
                    return res.status(200).json(processedVagas);
                } else {
                    return res.status(404).json({ message: 'Nenhuma vaga encontrada para as habilidades do candidato.' });
                }
            } else {
                return res.status(404).json({ message: 'Habilidades não encontradas para o candidato.' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar vagas por habilidades do candidato.' });
        }
    },

    deletar_vaga_por_id: async (req, res) => {
        const { id } = req.params;
        try {
            const vaga = await vagasModel.buscar_vaga_por_id(id);
            if (vaga[0].length === 0) {
                return res.status(404).json({ message: 'Vaga não encontrada.' });
            }

            await vagasModel.deletar_vaga_por_id(id);

            return res.status(200).json({ message: 'Vaga deletada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor ao deletar vaga.' });
        }
    },

    atualizar_vaga_por_id: async (req, res) => {
        const { id } = req.params;
        const { titulo, descricao, localizacao, modalidade, salario } = req.body;

        if (!titulo || !descricao || !localizacao || !modalidade || !salario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: titulo, descricao, localizacao, modalidade, salario.' });
        }

        try {
            const vaga = await vagasModel.buscar_vaga_por_id(id);
            if (vaga[0].length === 0) {
                return res.status(404).json({ message: 'Vaga não encontrada.' });
            }

            await vagasModel.atualizar_vaga_por_id(id, titulo, descricao, localizacao, modalidade, salario);
            await vagasModel.deletar_todas_candidaturas_para_vaga(id);
            return res.status(200).json({ message: 'Vaga atualizada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor ao atualizar a vaga.' });
        }
    },

    buscar_candidatos_por_vaga: async (req, res) => {
        const { id } = req.params; // id da vaga
        try {
            const candidatos = await vagasModel.buscar_candidatos_por_vaga(id);

            if (candidatos[0] && candidatos[0].length > 0) {
                return res.status(200).json(candidatos[0]);
            } else {
                return res.status(404).json({ message: 'Nenhum candidato encontrado para esta vaga.' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
};