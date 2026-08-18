package com.example.samu_pulse.domain.membro.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record DadosMembroRequest(
        String nome,
        String telefone,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataNascimento,
        String endereco,
        String observacao
) {
}
