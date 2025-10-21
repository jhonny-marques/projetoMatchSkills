const habilidadesModel = require ('../models/habilidades-model')

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
            const habilidades = await habilidadesModel.listar_habilidades();
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
    }
}

module.exports = habilidadesController;