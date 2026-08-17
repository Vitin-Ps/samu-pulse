package com.example.samu_pulse.domain.membro;

import lombok.Getter;

@Getter
public enum TipoConversao {
    ACEITANDO("ACEITANDO"),
    RECONCILIANDO("RECONCILIANDO");

    private final String tipoConversao;

    TipoConversao(String tipoConversao) {
        this.tipoConversao = tipoConversao;
    }
}
