package com.example.samu_pulse.domain.usuario.dto;

import com.example.samu_pulse.domain.usuario.TipoUsuario;
import com.example.samu_pulse.domain.usuario.Usuario;

public record UsuarioResponse(
        String login,
        String perfilResponsavel,
        TipoUsuario tipoUsuario
) {
    public UsuarioResponse(Usuario usuario) {
        this(usuario.getLogin(), usuario.getPerfilResponsavel(), usuario.getTipoUsuario());
    }
}
