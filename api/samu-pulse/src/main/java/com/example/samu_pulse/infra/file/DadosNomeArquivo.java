package com.example.samu_pulse.infra.file;

import jakarta.validation.constraints.NotBlank;

public record DadosNomeArquivo(
        @NotBlank(message = "Nome do arquivo é necessário!")
        String nomeArquivo) {
}
