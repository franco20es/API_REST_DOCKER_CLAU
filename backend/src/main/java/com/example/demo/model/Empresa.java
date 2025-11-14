package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "empresas")
public class Empresa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_empresa;
    
    @Column(nullable = false, unique = true, length = 11)
    private String ruc;
    
    @Column(nullable = false)
    private String razon_social;
    
    private String direccion;
    private String estado;
    private String condicion;
    private String departamento;
    private String provincia;
    private String distrito;
    private String ubigeo;
}
