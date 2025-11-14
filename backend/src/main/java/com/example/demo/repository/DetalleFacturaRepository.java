package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.DetalleFactura;

public interface DetalleFacturaRepository extends JpaRepository<DetalleFactura, Long> {
    
}
