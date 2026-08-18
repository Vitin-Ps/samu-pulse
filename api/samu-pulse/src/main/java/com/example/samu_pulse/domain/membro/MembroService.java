package com.example.samu_pulse.domain.membro;

import com.example.samu_pulse.domain.membro.dto.DadosMembroRequest;
import com.example.samu_pulse.domain.membro.dto.MembroResponse;
import com.example.samu_pulse.infra.FuncionalidadesService;
import com.example.samu_pulse.infra.exception.ApiException;
import com.example.samu_pulse.infra.file.ArquivoService;
import com.example.samu_pulse.repository.MembroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MembroService {

    @Autowired
    private MembroRepository membroRepository;

    @Autowired
    private ArquivoService arquivoService;

    public MembroResponse createMembro(DadosMembroRequest dados) {
        Membro newMembro = new Membro(dados);

        membroRepository.save(newMembro);

        return new MembroResponse(newMembro);
    }

    public void validaPessoaAutorizada(Long idMembro) {
//        HttpServletRequest request = RequestUtil.getRequest();
//        String tokenJWT = securityFilter.recuperarToken(request);
//        DecodedJWT decodedJWT = tokenService.extractAllClaims(tokenJWT);
//
//        // 1. Validação de presença de dados no Token
//        Claim idClaim = decodedJWT.getClaim("id");
//        Claim roleClaim = decodedJWT.getClaim("role");
//
//        if (idClaim.isNull() || roleClaim.isNull()) {
//            throw new ValidacaoException("Token inválido: informações de identificação ausentes.");
//        }
//
//        Long usuarioId = idClaim.asLong();
//        TipoUsuario tipoUsuario = TipoUsuario.valueOf(roleClaim.asString());
//
//        Funcionario funcionario = funcionarioRepository.getReferenceByIdAndAtivoTrue(idFuncionario);
//
//        if (funcionario == null) {
//            throw new ValidacaoException("Acesso negado: Funcionário inválido.");
//        }
//
//        switch (tipoUsuario) {
//            case PROPRIETARIO:
//                // Usando a query otimizada que já checa se o proprietário está ativo e é dono
//                if (!barbeariaRepository.isPropBarberShop(usuarioId, funcionario.getBarbearia().getId())) {
//                    throw new ValidacaoException("Acesso negado: Você não é o proprietário desta barbearia ou sua conta está inativa.");
//                }
//                break;
//
//            case BARBEIRO:
//                // Usando a query otimizada que já checa se o proprietário está ativo e é dono
//                if (!funcionarioRepository.isFunc(usuarioId, idFuncionario)) {
//                    throw new ValidacaoException("Acesso negado: Você não é o usuário deste Perfil.");
//                }
//                break;
//
//            case ADMIN:
//                // Administradores talvez possam editar qualquer uma?
//                // Se sim, você pode deixar passar sem erro.
//                break;
//
//            default:
//                throw new ValidacaoException("Tipo de usuário não autorizado para esta operação.");
//        }

    }


    public String atualizaImg(MultipartFile imagem, Long idMembro) {
        Membro membro = membroRepository.getReferenceByIdAndAtivoTrue(idMembro);

        if (membro == null) throw new ApiException("Membro não existe!");

        if (membro.getImagemUrl() != null) {
            arquivoService.deletarArquivo(
                    FuncionalidadesService.extrairNomeArquivo(membro.getImagemUrl()));
            membro.setImagemUrl("");
        }

        String imagemUrl = arquivoService.enviarArquivo(imagem, null);
        membro.setImagemUrl(imagemUrl);

        return imagemUrl;
    }

    public void delImg(Long id, String imgUrl) {
        Membro membro = membroRepository.getReferenceByIdAndAtivoTrue(id);
        if (membro == null) throw new ApiException("Membro não existe!");
        arquivoService.deletarArquivo(FuncionalidadesService.extrairNomeArquivo(imgUrl));
        membro.setImagemUrl(null);
    }

}
