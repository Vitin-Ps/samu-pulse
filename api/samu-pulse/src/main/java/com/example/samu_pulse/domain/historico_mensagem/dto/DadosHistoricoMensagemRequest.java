package com.example.samu_pulse.domain.historico_mensagem.dto;

import jakarta.validation.constraints.NotBlank;

public record DadosHistoricoMensagemRequest(
        @NotBlank(message = "Mensagem não pode estar vazia!")
        String mensagem
) {
}
