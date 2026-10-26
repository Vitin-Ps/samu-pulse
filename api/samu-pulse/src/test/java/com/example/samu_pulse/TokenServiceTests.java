package com.example.samu_pulse;

import com.example.samu_pulse.domain.usuario.*;
import com.example.samu_pulse.infra.security.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import java.time.Duration;
import java.time.Instant;
import static org.assertj.core.api.Assertions.assertThat;

class TokenServiceTests {
    @Test
    void jwtValidoPorSeteDias() {
        TokenService service = new TokenService();
        ReflectionTestUtils.setField(service, "secret", "chave-de-teste-com-mais-de-trinta-e-dois-caracteres");
        ReflectionTestUtils.setField(service, "expirationMs", Duration.ofDays(7).toMillis());
        Usuario usuario = new Usuario("lider", "hash", "Líder", TipoUsuario.LIDER, "Nome");
        usuario.setId(1);
        Instant antes = Instant.now();
        String token = service.gerarToken(usuario);
        Instant depois = Instant.now();
        assertThat(service.extractAllClaims(token).getExpiresAtAsInstant())
                .isBetween(antes.plus(Duration.ofDays(7)).minusSeconds(1), depois.plus(Duration.ofDays(7)));
        assertThat(service.validaToken(token)).isEqualTo("lider");
    }

    @Test
    void expiracaoRespeitaConfiguracaoEmVezDeValorFixo() {
        TokenService service = new TokenService();
        ReflectionTestUtils.setField(service, "secret", "chave-de-teste-com-mais-de-trinta-e-dois-caracteres");
        ReflectionTestUtils.setField(service, "expirationMs", Duration.ofHours(1).toMillis());
        Usuario usuario = new Usuario("lider", "hash", "Líder", TipoUsuario.LIDER, "Nome");
        usuario.setId(1);
        Instant agora = Instant.now();
        assertThat(service.extractAllClaims(service.gerarToken(usuario)).getExpiresAtAsInstant())
                .isBetween(agora.plusSeconds(3599), Instant.now().plusSeconds(3601));
    }
}
