package com.example.samu_pulse.infra.rawToken;

import com.example.samu_pulse.domain.usuario.TipoUsuario;
import jakarta.validation.constraints.*;

public class DadosFluxoToken {
    public record Criacao(@NotBlank String senha, @NotNull TipoUsuario tipoUsuario) {}
    public record Token(@NotBlank String rawToken) {}
    public record Envio(@NotBlank String rawToken, @NotBlank @Email String email) {}
    public record Recuperacao(@NotBlank @Email String login) {}
    public record NovaSenha(@NotBlank String rawToken, @NotBlank String novaSenha, @NotBlank String confirmaSenha) {}
    public record Cadastro(@NotBlank String rawToken, @Size(max = 100) String login,
                           @NotBlank @Email @Size(max = 255) String email,
                           @NotBlank String senha, @NotBlank String confirmaSenha,
                           @NotBlank @Size(max = 255) String nomeExibicao,
                           @NotBlank @Size(max = 255) String perfilResponsavel) {}
    public record Link(String token, String link, TipoUsuario tipoUsuario) {}
}
