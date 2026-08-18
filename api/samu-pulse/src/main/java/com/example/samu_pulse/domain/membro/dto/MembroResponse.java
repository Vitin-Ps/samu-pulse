package com.example.samu_pulse.domain.membro.dto;

import com.example.samu_pulse.domain.membro.Membro;
import com.example.samu_pulse.domain.membro.TipoConversao;
import com.example.samu_pulse.domain.membro.TipoMembro;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MembroResponse(
        Integer id,
        String nome,
        LocalDate dataConversao,
        LocalDate dataNascimento,
        Boolean isBatizado,
        TipoConversao tipoConversao,
        String endereco,
        String telefone,
        String observacao,
        LocalDateTime dataUltimoContato,
        TipoMembro tipo,
        String imagemUrl
) {
    public MembroResponse(Membro membro) {
        this(membro.getId(), membro.getNome(), membro.getDataConversao(), membro.getDataNascimento(),
                membro.getIsBatizado(), membro.getTipoConversao(), membro.getEndereco(), membro.getTelefone(),
                membro.getObservacao(), membro.getDataUltimoContato(), membro.getTipo(), membro.getImagemUrl());
    }
}
