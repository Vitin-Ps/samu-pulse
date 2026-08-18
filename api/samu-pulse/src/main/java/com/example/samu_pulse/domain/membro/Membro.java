package com.example.samu_pulse.domain.membro;

import com.example.samu_pulse.domain.membro.dto.DadosMembroRequest;
import jakarta.persistence.*;
import lombok.*;

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
    private LocalDate dataNascimento;
    private Boolean isBatizado;
    @Enumerated(EnumType.STRING)
    private TipoConversao tipoConversao;
    private String endereco;
    private String telefone;
    private String observacao;
    private LocalDateTime dataUltimoContato;
    @Enumerated(EnumType.STRING)
    private TipoMembro tipo;
    @Setter
    private String imagemUrl;
    private Boolean ativo = true;



    public Membro(DadosMembroRequest dados) {
        this.nome = dados.nome();
        this.telefone = dados.telefone();
        this.dataNascimento = dados.dataNascimento();
        this.endereco = dados.endereco();
        this.observacao = dados.observacao();
        this.tipo = TipoMembro.MEMBRO;
        this.ativo = true;
    }
}
