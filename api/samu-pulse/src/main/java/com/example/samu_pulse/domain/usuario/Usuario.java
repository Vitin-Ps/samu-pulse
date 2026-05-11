package com.example.samu_pulse.domain.usuario;

import com.example.samu_pulse.domain.usuario.dto.DadosUsuarioRequest;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "usuario")
@Entity(name = "Usuario")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Getter
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String login;
    private String senha;
    private String perfilResponsavel;
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipoUsuario;
    @Setter
    private Boolean ativo = true;

    public Usuario(DadosUsuarioRequest dados) {
        this.login = dados.login();
        this.senha = "teste";
        this.perfilResponsavel = dados.perfilResponsavel();
        this.tipoUsuario = TipoUsuario.ADMIN;
    }
}
