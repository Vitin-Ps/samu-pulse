package com.example.samu_pulse.infra.security;

import com.example.samu_pulse.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UsuarioRepository repository;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var tokenJWT = this.recuperarToken(request);
        if (tokenJWT != null) {
            var subject = tokenService.validaToken(tokenJWT);
            var usuario = repository.findByLogin(subject);
            var autenticacao = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(autenticacao);
        }

        // Adicione um log para verificar o início e o fim do filtro
        filterChain.doFilter(request, response);
    }

    public String recuperarToken(HttpServletRequest request) {
        var autorizacaoHeader = request.getHeader("Authorization");
        if (autorizacaoHeader != null) return autorizacaoHeader.replace("Bearer ", "");
        else return null;
    }
}
