package com.example.samu_pulse;

import com.example.samu_pulse.domain.usuario.*;
import com.example.samu_pulse.infra.email.*;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.infra.rawToken.*;
import com.example.samu_pulse.repository.UsuarioRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.regex.Pattern;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = FluxoTokenServiceTests.Config.class)
@TestPropertySource(properties = "SITE_URL=http://localhost:5173")
@WithMockUser(roles = "ADMIN")
class FluxoTokenServiceTests {
    @Configuration
    @EnableMethodSecurity
    static class Config {
        @Bean UsuarioRepository usuarios() { return mock(UsuarioRepository.class); }
        @Bean UsuarioService usuarioService() { return mock(UsuarioService.class); }
        @Bean AuthenticationManager manager() { return mock(AuthenticationManager.class); }
        @Bean PasswordEncoder encoder() { return new BCryptPasswordEncoder(); }
        @Bean EmailService emails() { return mock(EmailService.class); }
        @Bean org.springframework.mail.javamail.JavaMailSender mailSender() { return mock(org.springframework.mail.javamail.JavaMailSender.class); }
        @Bean TokenTransparenteService tokens() { return new TokenTransparenteService(); }
        @Bean FluxoTokenService fluxo() { return new FluxoTokenService(); }
    }
    @Autowired FluxoTokenService fluxo;
    @Autowired UsuarioRepository usuarios;
    @Autowired UsuarioService usuarioService;
    @Autowired AuthenticationManager manager;
    @Autowired PasswordEncoder encoder;
    @Autowired EmailService emails;
    Usuario admin;

    @BeforeEach
    void preparar() {
        reset(usuarios, usuarioService, manager, emails);
        admin = new Usuario("admin", encoder.encode("senha-atual"), "Admin", TipoUsuario.ADMIN, "Administrador");
        admin.setId(1);
        admin.setEmail("admin@example.com");
        when(usuarioService.usuarioAutenticado()).thenReturn(admin);
        when(usuarios.findById(1)).thenReturn(Optional.of(admin));
    }

    private DadosFluxoToken.Cadastro cadastro(String token, String confirma) {
        return new DadosFluxoToken.Cadastro(token, "", "novo@example.com", "senha-nova", confirma, "Novo usuário", "Juventude");
    }

    @Test
    void geraAposValidarSenhaDoAdminAutenticado() {
        var link = fluxo.gerar(new DadosFluxoToken.Criacao("senha-atual", TipoUsuario.LIDER));
        verify(manager).authenticate(argThat(auth -> auth.getName().equals("admin") && auth.getCredentials().equals("senha-atual")));
        assertThat(link.link()).startsWith("http://localhost:5173/auth/sign-up?token-transparente=");
        assertThat(fluxo.consultarConvite(link.token())).isEqualTo(TipoUsuario.LIDER);
    }

    @Test
    void senhaIncorretaNaoGeraConvite() {
        when(manager.authenticate(any())).thenThrow(new BadCredentialsException("Senha incorreta"));
        assertThatThrownBy(() -> fluxo.gerar(new DadosFluxoToken.Criacao("errada", TipoUsuario.ADMIN)))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @WithMockUser(roles = "LIDER")
    void somenteAdminGeraOuEnviaConvites() {
        assertThatThrownBy(() -> fluxo.gerar(new DadosFluxoToken.Criacao("senha", TipoUsuario.USER))).isInstanceOf(AccessDeniedException.class);
        assertThatThrownBy(() -> fluxo.enviarConvite(new DadosFluxoToken.Envio("token", "a@example.com"))).isInstanceOf(AccessDeniedException.class);
        verifyNoInteractions(manager, emails);
    }

    @Test
    void cadastroUsaPerfilEscolhidoEEmailComoLoginQuandoOmitido() {
        var link = fluxo.gerar(new DadosFluxoToken.Criacao("senha-atual", TipoUsuario.LIDER));
        fluxo.consultarConvite(link.token());
        fluxo.cadastrar(cadastro(link.token(), "senha-nova"));
        var captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarios).save(captor.capture());
        assertThat(captor.getValue().getTipoUsuario()).isEqualTo(TipoUsuario.LIDER);
        assertThat(captor.getValue().getLogin()).isEqualTo("novo@example.com");
        assertThat(captor.getValue().getEmail()).isEqualTo("novo@example.com");
        assertThat(encoder.matches("senha-nova", captor.getValue().getSenha())).isTrue();
        assertThatThrownBy(() -> fluxo.cadastrar(cadastro(link.token(), "senha-nova"))).isInstanceOf(ApiException.class);
    }

