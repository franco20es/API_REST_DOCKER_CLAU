package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Producto;

public interface ProductoService {
    // Buscar producto por ID
    Optional<Producto> findById(Long id);

    // Buscar producto por nombre
    List<Producto> findByNombre(String nombre);

    // Guardar o actualizar un producto
    Producto save(Producto producto);

    // Eliminar producto por ID
    void deleteById(Long id);

    // Listar todos los productos
    List<Producto> findAll();
}
