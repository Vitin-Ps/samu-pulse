package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.membro.StatusMembro;
import com.example.samu_pulse.domain.membro.dto.StatusMembroResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StatusMembroRepository extends JpaRepository<StatusMembro, Integer> {
    @Query("""
            SELECT new com.example.samu_pulse.domain.membro.dto.StatusMembroResponse(
                s.codStatus, s.nome, s.cor, COUNT(m.id))
            FROM StatusMembro s LEFT JOIN Membro m ON m.status = s
            GROUP BY s.codStatus, s.nome, s.cor ORDER BY s.codStatus
            """)
    List<StatusMembroResponse> listarComAssociacoes();
}
