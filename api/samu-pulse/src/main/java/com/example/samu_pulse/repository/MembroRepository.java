package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.membro.Membro;
import com.example.samu_pulse.domain.membro.TipoMembro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface MembroRepository extends JpaRepository<Membro, Integer> {
    Page<Membro> findAllByAtivoTrueAndTipo(Pageable pageable, TipoMembro tipoMembro);


    @Query(value = """
                SELECT m.* FROM membro m
                WHERE (CAST(m.id AS TEXT) ILIKE CONCAT('%', :search, '%')
                       OR unaccent(m.nome) ILIKE unaccent(CONCAT('%', :search, '%'))
                       OR unaccent(m.telefone) ILIKE unaccent(CONCAT('%', :search, '%'))
                       OR unaccent(m.endereco) ILIKE unaccent(CONCAT('%', :search, '%'))
                )
                AND (CAST(:dataNascimento AS DATE) IS NULL OR m.data_nascimento = :dataNascimento)
                AND (CAST(:#{#tipoMembro?.name()} AS VARCHAR) IS NULL OR m.tipo = CAST(:#{#tipoMembro?.name()} AS VARCHAR))
                AND m.ativo = :ativo
            """, nativeQuery = true)
    Page<Membro> searchAllMembers(@Param("search") String search,
                                  @Param("dataNascimento") LocalDate dataNascimento,
                                  @Param("tipoMembro") TipoMembro tipoMembro,
                                  @Param("ativo") Boolean ativo,
                                  Pageable pageable);

    Membro getReferenceByIdAndAtivoTrue(Long idMembro);
}
