package com.example.samu_pulse.repository;

import com.example.samu_pulse.domain.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    @Query("""
            SELECT u FROM Usuario u
            WHERE LOWER(u.login) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(COALESCE(u.nomeExibicao, '')) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Usuario> pesquisarUsuarios(@Param("search") String search, Pageable pageable);

    UserDetails findByLogin(String username);


    Page<Usuario> findAllByAtivoTrue(Pageable pageable);

    Usuario findByIdAndAtivoTrue(Integer id);

    Usuario getReferenceByIdAndAtivoTrue(Integer id);
}
