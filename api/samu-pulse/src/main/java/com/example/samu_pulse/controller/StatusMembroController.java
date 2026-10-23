package com.example.samu_pulse.controller;

import com.example.samu_pulse.domain.membro.StatusMembroService;
import com.example.samu_pulse.domain.membro.dto.DadosStatusRequest;
import com.example.samu_pulse.domain.membro.dto.DadosStatusUpdate;
import com.example.samu_pulse.domain.membro.dto.StatusMembroResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("status-membro")
public class StatusMembroController {
    @Autowired
    private StatusMembroService statusService;

    @GetMapping
    public ResponseEntity<List<StatusMembroResponse>> listar() {
        return ResponseEntity.ok(statusService.listar());
    }

    @PostMapping
    public ResponseEntity<StatusMembroResponse> criar(@RequestBody @Valid DadosStatusRequest dados) {
        return ResponseEntity.ok(statusService.criar(dados));
    }

    @DeleteMapping("/{codStatus}")
    public ResponseEntity<Void> excluir(@PathVariable Integer codStatus) {
        statusService.excluir(codStatus);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{codStatus}")
    public ResponseEntity<StatusMembroResponse> atualizar(@PathVariable Integer codStatus,
                                                          @RequestBody @Valid DadosStatusUpdate dados) {
        return ResponseEntity.ok(statusService.atualizar(codStatus, dados));
    }
}
