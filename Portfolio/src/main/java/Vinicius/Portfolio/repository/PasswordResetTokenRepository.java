package Vinicius.Portfolio.repository;

import org.springframework.stereotype.Repository;

import Vinicius.Portfolio.model.PasswordResetToken;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import Vinicius.Portfolio.model.User;


@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
   
    Optional<PasswordResetToken> findByUser(User user);

    
    void deleteByUser(User user);
}
