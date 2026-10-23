-- Executar pelo Flyway, em transacao, com a aplicacao parada e backup disponivel.
CREATE TABLE status_membro (
    cod_status SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cor VARCHAR(7) NOT NULL
);

INSERT INTO status_membro (nome, cor) VALUES
    ('Outra Igreja', '#1d4ed8'),
    ('Afastado', '#b91c1c'),
    ('Ativo', '#15803d'),
    ('Distante', '#a16207');

ALTER TABLE membro ADD COLUMN cod_status INTEGER;

UPDATE membro m
SET cod_status = s.cod_status
FROM status_membro s
WHERE s.nome = CASE m.status
    WHEN 'OUTRA_IGREJA' THEN 'Outra Igreja'
    WHEN 'AFASTADO' THEN 'Afastado'
    WHEN 'ATIVO' THEN 'Ativo'
    WHEN 'DISTANTE' THEN 'Distante'
END;

-- Nao descartar valores desconhecidos ou alterar status nulos existentes.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM membro WHERE status IS NOT NULL AND cod_status IS NULL) THEN
        RAISE EXCEPTION 'Existem status sem correspondencia; migracao cancelada sem descartar dados';
    END IF;
END $$;

ALTER TABLE membro ADD CONSTRAINT fk_membro_status
    FOREIGN KEY (cod_status) REFERENCES status_membro(cod_status) ON DELETE RESTRICT;
CREATE INDEX idx_membro_cod_status ON membro(cod_status);

ALTER TABLE membro DROP COLUMN status;
