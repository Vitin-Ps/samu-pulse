package com.example.samu_pulse.controller;

import com.example.samu_pulse.domain.membro.MembroService;
import com.example.samu_pulse.domain.membro.TipoMembro;
import com.example.samu_pulse.domain.membro.dto.DadosMembroRequest;
import com.example.samu_pulse.domain.membro.dto.MembroResponse;
import com.example.samu_pulse.repository.MembroRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("membro")
public class MembroController {
    @Autowired
    private MembroService membroService;

    @Autowired
    private MembroRepository membroRepository;


    @PostMapping
    @Transactional
    public ResponseEntity<MembroResponse> createMember(@RequestBody @Valid DadosMembroRequest dados) {

        MembroResponse newMembro = membroService.createMembro(dados);

        return ResponseEntity.ok(newMembro);
    }

    @GetMapping
    public ResponseEntity<Page<MembroResponse>>
    listMembers(@PageableDefault(size = 10, page = 0, sort = {"nome"}) Pageable pageable, @RequestParam(name = "search") String search) {
        Page<MembroResponse> newListMembers = membroRepository
                .searchAllMembers(search, null, TipoMembro.MEMBRO, true, pageable)
                .map(MembroResponse::new);

        return ResponseEntity.ok(newListMembers);
    }

    @PostMapping("/img")
    @Transactional
//    @PreAuthorize("hasAnyRole('ADMIN', 'PROPRIETARIO', 'BARBEIRO')")
    public ResponseEntity<String> atualizaImagem(@RequestPart(value = "imagem") MultipartFile imagem,
                                                 @RequestParam(value = "idMembro") Long idMembro) {
        membroService.validaPessoaAutorizada(idMembro);
        String newImagemUrl = membroService.atualizaImg(imagem, idMembro);
        return ResponseEntity.ok(newImagemUrl);
    }

    @DeleteMapping("/img/{id}/{imgString}")
    @Transactional
    public ResponseEntity<Void> delImagem(@PathVariable Long id, @PathVariable String imgString) {
        membroService.delImg(id, imgString);
        return ResponseEntity.ok().build();
    }


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
//        if (usuario == null) {
//            throw new ApiException("Usuário Inválido!");
//        }
//
//        usuario.setAtivo(false);
//
//        return ResponseEntity.noContent().build();
//    }

}
