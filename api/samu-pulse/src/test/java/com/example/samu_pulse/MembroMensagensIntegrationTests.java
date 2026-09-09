package com.example.samu_pulse;

import com.example.samu_pulse.domain.historico_mensagem.HistoricoMensagem;
import com.example.samu_pulse.domain.membro.Membro;
import com.example.samu_pulse.domain.membro.StatusMembro;
import com.example.samu_pulse.domain.membro.dto.DadosMembroRequest;
import com.example.samu_pulse.domain.usuario.TipoUsuario;
import com.example.samu_pulse.domain.usuario.Usuario;
import com.example.samu_pulse.infra.security.TokenService;
import com.example.samu_pulse.repository.HistoricoMensagemRepository;
import com.example.samu_pulse.repository.MembroRepository;
import com.example.samu_pulse.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Execute somente com um PostgreSQL de testes explicitamente informado.
@EnabledIfEnvironmentVariable(named = "SAMU_TEST_DB_URL", matches = ".+")
@SpringBootTest(properties = {
        "spring.config.import=",
        "spring.datasource.url=${SAMU_TEST_DB_URL}",
        "spring.datasource.username=${SAMU_TEST_DB_USERNAME:postgres}",
        "spring.datasource.password=${SAMU_TEST_DB_PASSWORD:}",
        "SITE_URL=http://localhost:5173",
        "file.upload-dir=target/test-uploads"
})
@Transactional
class MembroMensagensIntegrationTests {
    @Autowired WebApplicationContext context;
    @Autowired MembroRepository membros;
    @Autowired UsuarioRepository usuarios;
    @Autowired HistoricoMensagemRepository mensagens;
    @Autowired TokenService tokens;
    @Autowired EntityManager entityManager;

    MockMvc mvc;
    Membro membro;
    Usuario autor;
    Usuario admin;

