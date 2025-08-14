package Vinicius.Portfolio.service;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import Vinicius.Portfolio.exceptions.ResourceNotFoundException;
import Vinicius.Portfolio.model.Certificates;
import Vinicius.Portfolio.model.User;
import Vinicius.Portfolio.repository.CertificatesRepository;
import Vinicius.Portfolio.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CertificatesService {

    private final CertificatesRepository certificatesRepository;
    private final UserRepository userRepository;

    public CertificatesService(CertificatesRepository certificatesRepository, UserRepository userRepository) {
        this.certificatesRepository = certificatesRepository;
        this.userRepository = userRepository;   
    }
    

    
    public Certificates getCertificatesById(Long id) {
        return certificatesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + id));
    }


    public Certificates saveCertificates(String username, MultipartFile file, String description) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User " + username + " not found"));

        Certificates certificates = new Certificates();
        certificates.setOwner(user);
        certificates.setFilename(file.getOriginalFilename());
        certificates.setContentType(file.getContentType());
        certificates.setFileData(file.getBytes());
        certificates.setDescription(description);
        certificates.setUploadDate(LocalDateTime.now());

        return certificatesRepository.save(certificates);
    }


    public List<Certificates> listCertificates() {
        return certificatesRepository.findAll();
    }
    
    public Certificates findPorId(Long id) {
        return certificatesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate " + id + " not found"));
    }

    public Certificates saveCertificates(Certificates certificates) {
        return certificatesRepository.save(certificates);
    }

    public void deleteCertificates(Long id, String username) {
        Certificates cert = certificatesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate " + id + " not found"));
        if (cert.getOwner() == null || !cert.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not have permission to delete this certificate");
        }
        certificatesRepository.deleteById(id);
    }

}
