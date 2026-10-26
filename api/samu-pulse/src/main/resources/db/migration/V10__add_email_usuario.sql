ALTER TABLE usuario ADD COLUMN email VARCHAR(255);
CREATE UNIQUE INDEX idx_usuario_email_ativo ON usuario (LOWER(email))
    WHERE ativo = TRUE AND email IS NOT NULL;
