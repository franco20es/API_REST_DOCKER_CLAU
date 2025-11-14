package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Empresa;

public interface EmpresaService {
    // Buscar empresa por ID
    Optional<Empresa> findById(Long id);
    
    // Buscar empresa por RUC
    List<Empresa> findByRuc(String ruc);
    
    // Buscar empresa por razón social
    List<Empresa> findByRazonSocial(String razonSocial);
    
    // Guardar o actualizar una empresa
    Empresa save(Empresa empresa);
    
    // Eliminar empresa por ID
    void deleteById(Long id);
    
    // Listar todas las empresas
    List<Empresa> findAll();
}
