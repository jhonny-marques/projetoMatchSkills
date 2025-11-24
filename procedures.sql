USE sistema_vagas;

-- Criar usuário
DELIMITER //
CREATE PROCEDURE criar_usuario(
    IN p_nome VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_senha VARCHAR(255),
    IN p_tipo_usuario VARCHAR(10),
    IN p_descricao TEXT
)
BEGIN
    INSERT INTO usuarios (nome, email, senha, tipo_usuario, descricao, data_criacao)
    VALUES (p_nome, p_email, p_senha, p_tipo_usuario, p_descricao, NOW());
    SELECT LAST_INSERT_ID() AS id_usuario, p_tipo_usuario AS tipo_usuario;
END //
DELIMITER ;

-- Criar empresa
DELIMITER //
CREATE PROCEDURE criar_empresa(
    IN p_id_usuario INT,
    IN p_cnpj VARCHAR(18),
    IN p_razao_social VARCHAR(150),
    IN p_site VARCHAR(200),
    IN p_setor VARCHAR(100),
    IN p_local VARCHAR(100),
    IN p_tamanho ENUM('Pequena', 'Média', 'Grande')
)
BEGIN
    INSERT INTO empresas (id_empresa, cnpj, razao_social, site, setor, local, tamanho)
    VALUES (p_id_usuario, p_cnpj, p_razao_social, p_site, p_setor, p_local, p_tamanho);
END //
DELIMITER ;

-- Criar candidato
DELIMITER //
CREATE PROCEDURE criar_candidato(
    IN p_id_usuario INT,
    IN p_cpf VARCHAR(14),
    IN p_curriculo_link VARCHAR(255)
)
BEGIN
    INSERT INTO candidatos (id_candidato, cpf, curriculo_link)
    VALUES (p_id_usuario, p_cpf, p_curriculo_link);
END //
DELIMITER ;

-- Criar habilidade
DELIMITER //
CREATE PROCEDURE criar_habilidade(
    IN p_nome VARCHAR(100),
    IN p_categoria VARCHAR(100)
)
BEGIN
    INSERT INTO habilidades (nome, categoria)
    VALUES (p_nome, p_categoria);
END //
DELIMITER ;

-- Criar habilidade de candidato
DELIMITER //
CREATE PROCEDURE criar_habilidade_candidato(
    IN p_id_candidato INT,
    IN p_id_habilidade INT,
    IN p_nivel ENUM('Básico', 'Intermediário', 'Avançado')
)
BEGIN
    INSERT INTO habilidades_candidatos (id_candidato, id_habilidade, nivel)
    VALUES (p_id_candidato, p_id_habilidade, p_nivel);
END //
DELIMITER ;

-- Criar habilidade de vaga
DELIMITER //
CREATE PROCEDURE criar_habilidade_vaga(
    IN p_id_vaga INT,
    IN p_id_habilidade INT,
    IN p_obrigatoria BOOLEAN
)
BEGIN
    INSERT INTO habilidades_vagas (id_vaga, id_habilidade, obrigatoria)
    VALUES (p_id_vaga, p_id_habilidade, p_obrigatoria);
END //
DELIMITER ;

-- Criar vaga
DELIMITER //
CREATE PROCEDURE criar_vaga(
    IN p_id_empresa INT,
    IN p_titulo VARCHAR(150),
    IN p_descricao TEXT,
    IN p_localizacao VARCHAR(150),
    IN p_modalidade VARCHAR(100),
    IN p_salario VARCHAR(50)
)
BEGIN
    INSERT INTO vagas (id_empresa, titulo, descricao, localizacao, modalidade, salario, data_publicacao)
    VALUES (p_id_empresa, p_titulo, p_descricao, p_localizacao, p_modalidade, p_salario, NOW());
    SELECT LAST_INSERT_ID() AS id_vaga;
END //
DELIMITER ;

-- Criar candidatura
DELIMITER //
CREATE PROCEDURE criar_candidatura(
    IN p_id_vaga INT,
    IN p_id_candidato INT,
    IN p_status ENUM('Enviado', 'Em Análise', 'Rejeitado', 'Aprovado')
)
BEGIN
    -- Check if the candidate has already applied for this vacancy
    IF NOT EXISTS (SELECT 1 FROM candidaturas WHERE id_vaga = p_id_vaga AND id_candidato = p_id_candidato) THEN
        -- If not, insert the new application
        INSERT INTO candidaturas (id_vaga, id_candidato, data_candidatura, status)
        VALUES (p_id_vaga, p_id_candidato, NOW(), p_status);
    END IF;
