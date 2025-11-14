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

import com.example.demo.model.Usuarios;
import com.example.demo.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuarios>> getAllUsuarios() {
        List<Usuarios> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuarios> getUsuarioById(@PathVariable Long id) {
        return usuarioService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar/nombre/{nombreCompleto}")
    public ResponseEntity<List<Usuarios>> getUsuariosByNombre(@PathVariable String nombreCompleto) {
        List<Usuarios> usuarios = usuarioService.findByNombreCompleto(nombreCompleto);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/buscar/dni/{dni}")
    public ResponseEntity<List<Usuarios>> getUsuariosByDni(@PathVariable String dni) {
        List<Usuarios> usuarios = usuarioService.findByDni(dni);
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping
    public ResponseEntity<Usuarios> createUsuario(@RequestBody Usuarios usuario) {
        try {
            Usuarios nuevoUsuario = usuarioService.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuarios> updateUsuario(@PathVariable Long id, @RequestBody Usuarios usuario) {
        return usuarioService.findById(id)
            .map(usuarioExistente -> {
                usuario.setId_usuario(id);
                Usuarios usuarioActualizado = usuarioService.save(usuario);
                return ResponseEntity.ok(usuarioActualizado);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        return usuarioService.findById(id)
            .map(usuario -> {
                usuarioService.deleteById(id);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        List<Usuarios> usuarios = usuarioService.findAll();
        
        for (Usuarios u : usuarios) {
            if (u.getUsuario() != null && u.getUsuario().equals(loginRequest.getUsuario()) 
                && u.getPassword() != null && u.getPassword().equals(loginRequest.getPassword())) {
                u.setPassword(null);
                return ResponseEntity.ok(u);
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }

    public static class LoginRequest {
        private String usuario;
        private String password;

        public String getUsuario() {
            return usuario;
        }

        public void setUsuario(String usuario) {
            this.usuario = usuario;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
