package com.example.samu_pulse.infra;

import com.example.samu_pulse.infra.exception.ApiException;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public abstract class FuncionalidadesService {

    public static String formatarNomeArquivo(String nomeArquivo) {
        // Transforma tudo em letra minúscula
        nomeArquivo = nomeArquivo.toLowerCase();
        // Remove caracteres especiais
        nomeArquivo = removerCaracteresEspeciais(nomeArquivo);
        // Substitui espaços por _
        nomeArquivo = nomeArquivo.replace(" ", "_");
        return nomeArquivo;
    }

    public static String removerCaracteresEspeciais(String texto) {
        // Remove acentos e outros caracteres especiais
        texto = Normalizer.normalize(texto, Normalizer.Form.NFD);
        texto = texto.replaceAll("[^\\p{ASCII}]", "");
        return texto;
    }

    public static String extrairNomeArquivo(String linkArquivo) {
        if (linkArquivo == null) return null;

        String[] linkPartido = linkArquivo.split("/");
        String nomeArquivo = linkPartido[linkPartido.length - 1];
        return nomeArquivo;
    }

    public static String gerarNomeArquivoTimestamp(String nomeOriginal) {
        String nomeArquivo = StringUtils.cleanPath(nomeOriginal);
        String nomeBase = nomeArquivo.substring(0, nomeArquivo.lastIndexOf('.'));
        String extensao = nomeArquivo.substring(nomeArquivo.lastIndexOf('.'));
        return nomeBase + "_" + System.currentTimeMillis() + extensao;
    }

    public static String extrairChaveDuplicada(String errorMessage) {
        Pattern pattern = Pattern.compile("Chave \\((.*?)\\)=\\((.*?)\\) já existe");
        Matcher matcher = pattern.matcher(errorMessage);

        if (matcher.find()) {
            String campo = matcher.group(1);
//            String valor = matcher.group(2);
            return campo + " já existe";
        }
        return errorMessage;
    }

    public static String retornaMsgEmail(String nome, String token, String endpointFront) {

        String mensagem = """
                <style>
                      * {
                        padding: 0;
                        margin: 0;
                        font-family: Arial, Helvetica, sans-serif;
                      }
                      .main {
                        margin: 5em;
                        padding: 2em;
                        border: 2px solid #b300c7;
                        border-radius: 15px;
                        box-shadow: 10px 10px 20px #00000035;
                        max-width: 460px;
                
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                      }
                
                      .main h2 {
                        color: #8200b1;
                      }
                
                      .main a {
                        text-decoration: none;
                        font-weight: bold;
                        color: #b300c7;
                        transition: 0.2s;
                      }
                
                      .main a:hover {
                        color: #44004b;
                      }
                    </style>
                    <div class="main">
                      <h2>Olá @@nomeUsuario@@, tudo bom?</h2>
                      <p>Aqui está o link para que você possa trocar a sua senha:</p>
                      <p>
                        <a href="@@endpointFront@@/auth/sign-in/password-reset?token=@@tokenTransparente@@" target="_blank"
                          >Clique aqui</a
                        >
                        <span>para alterar a sua senha atual.</span>
                      </p>
                      <p>Lembrando que esse link tem a validade de 2 horas. Não perca tempo!!!</p>                      
                    </div>
                """;

        mensagem = mensagem.replace("@@nomeUsuario@@", nome);
        mensagem = mensagem.replace("@@tokenTransparente@@", token);
        mensagem = mensagem.replace("@@endpointFront@@", endpointFront);

        return mensagem;
    }

    public static String retornaMsgEmailCriarFuncionario(String link) {

        String mensagem = """
                <style>
                      * {
                        padding: 0;
                        margin: 0;
                        font-family: Arial, Helvetica, sans-serif;
                      }
                      .main {
                        margin: 5em;
                        padding: 2em;
                        border: 2px solid #b300c7;
                        border-radius: 15px;
                        box-shadow: 10px 10px 20px #00000035;
                        max-width: 460px;
                
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                      }
                
                      .main h2 {
                        color: #8200b1;
                      }
                
                      .main a {
                        text-decoration: none;
                        font-weight: bold;
                        color: #b300c7;
                        transition: 0.2s;
                      }
                
                      .main a:hover {
                        color: #44004b;
                      }
                    </style>
                    <div class="main">
                      <h2>Olá, tudo bom?</h2>
                      <p>Aqui está o link para que você criar a sua conta:</p>
                      <p>
                        <a href="@@link_cadastro@@" target="_blank"
                          >Clique aqui</a
                        >
                        <span>para ir para a página de cadastro!.</span>
                      </p>
                      <p>Lembrando que esse link tem a validade de 2 horas. Não perca tempo!!!</p>                      
                    </div>
                """;

        mensagem = mensagem.replace("@@link_cadastro@@", link);

        return mensagem;
    }

    public static String formatarDataParaAgenda(LocalDateTime date) {
        if (date == null) {
            throw new IllegalArgumentException("A data fornecida não é válida.");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return date.format(formatter);
    }

    public static List<LocalTime> retornaLocalTimeByChar11(String horario) {
        List<LocalTime> horariosChar = new ArrayList<>();

        String[] horariosIniFim = horario.split(";");
        if (horariosIniFim.length < 2) {
            throw new ApiException("Formato de horário CHAR 11 para LocalTime inválido! (;)");
        }

        String[] horarioIniPartes = horariosIniFim[0].split(":");
        if (horarioIniPartes.length < 2) {
            throw new ApiException("Formato de horário CHAR 11 para LocalTime inválido! (Inicio)");
        }

        String[] horarioFimPartes = horariosIniFim[1].split(":");
        if (horarioFimPartes.length < 2) {
            throw new ApiException("Formato de horário CHAR 11 para LocalTime inválido! (Fim)");
        }


        LocalTime horarioIni = LocalTime.of(Integer.parseInt(horarioIniPartes[0]), Integer.parseInt(horarioIniPartes[1]));
        LocalTime horarioFim = LocalTime.of(Integer.parseInt(horarioFimPartes[0]), Integer.parseInt(horarioFimPartes[1]));

        horariosChar.add(horarioIni);
        horariosChar.add(horarioFim);


        return horariosChar;
    }
}
