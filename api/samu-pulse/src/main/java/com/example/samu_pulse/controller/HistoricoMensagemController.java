package com.example.samu_pulse.controller;

import com.example.samu_pulse.domain.historico_mensagem.HistoricoMensagemService;
import com.example.samu_pulse.domain.historico_mensagem.dto.DadosHistoricoMensagemRequest;
import com.example.samu_pulse.domain.historico_mensagem.dto.HistoricoMensagemResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("membro/{idMembro}/mensagens")
public class HistoricoMensagemController {
    @Autowired
    private HistoricoMensagemService historicoMensagemService;

    @GetMapping
    public ResponseEntity<Page<HistoricoMensagemResponse>> listMessages(
            @PathVariable Integer idMembro,
            @PageableDefault(size = 10, sort = {"dataRegistro", "id"}, direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(historicoMensagemService.listarMensagens(idMembro, pageable));
    }

    @PostMapping
    public ResponseEntity<HistoricoMensagemResponse> createMessage(
            @PathVariable Integer idMembro, @RequestBody @Valid DadosHistoricoMensagemRequest dados) {
        return ResponseEntity.ok(historicoMensagemService.criarMensagem(idMembro, dados));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoricoMensagemResponse> updateMessage(
            @PathVariable Integer idMembro, @PathVariable Long id,
            @RequestBody @Valid DadosHistoricoMensagemRequest dados) {
        return ResponseEntity.ok(historicoMensagemService.editarMensagem(idMembro, id, dados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Integer idMembro, @PathVariable Long id) {
        historicoMensagemService.excluirMensagem(idMembro, id);
        return ResponseEntity.noContent().build();
    }
}
