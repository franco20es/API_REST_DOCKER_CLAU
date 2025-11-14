package com.example.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Factura;

public interface FacturasRepository extends JpaRepository<Factura,Long>{
    
}
