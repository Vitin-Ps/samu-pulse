package com.example.samu_pulse.domain.membro;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "status_membro")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "codStatus")
public class StatusMembro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_status")
    private Integer codStatus;
    @Setter
    private String nome;
    @Setter
    private String cor;
}
