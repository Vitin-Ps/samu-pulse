package com.example.samu_pulse.domain.membro.dto;

import com.example.samu_pulse.domain.membro.StatusMembro;

public record StatusMembroResponse(Integer cod_status, String nome, String cor, Long membrosAssociados) {
    public StatusMembroResponse(StatusMembro status) {
        this(status.getCodStatus(), status.getNome(), status.getCor(), null);
    }
}
