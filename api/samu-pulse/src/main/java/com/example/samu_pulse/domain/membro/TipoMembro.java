package com.example.samu_pulse.domain.membro;

import lombok.Getter;

@Getter
public enum TipoMembro {
    NOVO_CONVERTIDO("NOVO_CONVERTIDO"),
    MEMBRO("MEMBRO");

    private final String tipoMembro;

    TipoMembro(String tipoMembro) {
        this.tipoMembro = tipoMembro;
    }
}
