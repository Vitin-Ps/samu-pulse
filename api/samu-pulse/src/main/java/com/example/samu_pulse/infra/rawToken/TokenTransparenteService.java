package com.example.samu_pulse.infra.rawToken;

import com.example.samu_pulse.domain.usuario.Usuario;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.repository.UsuarioRepository;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.token.KeyBasedPersistenceTokenService;
import org.springframework.security.core.token.SecureRandomFactoryBean;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

@Service
public class TokenTransparenteService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    private final Set<String> usedTokens = new HashSet<>();

    @SneakyThrows
    public String gerarToken(Usuario usuario) {
        return getInstanceFor(usuario).allocateToken(String.valueOf(usuario.getId())).getKey();
    }

    public synchronized void validaToken(String rawToken) {
        verificarToken(rawToken);
        usedTokens.add(rawToken);
    }

    public synchronized void verificarToken(String rawToken) {
        if (usedTokens.contains(rawToken)) throw new ApiException("Token já usado");
        try {
            var usuario = retornaUsuario(rawToken);
            getInstanceFor(usuario).verifyToken(rawToken);
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException("Token inválido");
        }
    }

    public Usuario retornaUsuario(String rawToken) {
        var publicData = readPublicData(rawToken);
        if (tempoExpirado(publicData)) throw new ApiException("Token Expirado");
        return usuarioRepository.findById(publicData.idusuario()).orElseThrow(() -> new ApiException("Token inválido"));
    }

    public KeyBasedPersistenceTokenService getInstanceFor(Usuario usuario) throws Exception {
        var tokenService = new KeyBasedPersistenceTokenService();
        tokenService.setServerSecret(usuario.getPassword());
        tokenService.setServerInteger(22);
        tokenService.setSecureRandom(new SecureRandomFactoryBean().getObject());
        return tokenService;
    }

    public boolean tempoExpirado(DadosTokenPublico dados) {
        return Instant.ofEpochMilli(dados.timestamp()).plus(Duration.ofHours(2)).isBefore(Instant.now());
    }

    public DadosTokenPublico readPublicData(String rawToken) {
        try {
            String[] parts = new String(Base64.getDecoder().decode(rawToken), StandardCharsets.UTF_8).split(":");
            return new DadosTokenPublico(Integer.valueOf(parts[2]), Long.valueOf(parts[0]));
        } catch (RuntimeException ex) {
            throw new ApiException("Token inválido");
        }
    }
}
