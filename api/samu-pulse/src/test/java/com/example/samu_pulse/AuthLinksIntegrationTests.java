package com.example.samu_pulse;

import com.example.samu_pulse.domain.usuario.*;
import com.example.samu_pulse.infra.email.*;
import com.example.samu_pulse.infra.security.TokenService;
import com.example.samu_pulse.repository.UsuarioRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.mockito.ArgumentCaptor;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@EnabledIfEnvironmentVariable(named = "SAMU_TEST_DB_URL", matches = ".+")
@SpringBootTest(properties = {
        "spring.config.import=", "SITE_URL=http://localhost:5173",
        "spring.datasource.url=${SAMU_TEST_DB_URL}",
        "spring.datasource.username=${SAMU_TEST_DB_USERNAME}",
        "spring.datasource.password=${SAMU_TEST_DB_PASSWORD}",
        "spring.jpa.show-sql=false", "file.upload-dir=target/test-uploads"
})
@Transactional
class AuthLinksIntegrationTests {
    @Autowired WebApplicationContext context;
    @Autowired UsuarioRepository usuarios;
    @Autowired PasswordEncoder encoder;
    @Autowired TokenService jwt;
    @MockitoBean EmailService emails;
    MockMvc mvc;
    Usuario admin;
    Usuario lider;

    @BeforeEach
    void preparar() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        admin = usuarios.save(new Usuario("admin-convite", encoder.encode("senha-teste"), "Admin", TipoUsuario.ADMIN, "Admin"));
        lider = usuarios.save(new Usuario("lider-convite", encoder.encode("senha-teste"), "Líder", TipoUsuario.LIDER, "Líder"));
    }

    private String auth(Usuario usuario) { return "Bearer " + jwt.gerarToken(usuario); }

    private String gerar() throws Exception {
        String json = mvc.perform(post("/token/gerar").header("Authorization", auth(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"senha\":\"senha-teste\",\"tipoUsuario\":\"LIDER\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.tipoUsuario").value("LIDER"))
                .andReturn().getResponse().getContentAsString();
        var matcher = Pattern.compile("\"token\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
        assertThat(matcher.find()).isTrue();
        return matcher.group(1);
    }

    @Test
    void gerarConviteExigeAdminESenhaValida() throws Exception {
        String body = "{\"senha\":\"senha-teste\",\"tipoUsuario\":\"ADMIN\"}";
        mvc.perform(post("/token/gerar").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isForbidden());
        mvc.perform(post("/token/gerar").header("Authorization", auth(lider)).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mvc.perform(post("/token/gerar").header("Authorization", auth(admin)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"senha\":\"errada\",\"tipoUsuario\":\"LIDER\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void cadastroPublicoPorLinkPreservaPerfilEImpedeReutilizacao() throws Exception {
        String token = gerar();
        String consultar = "{\"rawToken\":\"" + token + "\"}";
        mvc.perform(post("/token/consultar-convite").contentType(MediaType.APPLICATION_JSON).content(consultar))
                .andExpect(status().isOk()).andExpect(jsonPath("$.tipoUsuario").value("LIDER"));
        String body = """
                {"rawToken":"%s","login":"novo-lider","email":"novo-lider@example.com",
                 "senha":"senha-nova","confirmaSenha":"senha-nova","nomeExibicao":"Novo líder","perfilResponsavel":"Juventude"}
                """.formatted(token);
        mvc.perform(post("/auth/sign-up").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isOk());
        Usuario criado = (Usuario) usuarios.findByLogin("novo-lider");
        assertThat(criado.getTipoUsuario()).isEqualTo(TipoUsuario.LIDER);
        assertThat(criado.getEmail()).isEqualTo("novo-lider@example.com");
        mvc.perform(post("/auth").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"novo-lider\",\"senha\":\"senha-nova\"}"))
                .andExpect(status().isOk());
        mvc.perform(post("/auth/sign-up").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
    }

    @Test
    void usuarioAtualizaEmailERecuperaSenhaSemExporExistenciaDaConta() throws Exception {
        mvc.perform(put("/auth/perfil").header("Authorization", auth(lider)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomeExibicao\":\"Líder\",\"email\":\"lider@example.com\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.email").value("lider@example.com"));
        String desconhecido = mvc.perform(post("/token/token-senha").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"desconhecido@example.com\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        verifyNoInteractions(emails);
        String conhecido = mvc.perform(post("/token/token-senha").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"lider@example.com\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertThat(conhecido).isEqualTo(desconhecido);
        var mensagem = ArgumentCaptor.forClass(DadosEnviarEmail.class);
        verify(emails).enviarEmail(mensagem.capture());
        var matcher = Pattern.compile("password-reset\\?token=([^\"]+)").matcher(mensagem.getValue().mensagem());
        assertThat(matcher.find()).isTrue();
        String raw = URLDecoder.decode(matcher.group(1), StandardCharsets.UTF_8);
        String body = "{\"rawToken\":\"" + raw + "\",\"novaSenha\":\"nova\",\"confirmaSenha\":\"nova\"}";
        mvc.perform(put("/token/senha").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isOk());
        mvc.perform(post("/auth").contentType(MediaType.APPLICATION_JSON).content("{\"login\":\"lider-convite\",\"senha\":\"nova\"}"))
                .andExpect(status().isOk());
        mvc.perform(put("/token/senha").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
    }

    @Test
    void conviteNaoPodeSerUsadoNaRecuperacaoDeSenha() throws Exception {
        String token = gerar();
        mvc.perform(put("/token/senha").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rawToken\":\"" + token + "\",\"novaSenha\":\"nova\",\"confirmaSenha\":\"nova\"}"))
                .andExpect(status().isBadRequest());
        assertThat(encoder.matches("senha-teste", admin.getSenha())).isTrue();
    }

    @Test
    void envioDeConviteEhProtegidoENaoConsomeLink() throws Exception {
        String token = gerar();
        String body = "{\"rawToken\":\"" + token + "\",\"email\":\"convidado@example.com\"}";
        mvc.perform(post("/token/enviar-convite").header("Authorization", auth(lider)).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isForbidden());
        mvc.perform(post("/token/enviar-convite").header("Authorization", auth(admin)).contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());
        verify(emails).enviarEmail(argThat(dados -> dados.destino().equals("convidado@example.com")));
        mvc.perform(post("/token/consultar-convite").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rawToken\":\"" + token + "\"}"))
                .andExpect(status().isOk());
    }
}
