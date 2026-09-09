package com.example.samu_pulse.domain.historico_mensagem.dto;

import com.example.samu_pulse.domain.historico_mensagem.HistoricoMensagem;
import java.time.LocalDateTime;

public record HistoricoMensagemResponse(
        Long id,
        Integer idMembro,
        String nomeExibicao,
        String perfilResponsavel,
        String mensagem,
        LocalDateTime dataRegistro,
        LocalDateTime dataAlteracao,
        boolean podeAlterar
) {
    public HistoricoMensagemResponse(HistoricoMensagem historico, Integer idUsuarioAutenticado) {
        this(historico.getId(), historico.getMembro().getId(), historico.getUsuario().getNomeExibicao(),
                historico.getPerfilResponsavel(), historico.getMensagem(), historico.getDataRegistro(),
                historico.getDataAlteracao(), historico.getUsuario().getId().equals(idUsuarioAutenticado));
    }
}
