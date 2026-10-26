package com.example.samu_pulse.domain.usuario;

import org.springframework.stereotype.Service;
import com.example.samu_pulse.domain.usuario.dto.DadosPerfilUpdate;
import com.example.samu_pulse.domain.usuario.dto.PerfilResponse;
import com.example.samu_pulse.domain.usuario.dto.UsuarioAdminResponse;
import com.example.samu_pulse.domain.usuario.dto.DadosAcessoUsuarioUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UsuarioAdminResponse> listarUsuarios(String search, Pageable pageable) {
        return usuarioRepository.pesquisarUsuarios(search, pageable).map(UsuarioAdminResponse::new);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public UsuarioAdminResponse atualizarAcesso(Integer id, DadosAcessoUsuarioUpdate dados) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        if (id.equals(usuarioAutenticado().getId()) && dados.tipoUsuario() != usuario.getTipoUsuario()) {
            throw new com.example.samu_pulse.infra.exception.ApiException("Você não pode alterar seu próprio tipo de usuário.");
        }
        usuario.setTipoUsuario(dados.tipoUsuario());
        usuario.setAtivo(dados.ativo());
        return new UsuarioAdminResponse(usuario);
    }

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
        if (dados.email() != null) {
            String email = dados.email().isBlank() ? null : dados.email().strip();
            if (email != null && usuarioRepository.existsByEmailIgnoreCaseAndAtivoTrueAndIdNot(email, usuario.getId()))
                throw new com.example.samu_pulse.infra.exception.ApiException("E-mail já cadastrado!");
            usuario.setEmail(email);
        }
        return new PerfilResponse(usuario);
    }
}
