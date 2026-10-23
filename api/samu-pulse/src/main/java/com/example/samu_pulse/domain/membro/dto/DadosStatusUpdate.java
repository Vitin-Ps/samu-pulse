package com.example.samu_pulse.domain.membro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record DadosStatusUpdate(
        @NotBlank(message = "Nome não pode ser vazio") @Size(max = 255) String nome,
        @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Informe uma cor hexadecimal válida") String cor
) {
}
