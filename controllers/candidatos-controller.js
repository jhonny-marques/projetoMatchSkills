const Candidato = require('../models/candidatos-model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para upload de currículos
const storageCurriculo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/curriculos-candidatos/');
    },
    filename: function (req, file, cb) {
        const { id_candidato } = req.body;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `curriculo-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const uploadCurriculo = multer({
    storage: storageCurriculo,
    fileFilter: function (req, file, cb) {
        if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
            return cb(new Error('Somente arquivos PDF são permitidos!'));
        }
        cb(null, true);
    }
});

class CandidatosController {
    static async buscar_candidato_por_id(req, res) {
        const { id } = req.params;
        try {
            const candidato = await Candidato.buscar_por_id(id);

            if (candidato && candidato.length > 0) {
                res.status(200).json(candidato);
            } else {
                res.status(404).json({ message: 'Candidato não encontrado.' });
            }
        } catch (error) {
            console.error('Erro ao buscar candidato:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao buscar o candidato.' });
        }
    }

    static async getHabilidadesStringByCandidatoId(id) {
        const habilidades = await Candidato.buscar_id_habilidades_por_candidato(id);
        if (habilidades.length > 0) {
            let conjuntoHabilidades = "";
            habilidades.forEach(habilidade => {
                conjuntoHabilidades += `${habilidade.id_habilidade},`;
            });
            return conjuntoHabilidades.slice(0, -1);
        }
        return null;
    }

    static async atualizar_candidato(req, res) {
        const { id_candidato, nome, email, cpf, descricao_pessoal } = req.body;
        if (!id_candidato || !nome || !email || !cpf || !descricao_pessoal) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: id, nome, email, cpf e descrição.' });
        }

        try {
            await Candidato.atualizar_candidato(id_candidato, nome, email, cpf, descricao_pessoal);
            res.status(200).json({ message: 'Perfil do candidato atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar perfil do candidato:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao atualizar o perfil do candidato.' });
        }
    }

    static async atualizar_habilidades_candidato(req, res) {
        const { id_candidato, habilidades } = req.body; // habilidades should be an array of IDs

        if (!id_candidato || !Array.isArray(habilidades)) {
            return res.status(400).json({ error: 'ID do candidato e um array de habilidades são obrigatórios.' });
        }

        try {
            await Candidato.atualizar_habilidades_candidato(id_candidato, habilidades);
            res.status(200).json({ message: 'Habilidades do candidato atualizadas com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar habilidades do candidato:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao atualizar as habilidades.' });
        }
    }

    static uploadCurriculo = uploadCurriculo.single('curriculo');

    static async atualizar_curriculo_candidato(req, res) {
        const { id_candidato } = req.body;
        const curriculo_link = req.file ? `curriculos-candidatos/${req.file.filename}` : null;

        if (!id_candidato || !curriculo_link) {
            return res.status(400).json({ error: 'ID do candidato e arquivo do currículo são obrigatórios.' });
        }

        try {
            // Buscar o currículo antigo para deletar
            const curriculoAntigo = await Candidato.buscar_curriculo_por_candidato(id_candidato);

            if (curriculoAntigo) {
                const caminhoCurriculoAntigo = path.join(__dirname, '..', 'public', curriculoAntigo);
                fs.unlink(caminhoCurriculoAntigo, (err) => {
                    if (err) {
                        // Log do erro, mas não impede a atualização do novo currículo
                        console.error('Erro ao deletar o currículo antigo:', err);
                    }
                });
            }

            await Candidato.atualizar_curriculo_candidato(id_candidato, curriculo_link);
            res.status(200).json({ message: 'Currículo do candidato atualizado com sucesso.', curriculo_link });
        } catch (error) {
            console.error('Erro ao atualizar currículo do candidato:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao atualizar o currículo do candidato.' });
        }
    }

    static async buscar_informacoes_do_candidato(req, res) {
        const { id } = req.params;
        try {
            const candidatoInfo = await Candidato.buscar_informacoes_do_candidato(id);

            if (candidatoInfo && candidatoInfo.length > 0) {
                res.status(200).json(candidatoInfo[0]);
            } else {
                res.status(404).json({ message: 'Informações do candidato não encontradas.' });
            }
        } catch (error) {
            console.error('Erro ao buscar informações do candidato:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao buscar as informações do candidato.' });
        }
    }

    static async criar_candidatura(req, res) {
        const { id_vaga, id_candidato } = req.body;

        if (!id_vaga || !id_candidato) {
            return res.status(400).json({ error: 'ID da vaga e ID do candidato são obrigatórios.' });
        }

        try {
            const result = await Candidato.criar_candidatura(id_vaga, id_candidato);
            // The result from a procedure call includes metadata. affectedRows is what we need.
            if (result && result.affectedRows > 0) {
                res.status(201).json({ message: 'Candidatura feita com sucesso.' });
            } else {
                res.status(409).json({ message: 'Você já se candidatou para esta vaga.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro interno no servidor ao criar a candidatura.' });
        }
    }

}

module.exports = CandidatosController;