package com.example.samu_pulse.domain.usuario;

import jakarta.validation.constraints.NotBlank;

public record DadosAutenticacao(
        String login,
        @NotBlank(message = "Senha não pode ser null!")
        String senha,
        String senhaAcesso,
        String perfilResponsavel
) {
}
