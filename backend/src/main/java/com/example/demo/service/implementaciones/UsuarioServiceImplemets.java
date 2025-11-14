package com.example.demo.service.implementaciones;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Usuarios;
import com.example.demo.repository.UsuariosRepository;
import com.example.demo.service.UsuarioService;

@Service
public class UsuarioServiceImplemets implements UsuarioService {

    @Autowired
    private UsuariosRepository usuarioRepo;

    @Override
    public Optional<Usuarios> findById(Long id) {
        return usuarioRepo.findById(id);
    }

    @Override
    public List<Usuarios> findByNombreCompleto(String nombreCompleto) {
        return usuarioRepo.findByNombreCompleto(nombreCompleto);
    }

    @Override
    public List<Usuarios> findByDni(String dni) {
        return usuarioRepo.findByDni(dni);
    }

    @Override
    public Usuarios save(Usuarios usuario) {
        return usuarioRepo.save(usuario);
    }

    @Override
    public void deleteById(Long id) {
        usuarioRepo.deleteById(id);
    }

    @Override
    public List<Usuarios> findAll() {
        return usuarioRepo.findAll();
    }
}
