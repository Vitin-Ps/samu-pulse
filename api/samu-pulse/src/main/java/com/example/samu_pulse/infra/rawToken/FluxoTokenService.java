package com.example.samu_pulse.infra.rawToken;

import com.example.samu_pulse.domain.usuario.TipoUsuario;
import com.example.samu_pulse.domain.usuario.Usuario;
import com.example.samu_pulse.domain.usuario.UsuarioService;
import com.example.samu_pulse.infra.email.*;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FluxoTokenService {
    @Autowired
    private TokenTransparenteService tokens;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emails;

    @Value("${SITE_URL}")
    private String siteUrl;
    
    private final Map<String, TipoUsuario> convites = new ConcurrentHashMap<>();
    private final Set<String> recuperacoes = ConcurrentHashMap.newKeySet();

    private String link(String rota, String token) {
        return siteUrl.replaceAll("/+$", "") + rota + URLEncoder.encode(token, StandardCharsets.UTF_8);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public DadosFluxoToken.Link gerar(DadosFluxoToken.Criacao dados) {
        Usuario admin = usuarioService.usuarioAutenticado();
        manager.authenticate(new UsernamePasswordAuthenticationToken(admin.getLogin(), dados.senha()));
        String token = tokens.gerarToken(admin);
        convites.put(token, dados.tipoUsuario());
        return new DadosFluxoToken.Link(token, link("/auth/sign-up?token-transparente=", token), dados.tipoUsuario());
    }

    public TipoUsuario consultarConvite(String token) {
        TipoUsuario tipo = convites.get(token);
        if (tipo == null) throw new ApiException("Link de cadastro inválido ou indisponível");
        tokens.verificarToken(token);
        Usuario criador = tokens.retornaUsuario(token);
        if (!criador.isEnabled() || criador.getTipoUsuario() != TipoUsuario.ADMIN)
            throw new ApiException("Esse token é de um usuário sem autoridade para essa ação");
        return tipo;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void enviarConvite(DadosFluxoToken.Envio dados) {
        consultarConvite(dados.rawToken());
        emails.enviarEmail(new DadosEnviarEmail(dados.email(), "Samu Pulse: convite para criar seu perfil",
                MensagensEmail.criarPerfil(link("/auth/sign-up?token-transparente=", dados.rawToken()))));
    }

    @Transactional
    public void cadastrar(DadosFluxoToken.Cadastro dados) {
        TipoUsuario tipo = consultarConvite(dados.rawToken());
        if (!dados.senha().equals(dados.confirmaSenha())) throw new ApiException("Senhas não são iguais.");
        String login = dados.login() == null || dados.login().isBlank() ? dados.email().strip() : dados.login().strip();
        if (login.length() > 100) throw new ApiException("Informe um login com até 100 caracteres.");
        if (usuarios.existsByLogin(login)) throw new ApiException("Login já cadastrado!");
        if (usuarios.findByEmailIgnoreCaseAndAtivoTrue(dados.email().strip()).isPresent())
            throw new ApiException("E-mail já cadastrado!");
        tokens.validaToken(dados.rawToken());
        Usuario usuario = new Usuario(login, encoder.encode(dados.senha()), dados.perfilResponsavel().strip(), tipo,
                dados.nomeExibicao().strip());
        usuario.setEmail(dados.email().strip());
        usuarios.save(usuario);
        convites.remove(dados.rawToken());
    }

    public void solicitarRecuperacao(DadosFluxoToken.Recuperacao dados) {
        usuarios.findByEmailIgnoreCaseAndAtivoTrue(dados.login().strip()).ifPresent(usuario -> {
            String token = tokens.gerarToken(usuario);
            recuperacoes.add(token);
            emails.enviarEmail(new DadosEnviarEmail(usuario.getEmail(), "Samu Pulse: link para recuperar senha",
                    MensagensEmail.recuperarSenha(usuario.getNomeExibicao() == null ? usuario.getLogin() : usuario.getNomeExibicao(),
                            link("/auth/sign-in/password-reset?token=", token))));
        });
    }

    @Transactional
    public void redefinirSenha(DadosFluxoToken.NovaSenha dados) {
        if (!recuperacoes.contains(dados.rawToken()))
            throw new ApiException("Link de recuperação inválido ou indisponível");
        if (!dados.novaSenha().equals(dados.confirmaSenha())) throw new ApiException("Senhas não são iguais.");
        tokens.validaToken(dados.rawToken());
        Usuario usuario = tokens.retornaUsuario(dados.rawToken());
        usuario.setSenha(encoder.encode(dados.novaSenha()));
        recuperacoes.remove(dados.rawToken());
    }
}
