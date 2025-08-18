package Vinicius.Portfolio.controller;

import java.time.LocalDateTime;
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
import Vinicius.Portfolio.model.PasswordResetToken;
import Vinicius.Portfolio.model.User;
import Vinicius.Portfolio.security.JwtUtil;
import Vinicius.Portfolio.service.UserService;
import Vinicius.Portfolio.repository.PasswordResetTokenRepository;
import Vinicius.Portfolio.service.EmailService;



@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, PasswordResetTokenRepository tokenRepository, EmailService emailService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
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


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> user = userService.findByEmail(email);
        if (user.isPresent()) {
        // 1. Generate unique token
        String token = JwtUtil.generateToken(email);

        // 2. Check if a token already exists for this user
        Optional<PasswordResetToken> existingToken = tokenRepository.findByUser(user.get());
        if (existingToken.isPresent()) {
            PasswordResetToken resetToken = existingToken.get();
            resetToken.setToken(token);
            resetToken.setExpirationDate(LocalDateTime.now().plusHours(1)); // set expiration
            tokenRepository.save(resetToken);
        } else {
            // Save new token
            PasswordResetToken resetToken = new PasswordResetToken(token, user.get());
            tokenRepository.save(resetToken);
        }
            // 3. Send email with reset link
            String resetLink = "http://192.168.1.18:4200/reset-password?token=" + token;
            emailService.sendEmail(email, "Reset your password", "Click here to reset your password: " + resetLink + "\n" + "\n Kind Regards,\n Vinicius Ferro" );
        }

        // Always return OK to avoid revealing if the email exists or not
        return ResponseEntity.ok("If the email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>>  resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        // 1. Verify token
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);
        if (resetTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid token"));
        }

        PasswordResetToken resetToken = resetTokenOpt.get();
        User user = resetToken.getUser();

        // 2. Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userService.save(user);

        // 3. Optional: remove token so it can't be reused
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }





}


   
    