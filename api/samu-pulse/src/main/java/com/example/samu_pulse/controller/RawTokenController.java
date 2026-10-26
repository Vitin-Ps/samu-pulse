package com.example.samu_pulse.controller;

import com.example.samu_pulse.infra.rawToken.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("token")
public class RawTokenController {
    @Autowired private FluxoTokenService fluxo;

    @PostMapping("gerar")
    public ResponseEntity<DadosFluxoToken.Link> gerar(@RequestBody @Valid DadosFluxoToken.Criacao dados) {
        return ResponseEntity.ok(fluxo.gerar(dados));
    }

    @PostMapping("consultar-convite")
    public ResponseEntity<?> consultar(@RequestBody @Valid DadosFluxoToken.Token dados) {
        return ResponseEntity.ok(Map.of("tipoUsuario", fluxo.consultarConvite(dados.rawToken())));
    }

    @PostMapping("enviar-convite")
    public ResponseEntity<Void> enviar(@RequestBody @Valid DadosFluxoToken.Envio dados) {
        fluxo.enviarConvite(dados);
        return ResponseEntity.ok().build();
    }

    @PostMapping("token-senha")
    public ResponseEntity<?> recuperar(@RequestBody @Valid DadosFluxoToken.Recuperacao dados) {
        fluxo.solicitarRecuperacao(dados);
        return ResponseEntity.ok(Map.of("message", "Se o e-mail estiver cadastrado, você receberá o link de recuperação."));
    }

    @PutMapping("senha")
    public ResponseEntity<Void> redefinir(@RequestBody @Valid DadosFluxoToken.NovaSenha dados) {
        fluxo.redefinirSenha(dados);
        return ResponseEntity.ok().build();
    }
}
