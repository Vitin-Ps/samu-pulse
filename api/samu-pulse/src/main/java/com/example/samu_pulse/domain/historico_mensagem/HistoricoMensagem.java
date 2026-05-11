package com.example.samu_pulse.domain.historico_mensagem;

import com.example.samu_pulse.domain.novo_convertido.NovoConvertido;
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
    private LocalDateTime dataRegistro;
    private String mensagem;
    private String perfilResponsavel;
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
    @ManyToOne
    @JoinColumn(name = "id_novo_convertido")
    private NovoConvertido novoConvertido;
}
