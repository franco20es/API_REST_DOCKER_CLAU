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
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://34.28.54.252",
        "http://34.28.54.252:80",
        "http://34.28.54.252:3000",
        "http://34.28.54.252:5173"
})
public class ClientesController {
    
    @Autowired
    private ClientesService clientesService;

    // Obtener todos los clientes
    @GetMapping
    public ResponseEntity<List<Clientes>> getAllClientes() {
        List<Clientes> clientes = clientesService.findAll();
        return ResponseEntity.ok(clientes);
    }

    // Buscar cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Clientes> getClienteById(@PathVariable Long id) {
        return clientesService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Buscar cliente por nombre completo
    @GetMapping("/buscar/nombre/{nombreCompleto}")
    public ResponseEntity<List<Clientes>> getClientesByNombre(@PathVariable String nombreCompleto) {
        List<Clientes> clientes = clientesService.findByNombreCompleto(nombreCompleto);
        return ResponseEntity.ok(clientes);
    }

    // Buscar cliente por DNI
    @GetMapping("/buscar/dni/{dni}")
    public ResponseEntity<List<Clientes>> getClientesByDni(@PathVariable String dni) {
        List<Clientes> clientes = clientesService.findByDni(dni);
        return ResponseEntity.ok(clientes);
    }

    // Crear cliente
    @PostMapping
    public ResponseEntity<Clientes> createCliente(@RequestBody Clientes cliente) {
        try {
            Clientes nuevoCliente = clientesService.save(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Actualizar cliente
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

    // Eliminar cliente
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
