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

 
    public Certificates saveCertificates(String username, MultipartFile file) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User " + username + " not found"));

        Certificates certificates = new Certificates();
        certificates.setOwner(user);
        certificates.setFilename(file.getOriginalFilename());
        certificates.setContentType(file.getContentType());
        certificates.setFileData(file.getBytes());
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

    public void deleteCertificates(Long id) {
        if (!certificatesRepository.existsById(id)) {
            throw new ResourceNotFoundException("Certificate " + id + " not found");
        }
        certificatesRepository.deleteById(id);
    }

}
