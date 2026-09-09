package com.example.samu_pulse.domain.usuario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DadosPerfilUpdate(
        @NotBlank(message = "Nome de exibição não pode estar vazio!")
        @Size(max = 255, message = "Nome de exibição deve ter até 255 caracteres!")
        String nomeExibicao
) {
}
