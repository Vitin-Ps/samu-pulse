package com.example.samu_pulse.infra.email;

import org.springframework.web.util.HtmlUtils;

public class MensagensEmail {
    private static String mensagem(String titulo, String texto, String link, String acao) {
        return """
                <div style="background:#eff7f6;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#1f2d3a">
                  <div style="max-width:460px;margin:auto;padding:28px;background:white;border:1px solid #dde9e8;border-radius:20px">
                    <p style="color:#2587d7;font-weight:bold">Samu Pulse</p>
                    <h2>%s</h2><p style="line-height:1.6">%s</p>
                    <p style="margin:28px 0"><a href="%s" style="background:#2587d7;color:white;text-decoration:none;padding:12px 20px;border-radius:10px">%s</a></p>
                    <p style="font-size:13px;color:#586773">Este link é de uso único e tem validade de 2 horas.</p>
                  </div>
                </div>
                """.formatted(HtmlUtils.htmlEscape(titulo), HtmlUtils.htmlEscape(texto), HtmlUtils.htmlEscape(link), HtmlUtils.htmlEscape(acao));
    }

    public static String recuperarSenha(String nome, String link) {
        return mensagem("Recuperar sua senha", "Olá " + nome + ", aqui está o link para alterar sua senha.", link, "Redefinir senha");
    }

    public static String criarPerfil(String link) {
        return mensagem("Você foi convidado", "Crie seu perfil para acessar o Samu Pulse pelo link abaixo.", link, "Criar meu perfil");
    }
}
