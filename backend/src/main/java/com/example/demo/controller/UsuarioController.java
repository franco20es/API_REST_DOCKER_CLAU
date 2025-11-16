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
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "http://34.28.54.252",
    "http://34.28.54.252:80"
})
public class UsuarioController {

    // Inyecta el servicio, correcto
    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios (RIESGO: expone contraseñas)
    @GetMapping
    public ResponseEntity<List<Usuarios>> getAllUsuarios() {
        List<Usuarios> usuarios = usuarioService.findAll();
        // Aquí deberías limpiar las contraseñas antes de devolver
        return ResponseEntity.ok(usuarios);
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuarios> getUsuarioById(@PathVariable Long id) {
        return usuarioService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Búsqueda por nombre completo
    @GetMapping("/buscar/nombre/{nombreCompleto}")
    public ResponseEntity<List<Usuarios>> getUsuariosByNombre(@PathVariable String nombreCompleto) {
        List<Usuarios> usuarios = usuarioService.findByNombreCompleto(nombreCompleto);
        return ResponseEntity.ok(usuarios);
    }

    // Búsqueda por DNI
    @GetMapping("/buscar/dni/{dni}")
    public ResponseEntity<List<Usuarios>> getUsuariosByDni(@PathVariable String dni) {
        List<Usuarios> usuarios = usuarioService.findByDni(dni);
        return ResponseEntity.ok(usuarios);
    }

    // Crear usuario
    @PostMapping
    public ResponseEntity<Usuarios> createUsuario(@RequestBody Usuarios usuario) {
        try {
            Usuarios nuevoUsuario = usuarioService.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Actualizar usuario
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

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        return usuarioService.findById(id)
            .map(usuario -> {
                usuarioService.deleteById(id);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Login (ineficiente y poco seguro)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // Obtiene todos los usuarios de la base (muy ineficiente)
        List<Usuarios> usuarios = usuarioService.findAll();
        
        // Recorre uno por uno hasta encontrar coincidencia
        for (Usuarios u : usuarios) {
            if (u.getUsuario() != null && u.getUsuario().equals(loginRequest.getUsuario()) 
                && u.getPassword() != null && u.getPassword().equals(loginRequest.getPassword())) {

                // Se oculta contraseña
                u.setPassword(null);
                return ResponseEntity.ok(u);
            }
        }
        
        // Si no coincide ninguno
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }

    // Clase interna para el request del login
    public static class LoginRequest {
        private String usuario;
        private String password;

        public String getUsuario() { return usuario; }
        public void setUsuario(String usuario) { this.usuario = usuario; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