    @Test
    void senhasDiferentesNaoConsomemConvite() {
        var link = fluxo.gerar(new DadosFluxoToken.Criacao("senha-atual", TipoUsuario.USER));
        assertThatThrownBy(() -> fluxo.cadastrar(cadastro(link.token(), "diferente"))).isInstanceOf(ApiException.class);
        assertThat(fluxo.consultarConvite(link.token())).isEqualTo(TipoUsuario.USER);
        verify(usuarios, never()).save(any());
    }

    @Test
    void conviteNaoPodeRedefinirSenhaDoAdmin() {
        var link = fluxo.gerar(new DadosFluxoToken.Criacao("senha-atual", TipoUsuario.USER));
        assertThatThrownBy(() -> fluxo.redefinirSenha(new DadosFluxoToken.NovaSenha(link.token(), "nova", "nova")))
                .isInstanceOf(ApiException.class);
        assertThat(encoder.matches("senha-atual", admin.getSenha())).isTrue();
    }

    @Test
    void emailDesconhecidoNaoDisparaEnvio() {
        fluxo.solicitarRecuperacao(new DadosFluxoToken.Recuperacao("desconhecido@example.com"));
        verifyNoInteractions(emails);
    }

    @Test
    void recuperacaoEnviaLinkERedefineSenhaUmaUnicaVez() {
        when(usuarios.findByEmailIgnoreCaseAndAtivoTrue(admin.getEmail())).thenReturn(Optional.of(admin));
        fluxo.solicitarRecuperacao(new DadosFluxoToken.Recuperacao(admin.getEmail()));
        var mensagem = ArgumentCaptor.forClass(DadosEnviarEmail.class);
        verify(emails).enviarEmail(mensagem.capture());
        var matcher = Pattern.compile("password-reset\\?token=([^\"]+)").matcher(mensagem.getValue().mensagem());
        assertThat(matcher.find()).isTrue();
        String token = URLDecoder.decode(matcher.group(1), StandardCharsets.UTF_8);
        assertThatThrownBy(() -> fluxo.consultarConvite(token)).isInstanceOf(ApiException.class);
        fluxo.redefinirSenha(new DadosFluxoToken.NovaSenha(token, "nova-senha", "nova-senha"));
        assertThat(encoder.matches("nova-senha", admin.getSenha())).isTrue();
        assertThatThrownBy(() -> fluxo.redefinirSenha(new DadosFluxoToken.NovaSenha(token, "outra", "outra")))
                .isInstanceOf(ApiException.class);
    }

    @Test
    void conviteEhRecusadoQuandoCriadorPerdePermissao() {
        var link = fluxo.gerar(new DadosFluxoToken.Criacao("senha-atual", TipoUsuario.USER));
        admin.setTipoUsuario(TipoUsuario.LIDER);
        assertThatThrownBy(() -> fluxo.consultarConvite(link.token())).isInstanceOf(ApiException.class);
    }

    @Test
    void enviarConviteMantemTokenDisponivelParaCadastro() {
        var link = fluxo.gerar(new DadosFluxoToken.Criacao("senha-atual", TipoUsuario.USER));
        fluxo.enviarConvite(new DadosFluxoToken.Envio(link.token(), "convidado@example.com"));
        verify(emails).enviarEmail(argThat(dados -> dados.destino().equals("convidado@example.com") && dados.mensagem().contains("Samu Pulse")));
        assertThat(fluxo.consultarConvite(link.token())).isEqualTo(TipoUsuario.USER);
    }
}
