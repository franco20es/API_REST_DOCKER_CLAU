package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Empresa;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    
    @Query("SELECT e FROM Empresa e WHERE e.ruc = :ruc")
    List<Empresa> findByRuc(@Param("ruc") String ruc);
    
    @Query("SELECT e FROM Empresa e WHERE e.razon_social = :razonSocial")
    List<Empresa> findByRazonSocial(@Param("razonSocial") String razonSocial);
}
