package com.example.samu_pulse.domain.usuario;

import lombok.Getter;

@Getter
public enum TipoUsuario {
    ADMIN("ADMIN"),
    LIDER("LIDER"),
    USER("USER");

    private final String tipoUsuario;

    TipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

}
