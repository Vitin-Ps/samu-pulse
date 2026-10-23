package com.example.samu_pulse.domain.usuario.dto;

import com.example.samu_pulse.domain.usuario.TipoUsuario;
import com.example.samu_pulse.domain.usuario.Usuario;

public record UsuarioAdminResponse(Integer id, String login, String nomeExibicao,
                                   String perfilResponsavel, TipoUsuario tipoUsuario, Boolean ativo) {
    public UsuarioAdminResponse(Usuario usuario) {
        this(usuario.getId(), usuario.getLogin(), usuario.getNomeExibicao(), usuario.getPerfilResponsavel(),
                usuario.getTipoUsuario(), usuario.getAtivo());
    }
}
