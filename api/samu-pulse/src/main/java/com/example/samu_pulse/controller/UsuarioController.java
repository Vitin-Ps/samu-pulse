package com.example.samu_pulse.controller;

import com.example.samu_pulse.domain.usuario.Usuario;
import com.example.samu_pulse.domain.usuario.dto.DadosUsuarioRequest;
import com.example.samu_pulse.domain.usuario.dto.UsuarioResponse;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("user")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository;


    @PostMapping
    @Transactional
    public ResponseEntity<UsuarioResponse> createUser(DadosUsuarioRequest dados) {
        Usuario usuario = new Usuario(dados);

        usuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(new UsuarioResponse(usuario));
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioResponse>> listUsers(@PageableDefault(size = 10, page = 0, sort = {"login"}) Pageable pageable) {
        Page<UsuarioResponse> listUsers = usuarioRepository
                .findAllByAtivoTrue(pageable)
                .map(UsuarioResponse::new);

        return ResponseEntity.ok(listUsers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> detailsUser(@PathVariable Integer id) {
        UsuarioResponse response = new UsuarioResponse(usuarioRepository.
                findByIdAndAtivoTrue(id));

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> disableUser(@PathVariable Integer id) {
        Usuario usuario = usuarioRepository.getReferenceByIdAndAtivoTrue(id);

        if(usuario == null) {
            throw new ApiException("Usuário Inválido!");
        }

        usuario.setAtivo(false);

        return ResponseEntity.noContent().build();
    }

}
