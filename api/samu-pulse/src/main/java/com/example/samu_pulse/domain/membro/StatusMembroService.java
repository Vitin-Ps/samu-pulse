package com.example.samu_pulse.domain.membro;

import com.example.samu_pulse.domain.membro.dto.DadosStatusRequest;
import com.example.samu_pulse.domain.membro.dto.DadosStatusUpdate;
import com.example.samu_pulse.domain.membro.dto.StatusMembroResponse;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.repository.MembroRepository;
import com.example.samu_pulse.repository.StatusMembroRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusMembroService {
    @Autowired
    private StatusMembroRepository statusRepository;
    @Autowired
    private MembroRepository membroRepository;

    public List<StatusMembroResponse> listar() {
        return statusRepository.listarComAssociacoes();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public StatusMembroResponse atualizar(Integer codStatus, DadosStatusUpdate dados) {
        StatusMembro status = statusRepository.findById(codStatus).orElseThrow(EntityNotFoundException::new);
        status.setNome(dados.nome());
        if (dados.cor() != null) status.setCor(dados.cor());
        return new StatusMembroResponse(status);
    }

    public StatusMembro buscar(Integer codStatus) {
        if (codStatus == null) throw new ApiException("Informe o status do membro!");
        return statusRepository.findById(codStatus)
                .orElseThrow(() -> new ApiException("Status não encontrado!"));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public StatusMembroResponse criar(DadosStatusRequest dados) {
        return new StatusMembroResponse(statusRepository.save(new StatusMembro(null, dados.nome(), dados.cor())));
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void excluir(Integer codStatus) {
        StatusMembro status = statusRepository.findById(codStatus).orElseThrow(EntityNotFoundException::new);
        if (membroRepository.existsByStatus_CodStatus(codStatus)) {
            throw new ApiException("Não é possível excluir um status associado a membros!");
        }
        try {
            statusRepository.delete(status);
            statusRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ApiException("Não é possível excluir um status associado a membros!");
        }
    }
}