END //
DELIMITER ;

-- Buscar empresas por nome
DELIMITER //
CREATE PROCEDURE buscar_empresas_por_nome(
    IN p_nome VARCHAR(100)
)
BEGIN
    SELECT e.*, u.foto FROM empresas e JOIN usuarios u ON e.id_empresa = u.id_usuario WHERE razao_social LIKE CONCAT('%', p_nome, '%');
END //
DELIMITER ;

-- Buscar empresa por id
DELIMITER //
CREATE PROCEDURE buscar_empresa_por_id(
    IN p_id INT
)
BEGIN
    SELECT e.*, u.foto, u.descricao FROM empresas e JOIN usuarios u ON e.id_empresa = u.id_usuario WHERE id_empresa = p_id;
END //
DELIMITER ;

-- Buscar empresa completa por id
DELIMITER //
CREATE PROCEDURE buscar_empresa_completa_por_id(
    IN p_id_empresa INT
)
BEGIN
    SELECT 
        e.cnpj, e.razao_social, e.site, e.setor, e.local, e.tamanho,
        u.email, u.foto, u.descricao, u.data_criacao
    FROM empresas e
    JOIN usuarios u ON e.id_empresa = u.id_usuario
    WHERE e.id_empresa = p_id_empresa;
END //
DELIMITER ;

-- Buscar candidato por id
DELIMITER //
CREATE PROCEDURE buscar_candidato_por_id(
    IN p_id_candidato INT
)
BEGIN
    SELECT u.id_usuario, u.nome, u.email, c.cpf, u.descricao, u.foto, u.data_criacao as data_cadastro, c.curriculo_link
    FROM usuarios u
    JOIN candidatos c ON u.id_usuario = c.id_candidato
    WHERE u.id_usuario = p_id_candidato;
END //
DELIMITER ;

-- Buscar foto por usuário
DELIMITER //
CREATE PROCEDURE buscar_foto_por_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT foto FROM usuarios WHERE id_usuario = p_id_usuario;
END //
DELIMITER ;

-- Atualizar foto do usuário
DELIMITER //
CREATE PROCEDURE atualizar_foto_usuario(
    IN p_id_usuario INT,
    IN p_foto_url VARCHAR(255)
)
BEGIN
    UPDATE usuarios SET foto = p_foto_url WHERE id_usuario = p_id_usuario;
END //
DELIMITER ;

-- Atualizar empresa
DELIMITER //
CREATE PROCEDURE atualizar_empresa(
    IN p_id_empresa INT,
    IN p_cnpj VARCHAR(18),
    IN p_razao_social VARCHAR(150),
    IN p_site VARCHAR(200),
    IN p_setor VARCHAR(100),
    IN p_local VARCHAR(100),
    IN p_tamanho ENUM('Pequena', 'Média', 'Grande'),
    IN p_email VARCHAR(100),
    IN p_descricao TEXT
)
BEGIN
    UPDATE empresas 
    SET cnpj = p_cnpj, razao_social = p_razao_social, site = p_site, setor = p_setor, local = p_local, tamanho = p_tamanho 
    WHERE id_empresa = p_id_empresa;
    UPDATE usuarios SET email = p_email, descricao = p_descricao WHERE id_usuario = p_id_empresa;
END //
DELIMITER ;

-- Atualizar candidato
DELIMITER //
CREATE PROCEDURE atualizar_candidato(
    IN p_id_candidato INT,
    IN p_nome VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_cpf VARCHAR(14),
    IN p_descricao_pessoal TEXT
)
BEGIN
    UPDATE usuarios SET nome = p_nome, email = p_email, descricao = p_descricao_pessoal WHERE id_usuario = p_id_candidato;
    UPDATE candidatos SET cpf = p_cpf WHERE id_candidato = p_id_candidato;
END //
DELIMITER ;

-- Buscar empresas aleatórias
DELIMITER //
CREATE PROCEDURE buscar_empresas_aleatorias()
BEGIN
    SELECT e.*, u.foto 
    FROM empresas e
    JOIN usuarios u ON e.id_empresa = u.id_usuario
    ORDER BY RAND()
    LIMIT 10;
END //
DELIMITER ;

-- Buscar vagas por empresa
DELIMITER //
CREATE PROCEDURE buscar_vagas_por_empresa(IN p_id_empresa INT)
BEGIN
    SELECT * FROM vagas WHERE id_empresa = p_id_empresa;
END //
DELIMITER ;

