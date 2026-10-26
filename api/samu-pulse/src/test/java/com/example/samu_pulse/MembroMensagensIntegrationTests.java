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
        "cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173",
        "spring.senha.first-acesso=chave-de-teste",
        "spring.jpa.show-sql=false",
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
    StatusMembro statusAtivo;

    @BeforeEach
    void preparar() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        statusAtivo = entityManager.createQuery("SELECT s FROM StatusMembro s WHERE s.nome = 'Ativo'", StatusMembro.class)
                .getSingleResult();
        membro = membros.save(new Membro(new DadosMembroRequest(null, "Membro teste", "11999999999",
                null, null, null, statusAtivo.getCodStatus()), statusAtivo));
        autor = usuario("autor", TipoUsuario.LIDER);
        admin = usuario("admin", TipoUsuario.ADMIN);
        entityManager.flush();
    }

    @Test
    void administradorGerenciaStatusComCorPersonalizada() throws Exception {
        mvc.perform(post("/status-membro").header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Personalizado teste\",\"cor\":\"#a1b2c3\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.cod_status").isNumber())
                .andExpect(jsonPath("$.cor").value("#a1b2c3"));
        StatusMembro novo = entityManager.createQuery(
                "SELECT s FROM StatusMembro s WHERE s.nome = 'Personalizado teste'", StatusMembro.class)
                .getSingleResult();
        mvc.perform(get("/status-membro").header("Authorization", token(autor)))
                .andExpect(status().isOk());
        mvc.perform(delete("/status-membro/{id}", novo.getCodStatus())
                        .header("Authorization", token(admin)))
                .andExpect(status().isNoContent());
        assertThat(entityManager.find(StatusMembro.class, novo.getCodStatus())).isNull();
    }

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void statusAssociadoAMembroNaoPodeSerExcluido(boolean ativo) throws Exception {
        if (!ativo) membro.inativar();
        entityManager.flush();
        mvc.perform(delete("/status-membro/{id}", statusAtivo.getCodStatus())
                        .header("Authorization", token(admin)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Não é possível excluir um status associado a membros!"));
    }

    @Test
    void usuarioSemRoleAdminNaoGerenciaStatus() throws Exception {
        mvc.perform(post("/status-membro").header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Teste\",\"cor\":\"#123456\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/status-membro/{id}", statusAtivo.getCodStatus())
                        .header("Authorization", token(autor)))
                .andExpect(status().isForbidden());
    }

    @Test
    void membroUsaStatusDinamicoNoCadastroEdicaoEFiltro() throws Exception {
        StatusMembro novo = new StatusMembro(null, "Status novo", "#bada55");
        entityManager.persist(novo);
        entityManager.flush();
        String dados = "{\"nome\":\"Membro dinâmico\",\"telefone\":\"11999999999\",\"cod_status\":"
                + novo.getCodStatus() + "}";
        mvc.perform(post("/membro").header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isOk()).andExpect(jsonPath("$.cod_status").value(novo.getCodStatus()))
                .andExpect(jsonPath("$.status.cor").value("#bada55"));
        mvc.perform(put("/membro").header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dados.replace("{", "{\"id\":" + membro.getId() + ",")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status.nome").value("Status novo"));
        mvc.perform(get("/membro").param("search", "").param("cod_status", novo.getCodStatus().toString())
                        .header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[0].status.cor").value("#bada55"));
    }

    @Test
    void paginacaoPadraoUsaVinteMembrosEPermiteConsultarPagina() throws Exception {
        for (int i = 0; i < 21; i++) {
            membros.save(new Membro(new DadosMembroRequest(null, "Paginação " + i, "11999999999",
                    null, null, null, statusAtivo.getCodStatus()), statusAtivo));
        }
        entityManager.flush();
        mvc.perform(get("/membro").param("search", "").header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.totalPages").value(2))
                .andExpect(jsonPath("$.content.length()").value(20));
        mvc.perform(get("/membro").param("search", "").param("page", "1")
                        .header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.number").value(1))
                .andExpect(jsonPath("$.content.length()").value(2));
    }

    @Test
    void preflightPermitePatchDeUsuariosSemExigirAutenticacao() throws Exception {
        mvc.perform(options("/admin/usuarios/{id}", autor.getId())
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "PATCH")
                        .header("Access-Control-Request-Headers", "authorization,content-type,bypass-tunnel-reminder"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", org.hamcrest.Matchers.containsString("PATCH")));
    }

    @Test
    void corsRespeitaOrigemConfiguradaEMantemAutorizacaoAdmin() throws Exception {
        mvc.perform(patch("/admin/usuarios/{id}", admin.getId()).header("Authorization", token(autor))
                        .header("Origin", "http://127.0.0.1:5173")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"ADMIN\",\"ativo\":true}"))
                .andExpect(status().isForbidden())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://127.0.0.1:5173"));
    }

    @Test
    void preflightRejeitaOrigemNaoAutorizada() throws Exception {
        mvc.perform(options("/admin/usuarios/{id}", autor.getId())
                        .header("Origin", "https://origem-nao-autorizada.example")
                        .header("Access-Control-Request-Method", "PATCH"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    void administradorListaUsuariosSemExporSenhas() throws Exception {
        mvc.perform(get("/admin/usuarios").header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[0].senha").doesNotExist())
                .andExpect(jsonPath("$.content[0].ativo").value(true));
        mvc.perform(get("/admin/usuarios").param("search", "autor").header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void somenteAdministradorPodeConsultarOuAlterarUsuarios() throws Exception {
        mvc.perform(get("/admin/usuarios").header("Authorization", token(autor)))
                .andExpect(status().isForbidden());
        mvc.perform(patch("/admin/usuarios/{id}", admin.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"ADMIN\",\"ativo\":true}"))
                .andExpect(status().isForbidden());
        mvc.perform(get("/admin/usuarios")).andExpect(status().isForbidden());
    }

    @Test
    void administradorAlteraPermissaoEStatusDoUsuario() throws Exception {
        mvc.perform(patch("/admin/usuarios/{id}", autor.getId()).header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"LIDER\",\"ativo\":false}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.tipoUsuario").value("LIDER"))
                .andExpect(jsonPath("$.ativo").value(false)).andExpect(jsonPath("$.senha").doesNotExist());
        entityManager.flush();
        entityManager.refresh(autor);
        assertThat(autor.getTipoUsuario()).isEqualTo(TipoUsuario.LIDER);
        assertThat(autor.getAtivo()).isFalse();
        assertThat(autor.getSenha()).isEqualTo("senha-teste");
        mvc.perform(patch("/admin/usuarios/{id}", autor.getId()).header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"USER\",\"ativo\":true}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void inativacaoImpedeNovoLoginETokenJaEmitido() throws Exception {
        autor.setSenha(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("senha-teste"));
        String tokenAntigo = token(autor);
        mvc.perform(patch("/admin/usuarios/{id}", autor.getId()).header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"USER\",\"ativo\":false}"))
                .andExpect(status().isOk());
        mvc.perform(get("/auth/perfil").header("Authorization", tokenAntigo))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/auth").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"autor\",\"senha\":\"senha-teste\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void remocaoDaRoleAdminValeMesmoComTokenAnterior() throws Exception {
        String tokenAntigo = token(admin);
        Usuario outroAdmin = usuario("outro-admin", TipoUsuario.ADMIN);
        mvc.perform(patch("/admin/usuarios/{id}", admin.getId()).header("Authorization", token(outroAdmin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"USER\",\"ativo\":true}"))
                .andExpect(status().isOk());
        mvc.perform(get("/admin/usuarios").header("Authorization", tokenAntigo))
                .andExpect(status().isForbidden());
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"tipoUsuario\":\"ADMIN\"}", "{\"tipoUsuario\":\"INVALIDO\",\"ativo\":true}"})
    void alteracaoDeAcessoExigeStatusEPermissaoValidos(String dados) throws Exception {
        mvc.perform(patch("/admin/usuarios/{id}", autor.getId()).header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isBadRequest());
    }

    @Test
    void administradorNaoPodeAlterarProprioTipo() throws Exception {
        mvc.perform(patch("/admin/usuarios/{id}", admin.getId()).header("Authorization", token(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"tipoUsuario\":\"LIDER\",\"ativo\":false}"))
                .andExpect(status().isBadRequest());
        assertThat(admin.getTipoUsuario()).isEqualTo(TipoUsuario.ADMIN);
        assertThat(admin.getAtivo()).isTrue();
    }

    @Test
    void userConsultaMembrosEHistoricoMasNaoPodeModificarNada() throws Exception {
        Usuario leitor = usuario("leitor", TipoUsuario.USER);
        HistoricoMensagem historico = mensagens.saveAndFlush(new HistoricoMensagem(membro, leitor, "Histórico existente"));
        String autenticacao = token(leitor);
        mvc.perform(get("/membro").param("search", "").header("Authorization", autenticacao))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(membro.getId()));
        mvc.perform(get(base()).header("Authorization", autenticacao))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].podeAlterar").value(false));
        String cadastro = "{\"nome\":\"Teste\",\"telefone\":\"11999999999\",\"cod_status\":" + statusAtivo.getCodStatus() + "}";
        mvc.perform(post("/membro").header("Authorization", autenticacao).contentType(MediaType.APPLICATION_JSON).content(cadastro))
                .andExpect(status().isForbidden());
        mvc.perform(put("/membro").header("Authorization", autenticacao).contentType(MediaType.APPLICATION_JSON)
                        .content(cadastro.replace("{", "{\"id\":" + membro.getId() + ",")))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/membro/{id}", membro.getId()).header("Authorization", autenticacao)).andExpect(status().isForbidden());
        mvc.perform(delete("/membro/img/{id}/foto.png", membro.getId()).header("Authorization", autenticacao)).andExpect(status().isForbidden());
        mvc.perform(multipart("/membro/img").file("imagem", new byte[]{1}).param("idMembro", membro.getId().toString())
                        .header("Authorization", autenticacao)).andExpect(status().isForbidden());
        mvc.perform(post(base()).header("Authorization", autenticacao).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Indevida\"}")).andExpect(status().isForbidden());
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", autenticacao).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Indevida\"}")).andExpect(status().isForbidden());
        mvc.perform(delete(base() + "/" + historico.getId()).header("Authorization", autenticacao)).andExpect(status().isForbidden());
        assertThat(historico.getMensagem()).isEqualTo("Histórico existente");
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
    @EnumSource(value = TipoUsuario.class, names = {"ADMIN", "LIDER"})
    void usuarioAutenticadoCriaEListaComAutorEDatas(TipoUsuario tipo) throws Exception {
        Usuario remetente = usuario("remetente", tipo);
        mvc.perform(post(base()).header("Authorization", token(remetente))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Contato realizado\",\"idUsuario\":" + admin.getId()
                                + ",\"nomeExibicao\":\"Forjado\",\"podeAlterar\":false,\"perfilResponsavel\":\"forjado\","
                                + "\"dataAlteracao\":\"2000-01-01T00:00:00\",\"dataRegistro\":\"2000-01-01T00:00:00\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idUsuario").doesNotExist())
                .andExpect(jsonPath("$.perfilResponsavel").value("Perfil remetente"))
                .andExpect(jsonPath("$.usuario").doesNotExist())
                .andExpect(jsonPath("$.login").doesNotExist())
                .andExpect(jsonPath("$.nomeExibicao").value("Maria Souza"))
                .andExpect(jsonPath("$.podeAlterar").value(true))
                .andExpect(jsonPath("$.dataAlteracao").isEmpty())
                .andExpect(jsonPath("$.dataRegistro").isNotEmpty());
        entityManager.flush();
        entityManager.clear();
        mvc.perform(get(base()).header("Authorization", token(autor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].mensagem").value("Contato realizado"))
                .andExpect(jsonPath("$.content[0].idMembro").value(membro.getId()))
                .andExpect(jsonPath("$.content[0].nomeExibicao").value("Maria Souza"))
                .andExpect(jsonPath("$.content[0].podeAlterar").value(false))
                .andExpect(jsonPath("$.content[0].idUsuario").doesNotExist())
                .andExpect(jsonPath("$.content[0].usuario").doesNotExist());
        var persistida = mensagens.findAll().get(0);
        assertThat(persistida.getUsuario().getId()).isEqualTo(remetente.getId());
        assertThat(persistida.getDataRegistro()).isAfter(java.time.LocalDateTime.of(2000, 1, 1, 0, 0));
        assertThat(persistida.getDataAlteracao()).isNull();
    }

    @Test
    void autorEditaEExcluiPreservandoAutoriaEData() throws Exception {
        HistoricoMensagem historico = mensagem();
        var data = historico.getDataRegistro();
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Atualizada\",\"idUsuario\":" + admin.getId()
                                + ",\"idMembro\":2147483647,\"perfilResponsavel\":\"forjado\",\"nomeExibicao\":\"Forjado\","
                                + "\"dataRegistro\":\"2000-01-01T00:00:00\",\"dataAlteracao\":\"2000-01-01T00:00:00\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.mensagem").value("Atualizada"))
                .andExpect(jsonPath("$.dataAlteracao").isNotEmpty())
                .andExpect(jsonPath("$.podeAlterar").value(true));
        entityManager.flush();
        entityManager.clear();
        var atualizada = mensagens.findById(historico.getId()).orElseThrow();
        assertThat(atualizada.getMensagem()).isEqualTo("Atualizada");
        assertThat(atualizada.getUsuario().getId()).isEqualTo(autor.getId());
        // PostgreSQL armazena TIMESTAMP com precisão de microssegundos.
        assertThat(atualizada.getDataRegistro()).isEqualTo(data);
        assertThat(atualizada.getDataAlteracao()).isAfterOrEqualTo(data);
        assertThat(atualizada.getMembro().getId()).isEqualTo(membro.getId());
        assertThat(atualizada.getPerfilResponsavel()).isEqualTo("Perfil autor");
        var primeiraAlteracao = atualizada.getDataAlteracao();
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Segunda alteração\"}"))
                .andExpect(status().isOk());
        entityManager.flush();
        entityManager.clear();
        atualizada = mensagens.findById(historico.getId()).orElseThrow();
        assertThat(atualizada.getDataAlteracao()).isAfter(primeiraAlteracao);
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
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].nomeExibicao").value("Maria Souza"))
                .andExpect(jsonPath("$.content[0].podeAlterar").value(false));
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
                null, null, null, statusAtivo.getCodStatus()), statusAtivo));
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
        HistoricoMensagem segunda = mensagens.save(new HistoricoMensagem(null, primeira.getDataRegistro(), null, "Segunda",
                autor.getPerfilResponsavel(), autor, membro));
        mvc.perform(get(base()).param("size", "1").header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[0].id").value(segunda.getId()));
        mvc.perform(get(base()).param("size", "1").param("page", "1").header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(primeira.getId()));
    }

    @Test
    void conteudoIdenticoNaoCriaDataArtificialDeAlteracao() throws Exception {
        var historico = mensagem();
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Original\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.dataAlteracao").isEmpty());
        entityManager.flush();
        entityManager.clear();
        assertThat(mensagens.findById(historico.getId()).orElseThrow().getDataAlteracao()).isNull();
    }

    @Test
    void mudarNomeOuPerfilAtualNaoMudaAutoriaNemPerfilHistorico() throws Exception {
        var historico = mensagem();
        autor.setPerfilResponsavel("Novo perfil");
        autor.setTipoUsuario(TipoUsuario.LIDER);
        autor.setNomeExibicao("Maria Almeida");
        entityManager.flush();
        entityManager.clear();
        mvc.perform(get(base()).header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].nomeExibicao").value("Maria Almeida"))
                .andExpect(jsonPath("$.content[0].perfilResponsavel").value("Perfil autor"))
                .andExpect(jsonPath("$.content[0].podeAlterar").value(true));
        mvc.perform(put(base() + "/" + historico.getId()).header("Authorization", token(autor))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"mensagem\":\"Editada\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.perfilResponsavel").value("Perfil autor"));
    }

    @Test
    void usuarioLegadoPreencheNomeSemExporLoginOuAlterarPermissoes() throws Exception {
        var historico = mensagem();
        autor.setNomeExibicao(null);
        entityManager.flush();
        mvc.perform(get(base()).header("Authorization", token(admin)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].nomeExibicao").isEmpty())
                .andExpect(jsonPath("$.content[0].usuario").doesNotExist())
                .andExpect(jsonPath("$.content[0].idUsuario").doesNotExist());
        mvc.perform(post(base()).header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Nova\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/auth/perfil").header("Authorization", token(autor)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.nomeExibicao").isEmpty())
                .andExpect(jsonPath("$.login").doesNotExist()).andExpect(jsonPath("$.id").doesNotExist());
        mvc.perform(put("/auth/perfil").header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomeExibicao\":\"  Maria Silva  \",\"id\":" + admin.getId()
                                + ",\"login\":\"forjado\",\"tipoUsuario\":\"ADMIN\",\"perfilResponsavel\":\"Outro\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.nomeExibicao").value("Maria Silva"));
        entityManager.flush();
        entityManager.clear();
        var atualizado = usuarios.findById(autor.getId()).orElseThrow();
        assertThat(atualizado.getLogin()).isEqualTo("autor");
        assertThat(atualizado.getTipoUsuario()).isEqualTo(TipoUsuario.LIDER);
        assertThat(atualizado.getPerfilResponsavel()).isEqualTo("Perfil autor");
        assertThat(usuarios.findById(admin.getId()).orElseThrow().getNomeExibicao()).isEqualTo("Maria Souza");
        mvc.perform(post(base()).header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\":\"Nova\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.nomeExibicao").value("Maria Silva"));
        assertThat(mensagens.findById(historico.getId()).orElseThrow().getUsuario().getId()).isEqualTo(autor.getId());
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"nomeExibicao\":null}", "{\"nomeExibicao\":\"\"}", "{\"nomeExibicao\":\"   \"}"})
    void nomePublicoObrigatorioNoPerfilENoCadastro(String corpo) throws Exception {
        mvc.perform(put("/auth/perfil").header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$[0].campo").value("nomeExibicao"));
        String cadastro = corpo.substring(0, corpo.length() - 1)
                + (corpo.length() > 2 ? "," : "")
                + "\"login\":\"novo\",\"senha\":\"senha-teste\",\"senhaAcesso\":\"chave-de-teste\",\"perfilResponsavel\":\"Administrador\"}";
        mvc.perform(post("/auth/adm").contentType(MediaType.APPLICATION_JSON).content(cadastro))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$[0].campo").value("nomeExibicao"));
    }

    @Test
    void validaLimiteDoNomeEProtegePerfilSemAutenticacao() throws Exception {
        mvc.perform(put("/auth/perfil").header("Authorization", token(autor)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomeExibicao\":\"" + "a".repeat(256) + "\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/auth/perfil")).andExpect(status().isForbidden());
        mvc.perform(put("/auth/perfil").contentType(MediaType.APPLICATION_JSON).content("{\"nomeExibicao\":\"Maria\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void cadastroGravaNomeELoginContinuaSemExigirNome() throws Exception {
        mvc.perform(post("/auth/adm").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"login\":\"novo\",\"senha\":\"senha-teste\",\"senhaAcesso\":\"chave-de-teste\","
                                + "\"perfilResponsavel\":\"Administrador\",\"nomeExibicao\":\" João Silva \"}"))
                .andExpect(status().isOk());
        entityManager.flush();
        entityManager.clear();
        assertThat(((Usuario) usuarios.findByLogin("novo")).getNomeExibicao()).isEqualTo("João Silva");
        mvc.perform(post("/auth").contentType(MediaType.APPLICATION_JSON).content("{\"login\":\"novo\",\"senha\":\"senha-teste\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.tokenJWT").isNotEmpty());
    }

    private Usuario usuario(String login, TipoUsuario tipo) {
        // Nomes iguais intencionalmente: autorização nunca pode depender do nome público.
        return usuarios.save(new Usuario(login, "senha-teste", "Perfil " + login, tipo, "Maria Souza"));
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
