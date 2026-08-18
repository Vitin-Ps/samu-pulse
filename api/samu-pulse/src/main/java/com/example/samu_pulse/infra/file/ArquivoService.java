package com.example.samu_pulse.infra.file;

import com.example.samu_pulse.infra.FuncionalidadesService;
import com.example.samu_pulse.infra.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ArquivoService {
    private final Path arquivoLocalizacao;

    public ArquivoService(ArquivoPropriedade arquivoPropriedade) {
        this.arquivoLocalizacao = Paths.get(arquivoPropriedade.getUploadDir())
                .toAbsolutePath().normalize();
    }

    public String enviarArquivo(MultipartFile arquivo, String nomeArquivoAtual) {
        String nomeArquivo = FuncionalidadesService.gerarNomeArquivoTimestamp(arquivo.getOriginalFilename());
        if(nomeArquivoAtual != null) {
            if(!arquivoJaExiste(nomeArquivoAtual)) throw new ApiException("Nome do arquivo atual está errado!");
            nomeArquivo = nomeArquivoAtual;
        }
        nomeArquivo = FuncionalidadesService.formatarNomeArquivo(nomeArquivo);
        try{
            Path targetLocalizacao = arquivoLocalizacao.resolve(nomeArquivo);
            arquivo.transferTo(targetLocalizacao);

//            String uriArquivoDownload = ServletUriComponentsBuilder.fromCurrentContextPath()
//                    .path(  "/arquivos/")
//                    .path(nomeArquivo)
//                    .toUriString();
            return nomeArquivo;
        } catch (IOException ex) {
            throw new ApiException("Falha no Upload do arquivo! ERROR: " + ex.getMessage());
        }
    }

    private boolean arquivoJaExiste(String nomeArquivo) {
        Path caminhoArquivo = arquivoLocalizacao.resolve(nomeArquivo);
        return Files.exists(caminhoArquivo);
    }

    public ResponseEntity<Resource> downloadArquivo(String fileName, HttpServletRequest request) throws IOException {
        Path nomeArquivo = arquivoLocalizacao.resolve(fileName).normalize();
        try {
            Resource resource = new UrlResource(nomeArquivo.toUri());
            String contentType = request.getServletContext().getMimeType((resource.getFile().getAbsolutePath()));
            if(contentType == null) contentType = "application/octet-stream";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new ApiException("Erro ao buscar link para download!");
        }
    }

    public List<DadosNomeArquivo> listarArquivos() throws IOException {
        List<String> nomeArquivos = Files.list(arquivoLocalizacao)
                .map(Path::getFileName)
                .map(Path::toString)
                .toList();
        return nomeArquivos.stream().map(DadosNomeArquivo::new).toList();
    }

    public void deletarArquivo(String nomeArquivo) {
        if(!arquivoJaExiste(nomeArquivo)) return;
        System.out.println(arquivoLocalizacao);
        Path arquivoPath = arquivoLocalizacao.resolve(nomeArquivo);
        try {
            Files.delete(arquivoPath);
        } catch (IOException e) {
            throw new ApiException("Erro ao excluir arquivo!");
        }
    }
}

