package com.example.samu_pulse;

import com.example.samu_pulse.domain.membro.StatusMembro;
import com.example.samu_pulse.domain.membro.StatusMembroService;
import com.example.samu_pulse.domain.membro.dto.DadosStatusRequest;
import com.example.samu_pulse.domain.membro.dto.DadosStatusUpdate;
import com.example.samu_pulse.domain.membro.dto.StatusMembroResponse;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.repository.MembroRepository;
import com.example.samu_pulse.repository.StatusMembroRepository;
import jakarta.validation.Validation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = StatusMembroServiceTests.Config.class)
@WithMockUser(roles = "ADMIN")
class StatusMembroServiceTests {
    @Configuration
    @EnableMethodSecurity
    static class Config {
        @Bean StatusMembroRepository statusRepository() { return mock(StatusMembroRepository.class); }
        @Bean MembroRepository membroRepository() { return mock(MembroRepository.class); }
        @Bean StatusMembroService statusService() { return new StatusMembroService(); }
    }
    @Autowired StatusMembroService service;
    @Autowired StatusMembroRepository statusRepository;
    @Autowired MembroRepository membroRepository;
    StatusMembro status = new StatusMembro(10, "Personalizado", "#abcdef");

    @BeforeEach
    void preparar() {
        reset(statusRepository, membroRepository);
        when(statusRepository.findById(10)).thenReturn(Optional.of(status));
    }

    @Test
    void administradorCriaComCorLivre() {
        when(statusRepository.save(any(StatusMembro.class))).thenReturn(status);
        assertThat(service.criar(new DadosStatusRequest("Personalizado", "#abcdef")))
                .isEqualTo(new StatusMembroResponse(status));
        verify(statusRepository).save(argThat(item -> item.getNome().equals("Personalizado")
                && item.getCor().equals("#abcdef")));
    }

    @Test
    void renomeiaStatusPreservandoIdentificadorCorEVinculos() {
        var resposta = service.atualizar(10, new DadosStatusUpdate("Novo nome", null));
        assertThat(resposta.cod_status()).isEqualTo(10);
        assertThat(resposta.nome()).isEqualTo("Novo nome");
        assertThat(resposta.cor()).isEqualTo("#abcdef");
        verifyNoInteractions(membroRepository);
        verify(statusRepository, never()).delete(any());
    }

    @Test
    void atualizaNomeECorPreservandoIdentificadorEVinculos() {
        var resposta = service.atualizar(10, new DadosStatusUpdate("Novo nome", "#123abc"));
        assertThat(resposta.cod_status()).isEqualTo(10);
        assertThat(resposta.nome()).isEqualTo("Novo nome");
        assertThat(resposta.cor()).isEqualTo("#123abc");
        verifyNoInteractions(membroRepository);
        verify(statusRepository, never()).delete(any());
    }

    @Test
    void renomearStatusInexistenteRetornaNaoEncontrado() {
        assertThatThrownBy(() -> service.atualizar(999, new DadosStatusUpdate("Novo nome", null)))
                .isInstanceOf(jakarta.persistence.EntityNotFoundException.class);
    }

    @Test
    @WithMockUser(roles = "LIDER")
    void liderNaoPodeCriarOuExcluir() {
        assertThatThrownBy(() -> service.criar(new DadosStatusRequest("Teste", "#123456")))
                .isInstanceOf(AccessDeniedException.class);
        assertThatThrownBy(() -> service.excluir(10)).isInstanceOf(AccessDeniedException.class);
        assertThatThrownBy(() -> service.atualizar(10, new DadosStatusUpdate("Novo nome", null)))
                .isInstanceOf(AccessDeniedException.class);
        verifyNoInteractions(statusRepository, membroRepository);
    }

    @Test
    @WithMockUser(roles = "USER")
    void usuarioComumNaoPodeCriarOuExcluir() {
        assertThatThrownBy(() -> service.criar(new DadosStatusRequest("Teste", "#123456")))
                .isInstanceOf(AccessDeniedException.class);
        assertThatThrownBy(() -> service.excluir(10)).isInstanceOf(AccessDeniedException.class);
        verifyNoInteractions(statusRepository, membroRepository);
    }

    @Test
    void impedeExclusaoComQualquerMembroAssociado() {
        when(membroRepository.existsByStatus_CodStatus(10)).thenReturn(true);
        assertThatThrownBy(() -> service.excluir(10)).isInstanceOf(ApiException.class)
                .hasMessageContaining("associado a membros");
        verify(statusRepository, never()).delete(any());
    }

    @Test
    void excluiStatusSemAssociacoes() {
        service.excluir(10);
        verify(statusRepository).delete(status);
        verify(statusRepository).flush();
    }

    @Test
    void trataAssociacaoConcorrenteImpedidaPelaChaveEstrangeira() {
        doThrow(new DataIntegrityViolationException("fk_membro_status")).when(statusRepository).flush();
        assertThatThrownBy(() -> service.excluir(10)).isInstanceOf(ApiException.class)
                .hasMessageContaining("associado a membros");
    }

    @Test
    void rejeitaIdentificadorInexistenteOuAusente() {
        assertThatThrownBy(() -> service.buscar(999)).isInstanceOf(ApiException.class);
        assertThatThrownBy(() -> service.buscar(null)).isInstanceOf(ApiException.class);
    }

    @Test
    void validaNomeECorSemRestringirPaleta() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            assertThat(validator.validate(new DadosStatusRequest("Novo", "#a1B2c3"))).isEmpty();
            assertThat(validator.validate(new DadosStatusRequest(" ", "#a1B2c3"))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusRequest("Novo", "red"))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusRequest("Novo", null))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusUpdate("Novo nome", null))).isEmpty();
            assertThat(validator.validate(new DadosStatusUpdate("Novo nome", "#a1B2c3"))).isEmpty();
            assertThat(validator.validate(new DadosStatusUpdate("Novo nome", "red"))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusUpdate("Novo nome", ""))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusUpdate(" ", null))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusUpdate(null, null))).isNotEmpty();
            assertThat(validator.validate(new DadosStatusUpdate("a".repeat(256), null))).isNotEmpty();
        }
    }
}
