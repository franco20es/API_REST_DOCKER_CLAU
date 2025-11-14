package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Factura;

public interface FacturasService {
    List<Factura> findAll();
    Factura save(Factura factura);
    void deleteById(Long id);
    Factura findById(Long id);
    
    
}
