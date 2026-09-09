package com.example.samu_pulse.domain.historico_mensagem.dto;

import com.example.samu_pulse.domain.historico_mensagem.HistoricoMensagem;
import com.example.samu_pulse.domain.usuario.dto.UsuarioResponse;
import java.time.LocalDateTime;

public record HistoricoMensagemResponse(
        Long id,
        Integer idMembro,
        Integer idUsuario,
        UsuarioResponse usuario,
        String perfilResponsavel,
        String mensagem,
        LocalDateTime dataRegistro
) {
    public HistoricoMensagemResponse(HistoricoMensagem historico) {
        this(historico.getId(), historico.getMembro().getId(), historico.getUsuario().getId(),
                new UsuarioResponse(historico.getUsuario()), historico.getPerfilResponsavel(),
                historico.getMensagem(), historico.getDataRegistro());
    }
}
