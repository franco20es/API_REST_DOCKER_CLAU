package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Empresa;
import com.example.demo.service.EmpresaService;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    // Obtener todas las empresas
    @GetMapping
    public ResponseEntity<List<Empresa>> obtenerTodasLasEmpresas() {
        List<Empresa> empresas = empresaService.findAll();
        return ResponseEntity.ok(empresas);
    }

    // Obtener empresa por ID
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerEmpresaPorId(@PathVariable Long id) {
        Optional<Empresa> empresa = empresaService.findById(id);
        return empresa.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Buscar empresas por RUC
    @GetMapping("/buscar/ruc/{ruc}")
    public ResponseEntity<List<Empresa>> buscarEmpresasPorRuc(@PathVariable String ruc) {
        List<Empresa> empresas = empresaService.findByRuc(ruc);
        if (empresas.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(empresas);
    }

    // Buscar empresas por razón social
    @GetMapping("/buscar/razon-social/{razonSocial}")
    public ResponseEntity<List<Empresa>> buscarEmpresasPorRazonSocial(@PathVariable String razonSocial) {
        List<Empresa> empresas = empresaService.findByRazonSocial(razonSocial);
        if (empresas.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(empresas);
    }

    // Crear nueva empresa
    @PostMapping
    public ResponseEntity<Empresa> crearEmpresa(@RequestBody Empresa empresa) {
        try {
            // Validar RUC
            if (empresa.getRuc() == null || empresa.getRuc().length() != 11) {
                return ResponseEntity.badRequest().build();
            }
            
            // Verificar si ya existe
            List<Empresa> empresasExistentes = empresaService.findByRuc(empresa.getRuc());
            if (!empresasExistentes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(empresasExistentes.get(0)); // Retorna la empresa existente
            }
            
            Empresa empresaGuardada = empresaService.save(empresa);
            return ResponseEntity.status(HttpStatus.CREATED).body(empresaGuardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Actualizar empresa
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> actualizarEmpresa(@PathVariable Long id, @RequestBody Empresa empresa) {
        Optional<Empresa> empresaExistente = empresaService.findById(id);
        if (empresaExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        empresa.setId_empresa(id);
        Empresa empresaActualizada = empresaService.save(empresa);
        return ResponseEntity.ok(empresaActualizada);
    }

    // Eliminar empresa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable Long id) {
        Optional<Empresa> empresa = empresaService.findById(id);
        if (empresa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        empresaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
