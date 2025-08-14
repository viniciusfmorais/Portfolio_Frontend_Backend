package Vinicius.Portfolio.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import Vinicius.Portfolio.repository.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService (UserRepository userRepository) {
        this.userRepository = userRepository;
    }

        @Override
        public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Vinicius.Portfolio.model.User user = userRepository.findByUsername(login)
                .or(() -> userRepository.findByEmail(login))
                .orElseThrow(() -> new UsernameNotFoundException("User " + login + " not found"));

        return User.builder()
                .username(user.getUsername()) // ou user.getEmail()
                .password(user.getPasswordHash())
                .roles("USER")
                .build();
        }
    
}
 