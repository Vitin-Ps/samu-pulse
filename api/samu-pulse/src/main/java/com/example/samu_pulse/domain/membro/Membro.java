package com.example.samu_pulse.domain.membro;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table(name = "membro")
@Entity(name = "Membro")
@EqualsAndHashCode(of = "id")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Membro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private LocalDate dataConversao;
    private Boolean isBatizado;
    @Enumerated(EnumType.STRING)
    private TipoConversao tipoConversao;
    private String endereco;
    private String observacao;
    private LocalDateTime dataUltimoContato;
    @Enumerated(EnumType.STRING)
    private TipoMembro tipo;
    private Boolean ativo = true;
}
