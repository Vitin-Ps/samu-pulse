package com.example.samu_pulse.controller;

import com.example.samu_pulse.domain.usuario.UsuarioService;
import com.example.samu_pulse.domain.usuario.dto.DadosAcessoUsuarioUpdate;
import com.example.samu_pulse.domain.usuario.dto.UsuarioAdminResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("admin/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioAdminController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<UsuarioAdminResponse>> listar(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 20, sort = "login") Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listarUsuarios(search, pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioAdminResponse> atualizar(@PathVariable Integer id,
                                                         @RequestBody @Valid DadosAcessoUsuarioUpdate dados) {
        return ResponseEntity.ok(usuarioService.atualizarAcesso(id, dados));
    }
}
