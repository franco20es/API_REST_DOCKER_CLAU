package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.DetalleFactura;

public interface DetalleFacturaService {
    List<DetalleFactura> findAll();
    DetalleFactura save(DetalleFactura detalleFactura);
    void deleteById(Long id);
    Optional<DetalleFactura> findById(Long id);
}