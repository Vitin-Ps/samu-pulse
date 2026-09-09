package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.historico_mensagem.HistoricoMensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface HistoricoMensagemRepository extends JpaRepository<HistoricoMensagem, Long> {
    @EntityGraph(attributePaths = {"usuario", "membro"})
    Page<HistoricoMensagem> findAllByMembroId(Integer idMembro, Pageable pageable);

    Optional<HistoricoMensagem> findByIdAndMembroId(Long id, Integer idMembro);
}