    @BeforeEach
    void preparar() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        membro = membros.save(new Membro(new DadosMembroRequest(null, "Membro teste", "11999999999",
                null, null, null, StatusMembro.ATIVO)));
        autor = usuario("autor", TipoUsuario.USER);
        admin = usuario("admin", TipoUsuario.ADMIN);
        entityManager.flush();
    }

    @Test
    void administradorInativaSemExcluirMembroOuHistorico() throws Exception {
        HistoricoMensagem historico = mensagem();
        mvc.perform(delete("/membro/{id}", membro.getId()).header("Authorization", token(admin)))
                .andExpect(status().isNoContent());
        entityManager.flush();
        entityManager.clear();
        assertThat(membros.findById(membro.getId()).orElseThrow().getAtivo()).isFalse();
        assertThat(mensagens.existsById(historico.getId())).isTrue();
        mvc.perform(get("/membro").param("search", "").header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
        mvc.perform(delete("/membro/{id}", membro.getId()).header("Authorization", token(admin)))
                .andExpect(status().isBadRequest()).andExpect(content().string("Membro já está inativo!"));
    }

    @ParameterizedTest
    @EnumSource(value = TipoUsuario.class, names = {"USER", "LIDER"})
    void naoAdministradorNaoInativa(TipoUsuario tipo) throws Exception {
        mvc.perform(delete("/membro/{id}", membro.getId()).header("Authorization", token(usuario("outro", tipo))))
                .andExpect(status().isForbidden());
        assertThat(membro.getAtivo()).isTrue();
    }

    @Test
    void membroInexistenteRetorna404() throws Exception {
        mvc.perform(delete("/membro/2147483647").header("Authorization", token(admin)))
                .andExpect(status().isNotFound());
        mvc.perform(get("/membro/2147483647/mensagens").header("Authorization", token(autor)))
                .andExpect(status().isNotFound());
        mvc.perform(post("/membro/2147483647/mensagens").header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Olá\"}"))
                .andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @EnumSource(TipoUsuario.class)
    void usuarioAutenticadoCriaEListaComAutorEDatas(TipoUsuario tipo) throws Exception {
        Usuario remetente = usuario("remetente", tipo);
        mvc.perform(post(base()).header("Authorization", token(remetente))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Contato realizado\",\"idUsuario\":" + admin.getId()
                                + ",\"perfilResponsavel\":\"forjado\",\"dataRegistro\":\"2000-01-01T00:00:00\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUsuario").value(remetente.getId()))
                .andExpect(jsonPath("$.perfilResponsavel").value("Perfil remetente"))
                .andExpect(jsonPath("$.usuario.login").value("remetente"))
                .andExpect(jsonPath("$.usuario.senha").doesNotExist())
                .andExpect(jsonPath("$.dataRegistro").isNotEmpty());
        entityManager.flush();
        entityManager.clear();
        mvc.perform(get(base()).header("Authorization", token(autor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].mensagem").value("Contato realizado"))
                .andExpect(jsonPath("$.content[0].idMembro").value(membro.getId()))
                .andExpect(jsonPath("$.content[0].idUsuario").value(remetente.getId()));
    }

    @Test
    void autorEditaEExcluiPreservandoAutoriaEData() throws Exception {
        HistoricoMensagem historico = mensagem();
        var data = historico.getDataRegistro();
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Atualizada\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.mensagem").value("Atualizada"));
        entityManager.flush();
        entityManager.clear();
        var atualizada = mensagens.findById(historico.getId()).orElseThrow();
        assertThat(atualizada.getMensagem()).isEqualTo("Atualizada");
        assertThat(atualizada.getUsuario().getId()).isEqualTo(autor.getId());
        // PostgreSQL armazena TIMESTAMP com precisão de microssegundos.
        assertThat(atualizada.getDataRegistro()).isEqualTo(data);
        mvc.perform(delete(base() + "/" + historico.getId()).header("Authorization", token(autor)))
                .andExpect(status().isNoContent());
        entityManager.flush();
        entityManager.clear();
        assertThat(mensagens.existsById(historico.getId())).isFalse();
        assertThat(membros.existsById(membro.getId())).isTrue();
    }

    @ParameterizedTest
    @EnumSource(TipoUsuario.class)
    void outroUsuarioInclusiveAdminPodeLerMasNaoEditarOuExcluir(TipoUsuario tipo) throws Exception {
        HistoricoMensagem historico = mensagem();
        String token = token(usuario("outro", tipo));
        mvc.perform(get(base()).header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].usuario.login").value("autor"));
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Indevida\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(delete(base() + "/" + historico.getId()).header("Authorization", token))
                .andExpect(status().isForbidden());
        assertThat(mensagens.findById(historico.getId()).orElseThrow().getMensagem()).isEqualTo("Original");
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"mensagem\":null}", "{\"mensagem\":\"\"}", "{\"mensagem\":\"   \"}"})
    void rejeitaConteudoVazioNaCriacaoEEdicao(String corpo) throws Exception {
        HistoricoMensagem historico = mensagem();
        mvc.perform(post(base()).header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$[0].campo").value("mensagem"));
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest());
        assertThat(historico.getMensagem()).isEqualTo("Original");
    }

    @Test
    void mensagemInexistenteOuDeOutroMembroRetorna404() throws Exception {
        HistoricoMensagem historico = mensagem();
        Membro outro = membros.save(new Membro(new DadosMembroRequest(null, "Outro", "11999999999",
                null, null, null, StatusMembro.ATIVO)));
        for (String caminho : new String[] {base() + "/9223372036854775807",
                "/membro/" + outro.getId() + "/mensagens/" + historico.getId()}) {
            mvc.perform(put(caminho).header("Authorization", token(autor))
                            .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Indevida\"}"))
                    .andExpect(status().isNotFound());
            mvc.perform(delete(caminho).header("Authorization", token(autor)))
                    .andExpect(status().isNotFound());
        }
        mvc.perform(get("/membro/" + outro.getId() + "/mensagens").header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    void membroInativoNaoPermiteOperacoesNoHistorico() throws Exception {
        HistoricoMensagem historico = mensagem();
        membro.inativar();
        mvc.perform(get(base()).header("Authorization", token(autor))).andExpect(status().isNotFound());
        mvc.perform(post(base()).header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Olá\"}"))
                .andExpect(status().isNotFound());
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Olá\"}"))
                .andExpect(status().isNotFound());
        mvc.perform(delete(base() + "/" + historico.getId()).header("Authorization", token(autor)))
                .andExpect(status().isNotFound());
        assertThat(mensagens.existsById(historico.getId())).isTrue();
    }

    @Test
    void semAutenticacaoNaoAcessaOperacoes() throws Exception {
        mvc.perform(delete("/membro/" + membro.getId())).andExpect(status().isForbidden());
        mvc.perform(get(base())).andExpect(status().isForbidden());
        mvc.perform(post(base()).contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Olá\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(put(base() + "/1").contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Olá\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(delete(base() + "/1")).andExpect(status().isForbidden());
    }

    @Test
    void historicoPaginadoOrdenaMaisRecentesPrimeiro() throws Exception {
        HistoricoMensagem primeira = mensagem();
        HistoricoMensagem segunda = mensagens.save(new HistoricoMensagem(null, primeira.getDataRegistro(), "Segunda",
                autor.getPerfilResponsavel(), autor, membro));
        mvc.perform(get(base()).param("size", "1").header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[0].id").value(segunda.getId()));
        mvc.perform(get(base()).param("size", "1").param("page", "1").header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(primeira.getId()));
    }

    private Usuario usuario(String login, TipoUsuario tipo) {
        return usuarios.save(new Usuario(login, "senha-teste", "Perfil " + login, tipo));
    }

    private HistoricoMensagem mensagem() {
        HistoricoMensagem historico = mensagens.saveAndFlush(new HistoricoMensagem(membro, autor, "Original"));
        entityManager.refresh(historico);
        return historico;
    }

    private String token(Usuario usuario) {
        return "Bearer " + tokens.gerarToken(usuario);
    }

    private String base() {
        return "/membro/" + membro.getId() + "/mensagens";
    }
}
