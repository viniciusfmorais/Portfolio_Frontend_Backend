package Vinicius.Portfolio.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")  
public class User {

    
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column
    private String roles;

    @Column
    private String email;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // constructors, getters and setters

    public User(){}


    public User(String username, String password, String email) {
        this.username = username;
        this.passwordHash = password;
        this.email = email;
        this.createdAt = LocalDateTime.now();
    }
        

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }    

    public String getEmail() {
        return email;
    }   

    public void setEmail(String email) {
        this.email = email;
    }

}
