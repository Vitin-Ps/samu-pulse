package com.example.samu_pulse.infra.email;

import com.example.samu_pulse.infra.exception.ApiException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${MAIL_FROM:}")
    private String emailSend;

    public void enviarEmail(DadosEnviarEmail dados) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
            helper.setTo(dados.destino());
            helper.setSubject(dados.assunto());
            helper.setText(dados.mensagem(), true);
            helper.setFrom(emailSend);
            mailSender.send(mimeMessage);
        } catch (MessagingException | MailException | IllegalArgumentException ex) {
            throw new ApiException("Não foi possível enviar o e-mail. Verifique a configuração de envio.");
        }
    }
}
