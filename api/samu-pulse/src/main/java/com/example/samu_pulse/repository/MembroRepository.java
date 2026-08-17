package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.membro.Membro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembroRepository extends JpaRepository<Membro, Integer> {
}
