package com.example.samu_pulse.domain.membro;

import lombok.Getter;

@Getter
public enum StatusMembro {
    OUTRA_IGREJA("OUTRA_IGREJA"),
    AFASTADO("AFASTADO"),
    ATIVO("ATIVO"),
    DISTANTE("DISTANTE");

    private final String statusMembro;

    StatusMembro(String statusMembro) {
        this.statusMembro = statusMembro;
    }
}
