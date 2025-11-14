package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Clientes;


public interface ClientesService {
    // Buscar cliente por ID
    Optional<Clientes> findById(Long id);

    // Buscar cliente por nombre completo
    List<Clientes> findByNombreCompleto(String nombreCompleto);

    // Buscar cliente por DNI
    List<Clientes> findByDni(String dni);

    // Guardar o actualizar un cliente
    Clientes save(Clientes cliente);

    // Eliminar cliente por ID
    void deleteById(Long id);

    // Listar todos los clientes
    List<Clientes> findAll();
}
