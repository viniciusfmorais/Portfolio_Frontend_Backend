package Vinicius.Portfolio.service;

import java.util.Optional;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Vinicius.Portfolio.model.User;
import Vinicius.Portfolio.repository.UserRepository;



@Service
public class UserService {

        
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();

    }


    public User registerUser(String username, String password, String email) {
        String encryptedPassword = passwordEncoder.encode(password);
        User user = new User(username, encryptedPassword, email);
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String string) {
        return userRepository.findByEmail(string);
    }

}
