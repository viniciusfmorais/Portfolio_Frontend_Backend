package Vinicius.Portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Vinicius.Portfolio.model.Certificates;

@Repository
public interface CertificatesRepository extends JpaRepository<Certificates, Long> {

}
