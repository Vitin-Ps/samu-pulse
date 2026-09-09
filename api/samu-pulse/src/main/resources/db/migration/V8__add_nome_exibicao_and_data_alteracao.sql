-- Nomes reais não podem ser inferidos do login ou do perfil. Contas existentes
-- preencherão o nome em Meu perfil; nenhum dado de autenticação é copiado.
ALTER TABLE usuario ADD COLUMN nome_exibicao VARCHAR(255);
ALTER TABLE usuario ADD CONSTRAINT ck_usuario_nome_exibicao
    CHECK (nome_exibicao IS NULL OR LENGTH(TRIM(nome_exibicao)) > 0);

ALTER TABLE historico_mensagem ADD COLUMN data_alteracao TIMESTAMP;
ALTER TABLE historico_mensagem ADD CONSTRAINT ck_historico_mensagem_data_alteracao
    CHECK (data_alteracao IS NULL OR data_alteracao >= data_registro);
