package Vinicius.Portfolio.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
        public void sendEmail(String to, String subject, String body) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("Email sent successfully to " + to);
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        }
}
