package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Producto;

public interface  ProductosRepository  extends JpaRepository<Producto, Long> {
    // Spring Data JPA generará automáticamente la implementación de este método
    List<Producto> findByNombre(String nombre);
}
