package com.example.samu_pulse.domain.usuario.dto;

import com.example.samu_pulse.domain.usuario.Usuario;

public record PerfilResponse(String nomeExibicao, String perfilResponsavel) {
    public PerfilResponse(Usuario usuario) {
        this(usuario.getNomeExibicao(), usuario.getPerfilResponsavel());
    }
}
