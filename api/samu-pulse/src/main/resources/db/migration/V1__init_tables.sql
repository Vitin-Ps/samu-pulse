CREATE TABLE usuario (
     id SERIAL PRIMARY KEY,
     login VARCHAR(100) NOT NULL UNIQUE,
     senha VARCHAR(255) NOT NULL,
     perfil_responsavel VARCHAR(255) NOT NULL
);

CREATE TABLE novo_convertido (
     id SERIAL PRIMARY KEY,
     nome VARCHAR(255) NOT NULL,
     telefone VARCHAR(20),
     data_conversao DATE,
     tipo_conversao VARCHAR(15),
     is_batizado BOOLEAN,
     endereco VARCHAR(255),
     observacao TEXT,
     data_ultimo_contato TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE historico_mensagem (
    id BIGSERIAL PRIMARY KEY,
    id_novo_convertido INT NOT NULL,
    id_usuario INT NOT NULL,
    perfil_responsavel VARCHAR(255) NOT NULL,
    data_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mensagem TEXT,

    CONSTRAINT fk_historico_mensagem_novo_convertido
        FOREIGN KEY (id_novo_convertido) REFERENCES novo_convertido(id) ON DELETE CASCADE,
    CONSTRAINT fk_historico_mensagem_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);