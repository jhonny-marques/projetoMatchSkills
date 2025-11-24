const habilidadesModel = require ('../models/habilidades-model')
const vagasModel = require('../models/vagas-model');

const habilidadesController = {

    criar_habilidade: async(req, res)=> {
        const {nome, categoria} = req.body;

        try {
            if(!nome || !categoria){
                return res.status(400).json
                ({error: 'Nome e categoria não foram encontrados. '})
            }

            const criarHabilidade = await habilidadesModel.criar_habilidade(nome, categoria);

            if (criarHabilidade) {
                return res.status(201).json({
                    message: 'Habilidade criada com sucesso.',
                });
            } else {
                return res.status(500).json({
                    error: 'Erro ao criar a habilidade.'
                });
            }

        } catch (error) {

            switch(error.code){
                case 'ER_DUP_ENTRY':
                   return res.status(409).json({
                        Error: 'Já existe uma habilidade com esse nome.'
                    });

                case 'INTERNAL ERROR':
                    default:
                       return res.status(500).json({
                            Error: 'Erro interno no servidor.'
                        });
            }
        }
    },

    criar_habilidade_candidato: async(req, res)=> {
        const {id_candidato, id_habilidade, nivel} = req.body;

        try {
              if(!id_candidato || !id_habilidade || !nivel){
                return res.status(400).json
                ({error: 'Id do candidato,Id da habilidade e nivel não foram encontrados. '})
            }

            const criarHabilidadeCandidato = await habilidadesModel.criar_habilidade_candidato(id_candidato, id_habilidade, nivel);

            if (criarHabilidade) {
                return res.status(201).json({
                    message: 'Habilidade do candidato criada com sucesso.',
                });
            } else {
                return res.status(500).json({
                    error: 'Erro ao criar a habilidade do candidato.'
                });
            }
        } catch (error) {

            switch(error.code){
                case 'ER_DUP_ENTRY':
                   return res.status(409).json({
                        Error: 'Já existe uma habilidade do candidato com esse ID.'
                    });

                case 'ER_NO_REFERENCED_ROW_2':
                   return res.status(409).json({
                        Error: 'Erro de integridade: chave estrangeira inválida ou inexistente.'
                    });
                
                case 'INTERNAL ERROR':
                    default:
                       return res.status(500).json({
                            Error: 'Erro interno no servidor.'
                        });
            }
        }
    },

    criar_habilidade_vaga: async(req, res)=> {
        const {id_vaga, id_habilidade, obrigatoria} = req.body;

        try {

            if(!id_vaga || !id_habilidade || !obrigatoria){
                return res.status(400).json
                ({error: 'Id da vaga,Id da habilidade e obrigatoria não foram encontrados. '})
            }

            const criarHabilidadeVaga = await habilidadesModel.criar_habilidade_vaga(id_vaga, id_habilidade, obrigatoria);

            if (criarHabilidade) {
                return res.status(201).json({
                    message: 'Habilidade da vaga criada com sucesso.',
                });
            } else {
                return res.status(500).json({
                    error: 'Erro ao criar a habilidade da vaga.'
                });
            }

        } catch (error) {

            switch(error.code){
                case 'ER_DUP_ENTRY':
                   return res.status(409).json({
                        Error: 'Já existe uma habilidade da vaga com esse ID.'
                    });

                case 'ER_NO_REFERENCED_ROW_2':
                   return res.status(409).json({
                        Error: 'Erro de integridade: chave estrangeira inválida ou inexistente.'
                    });
                
                case 'INTERNAL ERROR':
                    default:
                       return res.status(500).json({
                            Error: 'Erro interno no servidor.'
                        });
            }
        }
    },

    // parte do controller de buscar as habilidades feita pelo o Angelo
    listar_habilidade: async(req, res)=> {
        try {
            const habilidades = await habilidadesModel.listar_habilidade();
            return res.status(200).json({ data: habilidades });
        } catch (error) {
            console.error("Erro ao listar habilidades:", error);
            return res.status(500).json({ error: "Erro interno no servidor ao listar habilidades." });
        }
    },

    buscar_habilidade: async(req, res)=> {
        const { termo } = req.query;
        try {
            if (!termo) {
                return res.status(400).json({ error: "O termo de busca é obrigatório." });
            }
            const habilidades = await habilidadesModel.buscar_habilidades(termo);
            return res.status(200).json({ data: habilidades });
        } catch (error) {
            console.error("Erro ao buscar habilidades:", error);
            return res.status(500).json({ error: "Erro interno no servidor ao buscar habilidades." });
        }
    },

    buscar_habilidades_por_vaga: async(req, res)=> {
        const { id_vaga } = req.params;
        try {
            if (!id_vaga) {
                return res.status(400).json({ error: "O ID da vaga é obrigatório." });
            }
            const habilidades = await habilidadesModel.buscar_habilidades_por_vaga(id_vaga);
            return res.status(200).json({ data: habilidades });
        } catch (error) {
            console.error("Erro ao buscar habilidades por vaga:", error);
            return res.status(500).json({ error: "Erro interno no servidor ao buscar habilidades por vaga." });
        }
    },

    buscar_habilidades_por_candidato: async(req, res)=> {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ error: "O ID do candidato é obrigatório." });
            }
            const habilidades = await habilidadesModel.buscar_habilidades_por_candidato(id);
            // The frontend expects an object with a 'data' property
            return res.status(200).json({ data: habilidades });
        } catch (error) {
            console.error("Erro ao buscar habilidades por candidato:", error);
            return res.status(500).json({ error: "Erro interno no servidor ao buscar habilidades por candidato." });
        }
    },

    buscar_todas_informacoes_habilidades_por_candidato: async(req, res) => {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ error: "O ID do candidato é obrigatório." });
            }
            const habilidades = await habilidadesModel.buscar_todas_informacoes_habilidades_por_candidato(id);
            if (habilidades) {
                return res.status(200).json({ data: habilidades });
            }
            return res.status(404).json({ message: "Nenhuma habilidade encontrada para este candidato." });
        } catch (error) {
            console.error("Erro ao buscar todas as informações de habilidades por candidato:", error);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }
    },

    atualizar_habilidades_vaga: async(req, res) => {
        const { id_vaga } = req.params;
        const { habilidades_obrigatorias, habilidades_diferenciais } = req.body;

        if (!id_vaga) {
            return res.status(400).json({ error: 'O ID da vaga é obrigatório.' });
        }

        if (!Array.isArray(habilidades_obrigatorias) || !Array.isArray(habilidades_diferenciais)) {
            return res.status(400).json({ error: 'Os campos "habilidades_obrigatorias" e "habilidades_diferenciais" devem ser arrays.' });
        }

        try {
            await habilidadesModel.atualizar_habilidades_vaga(id_vaga, habilidades_obrigatorias, habilidades_diferenciais);
            await vagasModel.deletar_todas_candidaturas_para_vaga(id_vaga);
            return res.status(200).json({ message: 'Habilidades da vaga atualizadas com sucesso.' });
        } catch (error) {
            console.error("Erro ao atualizar habilidades da vaga:", error);
            // Check for foreign key constraint error
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ error: 'Uma ou mais IDs de habilidade fornecidas não existem.' });
            }
            return res.status(500).json({ error: 'Erro interno no servidor ao atualizar as habilidades da vaga.' });
        }
    }
}

module.exports = habilidadesController;