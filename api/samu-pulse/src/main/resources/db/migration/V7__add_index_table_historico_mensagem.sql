-- A tabela e suas FKs já foram criadas na V1. O índice atende à consulta
-- paginada do histórico de um membro, da mensagem mais recente à mais antiga.
CREATE INDEX idx_historico_mensagem_membro_data_registro
    ON historico_mensagem (id_membro, data_registro DESC, id DESC);
