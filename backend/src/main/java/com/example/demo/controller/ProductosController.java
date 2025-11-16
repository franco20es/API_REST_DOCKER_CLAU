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

import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;

@RestController
@RequestMapping("/api/productos")

// CORS para permitir acceso desde tu servidor real en Google Cloud
@CrossOrigin(origins = {
    "http://34.28.54.252",     // tu servidor frontend
    "http://localhost:3000",   // para pruebas locales
    "http://localhost:5173"
})
public class ProductosController {

    @Autowired
    private ProductoService productoService;

    // Obtener todos los productos
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodosLosProductos() {
        List<Producto> productos = productoService.findAll();
        return ResponseEntity.ok(productos);
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.findById(id);

        // Si existe, devolverlo; si no, NOT FOUND
        return producto.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // Buscar productos por nombre
    @GetMapping("/buscar/nombre/{nombre}")
    public ResponseEntity<List<Producto>> buscarProductosPorNombre(@PathVariable String nombre) {
        List<Producto> productos = productoService.findByNombre(nombre);

        if (productos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(productos);
    }

    // Crear nuevo producto
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        try {
            // Guardar producto
            Producto productoGuardado = productoService.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(productoGuardado);

        } catch (Exception e) {
            // Error SQL o validación
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(
            @PathVariable Long id,
            @RequestBody Producto producto
    ) {

        Optional<Producto> productoExistente = productoService.findById(id);

        if (productoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Mantener el ID original
        producto.setId_producto(id);

        Producto productoActualizado = productoService.save(producto);

        return ResponseEntity.ok(productoActualizado);
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        Optional<Producto> producto = productoService.findById(id);

        if (producto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productoService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
