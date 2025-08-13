package Vinicius.Portfolio.service;

import org.aspectj.bridge.Message;
import org.springframework.stereotype.Service;

import Vinicius.Portfolio.repository.MessageRepository;

@Service    
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    public String getMessage() {
        return messageRepository.getMessage();
    }

    
}
