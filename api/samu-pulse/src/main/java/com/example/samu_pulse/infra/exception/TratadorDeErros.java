package com.example.samu_pulse.infra.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class TratadorDeErros {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity erro404() {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity erro400(MethodArgumentNotValidException ex) {
        var erros = ex.getFieldErrors();
        return ResponseEntity.badRequest().body(erros.stream().map(DadosErroValidacao::new).toList());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity erro400(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

//    @ExceptionHandler(AuthenticationException.class)
//    public ResponseEntity erroAuthetication() {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Falha na Autenticação!");
//    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity erroAcessoNegado() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso Negado!");
    }

//    @ExceptionHandler(InternalAuthenticationServiceException.class)
//    public ResponseEntity tratarErroDeLoginNaoCadastrado() {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha incorretos!");
//    }
//
//    @ExceptionHandler(BadCredentialsException.class)
//    public ResponseEntity tratarErroBadCredentials() {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha incorretos!");
//    }

    @ExceptionHandler
    public ResponseEntity erro500(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro: " + ex.getLocalizedMessage());
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity tratarRegraDeNegocio(ApiException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

//    @ExceptionHandler(TokenExpiredException.class)
//    public ResponseEntity tokenExpirado(TokenExpiredException ex) {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Expirado: " + ex.getLocalizedMessage());
//    }
//
//    @ExceptionHandler(DataIntegrityViolationException.class)
//    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(FuncionalidadesService.extrairChaveDuplicada(ex.getRootCause().getMessage()));
//    }

    public record DadosErroValidacao(String campo, String mensagem) {
        public DadosErroValidacao(FieldError erro) {
            this(erro.getField(), erro.getDefaultMessage());
        }
    }
}
