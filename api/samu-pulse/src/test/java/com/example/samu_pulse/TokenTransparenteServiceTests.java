package com.example.samu_pulse;

import com.example.samu_pulse.domain.usuario.*;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.infra.rawToken.*;
import com.example.samu_pulse.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class TokenTransparenteServiceTests {
    TokenTransparenteService tokens;
    Usuario usuario;

    @BeforeEach
    void preparar() {
        tokens = new TokenTransparenteService();
        var repository = mock(UsuarioRepository.class);
        usuario = new Usuario("admin", "hash-da-senha", "Admin", TipoUsuario.ADMIN, "Administrador");
        usuario.setId(1);
        when(repository.findById(1)).thenReturn(Optional.of(usuario));
        ReflectionTestUtils.setField(tokens, "usuarioRepository", repository);
    }

    @Test
    void mantemFormatoAssinaturaEUsuarioDaReferencia() throws Exception {
        String token = tokens.gerarToken(usuario);
        assertThat(tokens.readPublicData(token).idusuario()).isEqualTo(1);
        assertThat(tokens.getInstanceFor(usuario).verifyToken(token).getExtendedInformation()).isEqualTo("1");
        assertThat(tokens.gerarToken(usuario)).isNotEqualTo(token);
    }

    @Test
    void consultaNaoConsomeMasValidacaoPermiteUmUnicoUso() {
        String token = tokens.gerarToken(usuario);
        tokens.verificarToken(token);
        tokens.verificarToken(token);
        tokens.validaToken(token);
        assertThatThrownBy(() -> tokens.validaToken(token)).isInstanceOf(ApiException.class).hasMessage("Token já usado");
    }

    @Test
    void duracaoEhDuasHoras() {
        assertThat(tokens.tempoExpirado(new DadosTokenPublico(1, Instant.now().minusSeconds(7199).toEpochMilli()))).isFalse();
        assertThat(tokens.tempoExpirado(new DadosTokenPublico(1, Instant.now().minusSeconds(7201).toEpochMilli()))).isTrue();
    }

    @Test
    void mudarSenhaInvalidaTokenAnterior() {
        String token = tokens.gerarToken(usuario);
        usuario.setSenha("outro-hash");
        assertThatThrownBy(() -> tokens.verificarToken(token)).isInstanceOf(ApiException.class);
    }

    @Test
    void rejeitaTokenAdulteradoOuMalformado() {
        String token = tokens.gerarToken(usuario);
        assertThatThrownBy(() -> tokens.verificarToken(token.substring(0, token.length() - 8) + "AAAAAAAA"))
                .isInstanceOf(ApiException.class);
        assertThatThrownBy(() -> tokens.verificarToken("token-invalido")).isInstanceOf(ApiException.class);
    }

    @Test
    void usoUnicoTambemValeParaChamadasConcorrentes() {
        String token = tokens.gerarToken(usuario);
        AtomicInteger usos = new AtomicInteger();
        Runnable consumir = () -> { try { tokens.validaToken(token); usos.incrementAndGet(); } catch (ApiException ignored) {} };
        CompletableFuture.allOf(CompletableFuture.runAsync(consumir), CompletableFuture.runAsync(consumir)).join();
        assertThat(usos.get()).isEqualTo(1);
    }
}
