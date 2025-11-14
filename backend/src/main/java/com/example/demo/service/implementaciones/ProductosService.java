package com.example.demo.service.implementaciones;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductosRepository;
import com.example.demo.service.ProductoService;

@Service
public class ProductosService implements ProductoService {

    @Autowired
    private ProductosRepository productosRepository;

    @Override
    public Optional<Producto> findById(Long id) {
        return productosRepository.findById(id);
    }

    @Override
    public List<Producto> findByNombre(String nombre) {
        return productosRepository.findByNombre(nombre);
    }

    @Override
    public Producto save(Producto producto) {
        return productosRepository.save(producto);
    }

    @Override
    public void deleteById(Long id) {
        productosRepository.deleteById(id);
    }

    @Override
    public List<Producto> findAll() {
        return productosRepository.findAll();
    }

}
