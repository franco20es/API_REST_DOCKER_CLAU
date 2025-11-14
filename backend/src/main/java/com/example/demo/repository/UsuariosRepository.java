package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Usuarios;

public interface  UsuariosRepository extends JpaRepository<Usuarios, Long> {
    
    // Consulta personalizada porque el campo es nombre_completo (con guion bajo)
    @Query("SELECT u FROM Usuarios u WHERE u.nombre_completo = :nombreCompleto")
    List<Usuarios> findByNombreCompleto(@Param("nombreCompleto") String nombreCompleto);
    
    // Buscar por DNI (útil para la integración con RENIEC)
    @Query("SELECT u FROM Usuarios u WHERE u.dni = :dni")
    List<Usuarios> findByDni(@Param("dni") String dni);
}