-- Buscar vaga por id
DELIMITER //
CREATE PROCEDURE buscar_vaga_por_id(IN p_id_vaga INT)
BEGIN
    SELECT * FROM vagas WHERE id_vaga = p_id_vaga;
END //
DELIMITER ;

-- Buscar habilidades por vaga
DELIMITER //
CREATE PROCEDURE buscar_habilidades_por_vaga(
    IN p_id_vaga INT
)
BEGIN
    SELECT h.id_habilidade, h.nome, hv.obrigatoria
    FROM habilidades_vagas hv
    JOIN habilidades h ON hv.id_habilidade = h.id_habilidade
    WHERE hv.id_vaga = p_id_vaga;
END //
DELIMITER ;

-- buscar vagas aleatorias
DELIMITER //
CREATE PROCEDURE buscar_vagas_aleatorias(
    IN p_id_candidato INT
)
BEGIN
    SELECT v.*, e.razao_social, u.foto
    FROM vagas v
    JOIN empresas e ON v.id_empresa = e.id_empresa
    JOIN usuarios u ON v.id_empresa = u.id_usuario
    WHERE v.id_vaga NOT IN (SELECT id_vaga FROM candidaturas WHERE id_candidato = p_id_candidato)
    ORDER BY RAND() 
    LIMIT 10;
END //
DELIMITER ;

-- buscar vagas por habilidades
DELIMITER //
CREATE PROCEDURE buscar_vagas_por_habilidades(
    IN p_habilidades VARCHAR(255),
    IN p_id_candidato INT
)
BEGIN
    SELECT
        v.*,
        e.razao_social,
        u.foto,
        COUNT(DISTINCT hv.id_habilidade) AS matching_skills,
        (SELECT COUNT(*) FROM habilidades_vagas WHERE id_vaga = v.id_vaga) AS total_skills
    FROM vagas v
    JOIN empresas e ON v.id_empresa = e.id_empresa
    JOIN usuarios u ON v.id_empresa = u.id_usuario
    JOIN habilidades_vagas hv ON v.id_vaga = hv.id_vaga
    WHERE FIND_IN_SET(hv.id_habilidade, p_habilidades) 
      AND v.id_vaga NOT IN (SELECT id_vaga FROM candidaturas WHERE id_candidato = p_id_candidato)
    GROUP BY v.id_vaga
    ORDER BY
        (matching_skills / total_skills) DESC,
        matching_skills DESC;
END //
DELIMITER ;

-- buscar id_habilidades por candidato
DELIMITER //
CREATE PROCEDURE buscar_id_habilidades_por_candidato(
    IN p_id_candidato INT
)
BEGIN
    SELECT id_habilidade
    FROM habilidades_candidatos
    WHERE id_candidato = p_id_candidato;
END //
DELIMITER ;

-- Buscar currículo por candidato
DELIMITER //
CREATE PROCEDURE buscar_curriculo_por_candidato(
    IN p_id_candidato INT
)
BEGIN
    SELECT curriculo_link FROM candidatos WHERE id_candidato = p_id_candidato;
END //
DELIMITER ;

-- Atualizar currículo do candidato
DELIMITER //
CREATE PROCEDURE atualizar_curriculo_candidato(
    IN p_id_candidato INT,
    IN p_curriculo_link VARCHAR(255)
)
BEGIN
    UPDATE candidatos SET curriculo_link = p_curriculo_link WHERE id_candidato = p_id_candidato;
END //
DELIMITER ;

-- Buscar habilidades por candidato
DELIMITER //
CREATE PROCEDURE buscar_habilidades_por_candidato(
    IN p_id_candidato INT
)
BEGIN
    SELECT h.id_habilidade, h.nome
    FROM habilidades_candidatos hc
    JOIN habilidades h ON hc.id_habilidade = h.id_habilidade
    WHERE hc.id_candidato = p_id_candidato;
END //
DELIMITER ;

-- Atualizar habilidades do candidato
DELIMITER //
CREATE PROCEDURE atualizar_habilidades_candidato(
    IN p_id_candidato INT,
    IN p_habilidades_ids TEXT -- Comma-separated list of skill IDs
)
BEGIN
    DECLARE current_id_str VARCHAR(10);
    DECLARE remaining_ids TEXT;

    -- 1. Remove todas as habilidades existentes para este candidato
    DELETE FROM habilidades_candidatos WHERE id_candidato = p_id_candidato;

    -- 2. Insere as novas habilidades se a lista não for vazia
    SET remaining_ids = p_habilidades_ids;
    WHILE LENGTH(remaining_ids) > 0 DO
        SET current_id_str = SUBSTRING_INDEX(remaining_ids, ',', 1);
        
        INSERT INTO habilidades_candidatos (id_candidato, id_habilidade, nivel)
        VALUES (p_id_candidato, CAST(current_id_str AS UNSIGNED), 'Intermediário');

        SET remaining_ids = SUBSTRING(remaining_ids, LENGTH(current_id_str) + 2);
    END WHILE;
