package com.example.samu_pulse.domain.usuario.dto;

import com.example.samu_pulse.domain.usuario.TipoUsuario;
import jakarta.validation.constraints.NotNull;

public record DadosAcessoUsuarioUpdate(
        @NotNull(message = "Informe a permissão do usuário") TipoUsuario tipoUsuario,
        @NotNull(message = "Informe se o usuário está ativo") Boolean ativo
) {
}
