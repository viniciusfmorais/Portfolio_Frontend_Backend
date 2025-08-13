package Vinicius.Portfolio.controller;

import java.io.InputStream;
import java.security.Principal;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import Vinicius.Portfolio.dto.CertificatesDTO;
import Vinicius.Portfolio.exceptions.ResourceNotFoundException;
import Vinicius.Portfolio.model.Certificates;
import Vinicius.Portfolio.service.CertificatesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/certificates")
public class CertificatesController {

    private final CertificatesService certificatesService;

    public CertificatesController(CertificatesService certificatesService) {
        this.certificatesService = certificatesService;
    }
     
    @PostMapping("/upload")
    public ResponseEntity<?> uploadCertificate(@RequestParam("file") MultipartFile file, Principal principal) {
        try {
            
            String username = principal.getName();
            Certificates certificates = certificatesService.saveCertificates(username, file);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", certificates.getId()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<CertificatesDTO>> listCertificates() {
        List<Certificates> certificates = certificatesService.listCertificates();

        List<CertificatesDTO> dtos = certificates.stream()
            .map(cert -> new CertificatesDTO(cert.getId(), cert.getFilename(), cert.getContentType(), cert.getDescription(), cert.getUploadDate()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<CertificatesDTO> getFile(@PathVariable Long id) {
        try {
            Certificates certificatesEntity = certificatesService.getCertificatesById(id);
            
            CertificatesDTO dto = new CertificatesDTO();
            dto.setId(certificatesEntity.getId());
            dto.setFileName(certificatesEntity.getFilename());
            dto.setContentType(certificatesEntity.getContentType());
            dto.setDescription(certificatesEntity.getDescription());
            dto.setUploadDate(certificatesEntity.getUploadDate());
            dto.setBase64Content(Base64.getEncoder().encodeToString(certificatesEntity.getFileData()));

            return ResponseEntity.ok(dto);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }    
   
}