END //
DELIMITER ;

-- Deletar vaga por id
DELIMITER //
CREATE PROCEDURE deletar_vaga_por_id(
    IN p_id_vaga INT
)
BEGIN
    -- Deleta as candidaturas associadas à vaga
    DELETE FROM candidaturas WHERE id_vaga = p_id_vaga;
    -- Deleta as habilidades associadas à vaga
    DELETE FROM habilidades_vagas WHERE id_vaga = p_id_vaga;
    -- Deleta a vaga
    DELETE FROM vagas WHERE id_vaga = p_id_vaga;
END //
DELIMITER ;

-- Buscar candidatos por vaga com detalhes de habilidades
DELIMITER //
CREATE PROCEDURE buscar_candidatos_por_vaga(
    IN p_id_vaga INT
)
BEGIN
    SELECT 
        u.id_usuario AS id_candidato,
        u.nome,
        u.foto,
        -- Contagem de habilidades exigidas que o candidato possui
        (SELECT COUNT(*)
         FROM habilidades_candidatos hc
         JOIN habilidades_vagas hv ON hc.id_habilidade = hv.id_habilidade
         WHERE hc.id_candidato = u.id_usuario AND hv.id_vaga = p_id_vaga AND hv.obrigatoria = TRUE) AS num_habilidades_exigidas,

        -- Contagem de habilidades diferenciais que o candidato possui
        (SELECT COUNT(*)
         FROM habilidades_candidatos hc
         JOIN habilidades_vagas hv ON hc.id_habilidade = hv.id_habilidade
         WHERE hc.id_candidato = u.id_usuario AND hv.id_vaga = p_id_vaga AND hv.obrigatoria = FALSE) AS num_habilidades_diferenciais,

        -- Habilidades Exigidas: O candidato tem e a vaga exige como obrigatória.
        (SELECT GROUP_CONCAT(h.nome SEPARATOR ', ')
         FROM habilidades h
         JOIN habilidades_candidatos hc ON h.id_habilidade = hc.id_habilidade
         JOIN habilidades_vagas hv ON h.id_habilidade = hv.id_habilidade
         WHERE hc.id_candidato = u.id_usuario AND hv.id_vaga = p_id_vaga AND hv.obrigatoria = TRUE) AS HabilidadesExigidas,

        -- Habilidades Diferenciais: O candidato tem e a vaga lista como diferencial.
        (SELECT GROUP_CONCAT(h.nome SEPARATOR ', ')
         FROM habilidades h
         JOIN habilidades_candidatos hc ON h.id_habilidade = hc.id_habilidade
         JOIN habilidades_vagas hv ON h.id_habilidade = hv.id_habilidade
         WHERE hc.id_candidato = u.id_usuario AND hv.id_vaga = p_id_vaga AND hv.obrigatoria = FALSE) AS HabilidadesDiferenciais,

        -- Habilidades Extra: O candidato tem, mas a vaga não lista.
        (SELECT GROUP_CONCAT(h.nome SEPARATOR ', ')
         FROM habilidades h
         JOIN habilidades_candidatos hc ON h.id_habilidade = hc.id_habilidade
         WHERE hc.id_candidato = u.id_usuario AND h.id_habilidade NOT IN (SELECT id_habilidade FROM habilidades_vagas WHERE id_vaga = p_id_vaga)) AS HabilidadesExtra,

        -- Habilidades Faltantes: A vaga exige como obrigatória, mas o candidato não tem.
        (SELECT GROUP_CONCAT(h.nome SEPARATOR ', ')
         FROM habilidades h
         JOIN habilidades_vagas hv ON h.id_habilidade = hv.id_habilidade
         WHERE hv.id_vaga = p_id_vaga AND hv.obrigatoria = TRUE AND h.id_habilidade NOT IN (SELECT id_habilidade FROM habilidades_candidatos WHERE id_candidato = u.id_usuario)) AS HabilidadesFaltantes

    FROM candidaturas c
    JOIN usuarios u ON c.id_candidato = u.id_usuario
    WHERE c.id_vaga = p_id_vaga
    ORDER BY num_habilidades_exigidas DESC, num_habilidades_diferenciais DESC;
