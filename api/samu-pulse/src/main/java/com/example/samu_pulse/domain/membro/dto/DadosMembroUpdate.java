package com.example.samu_pulse.domain.membro.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DadosMembroUpdate(
        @NotNull(message = "Id não pode ser null")
        Long id,
        @NotBlank(message = "Nome não pode ser null")
        String nome,
        @NotBlank(message = "Telefone não pode ser null")
        String telefone,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataNascimento,
        String endereco,
        String observacao
) {
}
