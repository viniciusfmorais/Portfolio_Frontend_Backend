package Vinicius.Portfolio.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Vinicius.Portfolio.model.User;
import Vinicius.Portfolio.repository.UserRepository;

@Service
public class PasswordResetService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void resetPassword(User user, String newPassword) {
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}