END //
DELIMITER ;

-- Buscar todas as informações de habilidades por candidato
DELIMITER //
CREATE PROCEDURE buscar_todas_informacoes_habilidades_por_candidato(
    IN p_id_candidato INT
)
BEGIN
    SELECT h.*, hc.nivel
    FROM habilidades h
    JOIN habilidades_candidatos hc ON h.id_habilidade = hc.id_habilidade
    WHERE hc.id_candidato = p_id_candidato;
END //
DELIMITER ;

-- Buscar informações do candidato
DELIMITER //
CREATE PROCEDURE buscar_informacoes_do_candidato(
    IN p_id_candidato INT
)
BEGIN
    SELECT 
        u.foto, 
        u.nome, 
        u.email, 
        u.descricao, 
        u.data_criacao, 
        c.curriculo_link
    FROM usuarios u
    JOIN candidatos c ON u.id_usuario = c.id_candidato
    WHERE u.id_usuario = p_id_candidato;
END //
DELIMITER ;

-- Atualizar vaga por id
DELIMITER //
CREATE PROCEDURE atualizar_vaga_por_id(
    IN p_id_vaga INT,
    IN p_titulo VARCHAR(150),
    IN p_descricao TEXT,
    IN p_localizacao VARCHAR(150),
    IN p_modalidade VARCHAR(100),
    IN p_salario VARCHAR(50)
)
BEGIN
    UPDATE vagas 
    SET 
        titulo = p_titulo, descricao = p_descricao, localizacao = p_localizacao, 
        modalidade = p_modalidade, salario = p_salario
    WHERE id_vaga = p_id_vaga;
END //
DELIMITER ;

-- Atualizar habilidades da vaga
DELIMITER //
CREATE PROCEDURE atualizar_habilidades_vaga(
    IN p_id_vaga INT,
    IN p_habilidades_obrigatorias TEXT, -- Comma-separated list of required skill IDs
    IN p_habilidades_diferenciais TEXT -- Comma-separated list of differential skill IDs
)
BEGIN
    DECLARE current_id_str VARCHAR(10);
    DECLARE remaining_ids TEXT;

    -- 1. Remove all existing skills for this vacancy
    DELETE FROM habilidades_vagas WHERE id_vaga = p_id_vaga;

    -- 2. Insert the new required skills if the list is not empty
    IF p_habilidades_obrigatorias IS NOT NULL AND LENGTH(p_habilidades_obrigatorias) > 0 THEN
        SET remaining_ids = p_habilidades_obrigatorias;
        WHILE LENGTH(remaining_ids) > 0 DO
            SET current_id_str = SUBSTRING_INDEX(remaining_ids, ',', 1);
            
            INSERT INTO habilidades_vagas (id_vaga, id_habilidade, obrigatoria)
            VALUES (p_id_vaga, CAST(current_id_str AS UNSIGNED), TRUE);

            IF LOCATE(',', remaining_ids) > 0 THEN
                SET remaining_ids = SUBSTRING(remaining_ids, LENGTH(current_id_str) + 2);
            ELSE
                SET remaining_ids = '';
            END IF;
        END WHILE;
    END IF;

    -- 3. Insert the new differential skills if the list is not empty
    IF p_habilidades_diferenciais IS NOT NULL AND LENGTH(p_habilidades_diferenciais) > 0 THEN
        SET remaining_ids = p_habilidades_diferenciais;
        WHILE LENGTH(remaining_ids) > 0 DO
            SET current_id_str = SUBSTRING_INDEX(remaining_ids, ',', 1);
            
            INSERT INTO habilidades_vagas (id_vaga, id_habilidade, obrigatoria)
            VALUES (p_id_vaga, CAST(current_id_str AS UNSIGNED), FALSE);

            IF LOCATE(',', remaining_ids) > 0 THEN
                SET remaining_ids = SUBSTRING(remaining_ids, LENGTH(current_id_str) + 2);
            ELSE
                SET remaining_ids = '';
            END IF;
        END WHILE;
    END IF;
END //
DELIMITER ;

-- Deletar todas as candidaturas para uma vaga
DELIMITER //
CREATE PROCEDURE deletar_todas_candidaturas_para_vaga(
    IN p_id_vaga INT
)
BEGIN
    DELETE FROM candidaturas WHERE id_vaga = p_id_vaga;
END //
DELIMITER ;