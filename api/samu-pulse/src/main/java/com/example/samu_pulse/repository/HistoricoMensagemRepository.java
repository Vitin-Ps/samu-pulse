package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.historico_mensagem.HistoricoMensagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoricoMensagemRepository extends JpaRepository<HistoricoMensagem, Long> {
}
