package Vinicius.Portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Vinicius.Portfolio.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, java.util.UUID> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

}
