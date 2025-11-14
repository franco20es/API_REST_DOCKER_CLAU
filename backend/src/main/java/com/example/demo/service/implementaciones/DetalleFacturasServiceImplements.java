package com.example.demo.service.implementaciones;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.DetalleFactura;
import com.example.demo.repository.DetalleFacturaRepository;
import com.example.demo.service.DetalleFacturaService;

@Service
public class DetalleFacturasServiceImplements implements DetalleFacturaService {

    @Autowired
    private DetalleFacturaRepository detalleFacturaRepository;

    @Override
    public List<DetalleFactura> findAll() {
        return detalleFacturaRepository.findAll();
    }
    
    @Override
    public DetalleFactura save(DetalleFactura detalleFactura) {
        return detalleFacturaRepository.save(detalleFactura);
    }
    
    @Override
    public void deleteById(Long id) {
        detalleFacturaRepository.deleteById(id);
    }
    
    @Override
    public Optional<DetalleFactura> findById(Long id) {
        return detalleFacturaRepository.findById(id);
    }
}
