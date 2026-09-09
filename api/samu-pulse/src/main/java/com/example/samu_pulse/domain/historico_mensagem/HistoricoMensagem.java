package com.example.samu_pulse.domain.historico_mensagem;

import com.example.samu_pulse.domain.membro.Membro;
import com.example.samu_pulse.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "historico_mensagem")
@Entity(name = "HistoricoMensagem")
@EqualsAndHashCode(of = "id")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class HistoricoMensagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataRegistro;
    private LocalDateTime dataAlteracao;
    private String mensagem;
    @Column(nullable = false, updatable = false)
    private String perfilResponsavel;
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false, updatable = false)
    private Usuario usuario;
    @ManyToOne
    @JoinColumn(name = "id_membro", nullable = false, updatable = false)
    private Membro membro;

    public HistoricoMensagem(Membro membro, Usuario usuario, String mensagem) {
        this.membro = membro;
        this.usuario = usuario;
        this.perfilResponsavel = usuario.getPerfilResponsavel();
        this.mensagem = mensagem;
        this.dataRegistro = LocalDateTime.now();
    }

    public void atualizarMensagem(String mensagem) {
        if (!java.util.Objects.equals(this.mensagem, mensagem)) {
            this.mensagem = mensagem;
            this.dataAlteracao = LocalDateTime.now();
        }
    }
}
