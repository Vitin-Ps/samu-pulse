package com.example.samu_pulse.domain.historico_mensagem;

import com.example.samu_pulse.domain.historico_mensagem.dto.DadosHistoricoMensagemRequest;
import com.example.samu_pulse.domain.historico_mensagem.dto.HistoricoMensagemResponse;
import com.example.samu_pulse.domain.membro.Membro;
import com.example.samu_pulse.domain.usuario.Usuario;
import com.example.samu_pulse.repository.HistoricoMensagemRepository;
import com.example.samu_pulse.repository.MembroRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@PreAuthorize("isAuthenticated()")
public class HistoricoMensagemService {
    @Autowired
    private HistoricoMensagemRepository historicoMensagemRepository;

    @Autowired
    private MembroRepository membroRepository;

    @Transactional(readOnly = true)
    public Page<HistoricoMensagemResponse> listarMensagens(Integer idMembro, Pageable pageable) {
        buscarMembroAtivo(idMembro);
        return historicoMensagemRepository.findAllByMembroId(idMembro, pageable)
                .map(HistoricoMensagemResponse::new);
    }

    public HistoricoMensagemResponse criarMensagem(Integer idMembro, DadosHistoricoMensagemRequest dados) {
        Membro membro = buscarMembroAtivo(idMembro);
        HistoricoMensagem historico = new HistoricoMensagem(membro, usuarioAutenticado(), dados.mensagem());
        historicoMensagemRepository.save(historico);
        return new HistoricoMensagemResponse(historico);
    }

    public HistoricoMensagemResponse editarMensagem(Integer idMembro, Long id, DadosHistoricoMensagemRequest dados) {
        HistoricoMensagem historico = buscarMensagemDoAutor(idMembro, id);
        historico.atualizarMensagem(dados.mensagem());
        return new HistoricoMensagemResponse(historico);
    }

    public void excluirMensagem(Integer idMembro, Long id) {
        HistoricoMensagem historico = buscarMensagemDoAutor(idMembro, id);
        historicoMensagemRepository.delete(historico);
    }

    private Membro buscarMembroAtivo(Integer idMembro) {
        return membroRepository.findById(idMembro)
                .filter(membro -> Boolean.TRUE.equals(membro.getAtivo()))
                .orElseThrow(EntityNotFoundException::new);
    }

    private HistoricoMensagem buscarMensagemDoAutor(Integer idMembro, Long id) {
        buscarMembroAtivo(idMembro);
        HistoricoMensagem historico = historicoMensagemRepository.findByIdAndMembroId(id, idMembro)
                .orElseThrow(EntityNotFoundException::new);
        if (!usuarioAutenticado().getId().equals(historico.getUsuario().getId())) {
            throw new AccessDeniedException("Somente o autor pode alterar ou excluir a mensagem!");
        }
        return historico;
    }

    private Usuario usuarioAutenticado() {
        var autenticacao = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacao == null || !autenticacao.isAuthenticated()
                || !(autenticacao.getPrincipal() instanceof Usuario usuario) || usuario.getId() == null) {
            throw new AccessDeniedException("Usuário não autenticado!");
        }
        return usuario;
    }
}
