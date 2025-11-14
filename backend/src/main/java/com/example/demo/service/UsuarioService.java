package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Usuarios;

public interface UsuarioService {
    // Buscar cliente por ID
    Optional<Usuarios> findById(Long id);

    // Buscar cliente por nombre completo (viene de RENIEC)
    List<Usuarios> findByNombreCompleto(String nombreCompleto);

    // Buscar cliente por DNI
    List<Usuarios> findByDni(String dni);

    // Guardar o actualizar un cliente
    Usuarios save(Usuarios usuario);

    // Eliminar cliente por ID
    void deleteById(Long id);

    // Listar todos los clientes
    List<Usuarios> findAll();
}
