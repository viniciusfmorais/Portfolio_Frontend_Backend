package Vinicius.Portfolio.dto;

import java.time.LocalDateTime;

public class CertificatesDTO {

    private Long id;
    private String fileName;
    private String contentType;
    private String description;
    private LocalDateTime uploadDate;
    private String base64Content;

        // Constructor, getters, setters
        public CertificatesDTO(Long id, String fileName, String contentType, String description, LocalDateTime uploadDate) {
            this.id = id;
            this.fileName = fileName;
            this.contentType = contentType;
            this.description = description;
            this.uploadDate = uploadDate;
        }


        public CertificatesDTO() {
            

        }


        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getContentType() {
            return contentType;
        }

        public void setContentType(String contentType) {
            this.contentType = contentType;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getUploadDate() {
            return uploadDate;
        }

        public void setUploadDate(LocalDateTime uploadDate) {
            this.uploadDate = uploadDate;
        }

        public String getBase64Content() {
            return base64Content;
        }

        public void setBase64Content(String base64Content) {
            this.base64Content = base64Content;
        }

}
