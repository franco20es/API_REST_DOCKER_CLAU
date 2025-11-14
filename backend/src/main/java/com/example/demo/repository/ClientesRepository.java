package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Clientes;

public interface ClientesRepository extends JpaRepository<Clientes, Long> {
    
    // Consulta personalizada porque el campo es nombre_completo (con guion bajo)
    @Query("SELECT c FROM Clientes c WHERE c.nombre_completo = :nombreCompleto")
    List<Clientes> findByNombreCompleto(@Param("nombreCompleto") String nombreCompleto);
    
    // Buscar por DNI
    @Query("SELECT c FROM Clientes c WHERE c.dni = :dni")
    List<Clientes> findByDni(@Param("dni") String dni);
}
