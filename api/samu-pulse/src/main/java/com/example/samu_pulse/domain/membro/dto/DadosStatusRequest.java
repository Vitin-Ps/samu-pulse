package com.example.samu_pulse.domain.membro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DadosStatusRequest(
        @NotBlank(message = "Nome não pode ser vazio")
        @Size(max = 255)
        String nome,
        @NotBlank(message = "Cor não pode ser vazia")
        @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Informe uma cor hexadecimal válida")
        String cor
) {
}
