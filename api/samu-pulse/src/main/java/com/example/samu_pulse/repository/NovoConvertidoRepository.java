package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.novo_convertido.NovoConvertido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NovoConvertidoRepository extends JpaRepository<NovoConvertido, Integer> {
}
