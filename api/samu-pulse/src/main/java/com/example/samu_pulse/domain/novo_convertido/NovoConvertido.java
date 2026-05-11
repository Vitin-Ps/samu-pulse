package com.example.samu_pulse.domain.novo_convertido;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "novo_convertido")
@Entity(name = "NovoConvertido")
@EqualsAndHashCode(of = "id")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NovoConvertido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private LocalDate dataConversao;
    @Enumerated(EnumType.STRING)
    private TipoConversao tipoConversao;
    private Boolean isBatizado;
    private String endereco;
    private String observacao;
    private LocalDateTime dataUltimoContato;
    private Boolean ativo = true;
}
