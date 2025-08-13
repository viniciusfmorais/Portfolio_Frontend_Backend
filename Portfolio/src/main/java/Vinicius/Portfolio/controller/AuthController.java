package Vinicius.Portfolio.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Vinicius.Portfolio.dto.ResponseDTO;
import Vinicius.Portfolio.model.User;
import Vinicius.Portfolio.security.JwtUtil;
import Vinicius.Portfolio.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        User user = userService.registerUser(request.get("username"), request.get("password"), request.get("email"));
        return ResponseEntity.ok(user);
    }
     
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Optional<User> userOpt = userService.findByEmail(request.get("email"));
        if (userOpt.isPresent() && passwordEncoder.matches(request.get("password"), userOpt.get().getPasswordHash())) {
            String token = JwtUtil.generateToken(userOpt.get().getEmail());
            return ResponseEntity.ok(new ResponseDTO(userOpt.get().getEmail(), token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }


   
    

         
}
