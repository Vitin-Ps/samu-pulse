package com.example.samu_pulse.controller;

import com.example.samu_pulse.domain.usuario.DadosAutenticacao;
import com.example.samu_pulse.domain.usuario.TipoUsuario;
import com.example.samu_pulse.domain.usuario.Usuario;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.infra.security.DadosTokenJWT;
import com.example.samu_pulse.infra.security.TokenService;
import com.example.samu_pulse.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import static io.micrometer.common.util.StringUtils.isEmpty;


@RestController
@RequestMapping("auth")
public class AuthenticationController {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Value("${spring.senha.first-acesso}")
    private String senhaAcesso;


    @PostMapping
    public ResponseEntity<DadosTokenJWT> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var autenticacaoToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var autenticacao = manager.authenticate(autenticacaoToken);
        var tokenJWT = tokenService.gerarToken((Usuario) autenticacao.getPrincipal());
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }

    @CrossOrigin(origins = "http://localhost:8080")
    @PostMapping("/adm")
    @Transactional
    public ResponseEntity<Void> cadAdmin(@RequestBody @Valid DadosAutenticacao dados) {
        if (isEmpty(dados.senhaAcesso()) || !dados.senhaAcesso().equals(senhaAcesso)) {
            throw new ApiException("Senha chave para cadastrar admin inválida!");
        }

        String senhaCodificada = new BCryptPasswordEncoder().encode(dados.senha());
        Usuario usuario = new Usuario(dados.login(), senhaCodificada, dados.perfilResponsavel(), TipoUsuario.ADMIN);
        repository.save(usuario);
        return ResponseEntity.ok().build();
    }

//    @GetMapping
//    public ResponseEntity<Page<UsuarioResponse>> listUsers(@PageableDefault(size = 10, page = 0, sort = {"login"}) Pageable pageable) {
//        Page<UsuarioResponse> listUsers = usuarioRepository
//                .findAllByAtivoTrue(pageable)
//                .map(UsuarioResponse::new);
//
//        return ResponseEntity.ok(listUsers);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<UsuarioResponse> detailsUser(@PathVariable Integer id) {
//        UsuarioResponse response = new UsuarioResponse(usuarioRepository.
//                findByIdAndAtivoTrue(id));
//
//        return ResponseEntity.ok(response);
//    }
//
//    @DeleteMapping("/{id}")
//    @Transactional
//    public ResponseEntity<Void> disableUser(@PathVariable Integer id) {
//        Usuario usuario = usuarioRepository.getReferenceByIdAndAtivoTrue(id);
//
//        if(usuario == null) {
//            throw new ApiException("Usuário Inválido!");
//        }
//
//        usuario.setAtivo(false);
//
//        return ResponseEntity.noContent().build();
//    }

}
