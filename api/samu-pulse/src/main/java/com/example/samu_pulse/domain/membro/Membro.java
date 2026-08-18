package com.example.samu_pulse.domain.membro;

import com.example.samu_pulse.domain.membro.dto.DadosMembroRequest;
import com.example.samu_pulse.domain.membro.dto.DadosMembroUpdate;
import io.micrometer.common.util.StringUtils;
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
    public Boolean atualizaInformacoes(DadosMembroUpdate dados) {
        boolean alterado = false;

        if (!StringUtils.isBlank(dados.nome())) {
            this.nome = dados.nome();
            alterado = true;
        }
        if (!StringUtils.isBlank(dados.telefone())) {
            this.telefone = dados.telefone();
            alterado = true;
        }
        if (dados.dataNascimento() != null) {
            this.dataNascimento = dados.dataNascimento();
            alterado = true;
        }
        if (!StringUtils.isBlank(dados.endereco())) {
            this.endereco = dados.endereco();
            alterado = true;
        }
        if (!StringUtils.isBlank(dados.observacao())) {
            this.observacao = dados.observacao();
            alterado = true;
        }

        return alterado;
    }

}
