package com.example.samu_pulse.domain.usuario;

import org.springframework.stereotype.Service;
import com.example.samu_pulse.domain.usuario.dto.DadosPerfilUpdate;
import com.example.samu_pulse.domain.usuario.dto.PerfilResponse;
import com.example.samu_pulse.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

@Service
@PreAuthorize("isAuthenticated()")
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario usuarioAutenticado() {
        var autenticacao = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacao == null || !autenticacao.isAuthenticated()
                || !(autenticacao.getPrincipal() instanceof Usuario usuario) || usuario.getId() == null) {
            throw new AccessDeniedException("Usuário não autenticado!");
        }
        return usuario;
    }

    public PerfilResponse consultarPerfil() {
        return new PerfilResponse(usuarioAutenticado());
    }

    @Transactional
    public PerfilResponse atualizarPerfil(DadosPerfilUpdate dados) {
        Usuario usuario = usuarioRepository.findById(usuarioAutenticado().getId())
                .orElseThrow(EntityNotFoundException::new);
        usuario.setNomeExibicao(dados.nomeExibicao().strip());
        return new PerfilResponse(usuario);
    }
}
