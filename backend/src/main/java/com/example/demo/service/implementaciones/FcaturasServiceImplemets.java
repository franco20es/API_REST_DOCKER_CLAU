package com.example.demo.service.implementaciones;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Factura;
import com.example.demo.repository.FacturasRepository;
import com.example.demo.service.FacturasService;

@Service
public class FcaturasServiceImplemets implements FacturasService {
    
    @Autowired
    private FacturasRepository facturasRepository;

    @Override
    public Factura findById(Long id) {
        return facturasRepository.findById(id).orElse(null);
    }
    
    @Override
    public List<Factura> findAll() {
        return facturasRepository.findAll();
    }
    
    @Override
    public Factura save(Factura factura) {
        return facturasRepository.save(factura);
    }
    
    @Override
    public void deleteById(Long id) {
        facturasRepository.deleteById(id);
    }
}
