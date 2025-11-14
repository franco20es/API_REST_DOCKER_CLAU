package com.example.demo.controller;

import java.util.List;

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

import com.example.demo.model.Clientes;
import com.example.demo.service.ClientesService;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ClientesController {
    
    @Autowired
    private ClientesService clientesService;

    /**
     * Obtener todos los clientes
     * GET http://localhost:8080/api/clientes
     */
    @GetMapping
    public ResponseEntity<List<Clientes>> getAllClientes() {
        List<Clientes> clientes = clientesService.findAll();
        return ResponseEntity.ok(clientes);
    }

    /**
     * Buscar cliente por ID
     * GET http://localhost:8080/api/clientes/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Clientes> getClienteById(@PathVariable Long id) {
        return clientesService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Buscar clientes por nombre completo
     * GET http://localhost:8080/api/clientes/buscar/nombre/JUAN PEREZ
     */
    @GetMapping("/buscar/nombre/{nombreCompleto}")
    public ResponseEntity<List<Clientes>> getClientesByNombre(@PathVariable String nombreCompleto) {
        List<Clientes> clientes = clientesService.findByNombreCompleto(nombreCompleto);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Buscar clientes por DNI
     * GET http://localhost:8080/api/clientes/buscar/dni/12345678
     */
    @GetMapping("/buscar/dni/{dni}")
    public ResponseEntity<List<Clientes>> getClientesByDni(@PathVariable String dni) {
        List<Clientes> clientes = clientesService.findByDni(dni);
        return ResponseEntity.ok(clientes);
    }

    /**
     * Crear un nuevo cliente (desde RENIEC)
     * POST http://localhost:8080/api/clientes
     * Body: { "dni": "12345678", "nombre_completo": "JUAN PEREZ", ... }
     */
    @PostMapping
    public ResponseEntity<Clientes> createCliente(@RequestBody Clientes cliente) {
        try {
            Clientes nuevoCliente = clientesService.save(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Actualizar cliente existente
     * PUT http://localhost:8080/api/clientes/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<Clientes> updateCliente(@PathVariable Long id, @RequestBody Clientes cliente) {
        return clientesService.findById(id)
            .map(clienteExistente -> {
                cliente.setId_cliente(id);
                Clientes clienteActualizado = clientesService.save(cliente);
                return ResponseEntity.ok(clienteActualizado);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Eliminar cliente
     * DELETE http://localhost:8080/api/clientes/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        return clientesService.findById(id)
            .map(cliente -> {
                clientesService.deleteById(id);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
