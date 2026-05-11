package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Page<Usuario> findAllByAtivoTrue(Pageable pageable);

    Usuario findByIdAndAtivoTrue(Integer id);

    Usuario getReferenceByIdAndAtivoTrue(Integer id);
}
