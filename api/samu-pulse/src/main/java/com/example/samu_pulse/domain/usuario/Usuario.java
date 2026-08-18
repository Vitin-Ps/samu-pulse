package com.example.samu_pulse.domain.usuario;

import com.example.samu_pulse.domain.usuario.dto.DadosUsuarioRequest;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Table(name = "usuario")
@Entity(name = "Usuario")
@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario implements UserDetails {
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

    public Usuario(String login, String senhaCodificada,
                   String perfilResponsavel, TipoUsuario tipoUsuario) {
        this.login = login;
        this.senha = senhaCodificada;
        this.tipoUsuario = tipoUsuario;
        this.perfilResponsavel = perfilResponsavel;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(this.tipoUsuario == TipoUsuario.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        if(this.tipoUsuario == TipoUsuario.LIDER) return List.of(new SimpleGrantedAuthority("ROLE_LIDER"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
