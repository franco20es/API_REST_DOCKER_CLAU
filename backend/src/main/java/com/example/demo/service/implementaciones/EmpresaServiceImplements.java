package com.example.demo.service.implementaciones;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Empresa;
import com.example.demo.repository.EmpresaRepository;
import com.example.demo.service.EmpresaService;

@Service
public class EmpresaServiceImplements implements EmpresaService {
    
    @Autowired
    private EmpresaRepository empresaRepository;
    
    @Override
    public Optional<Empresa> findById(Long id) {
        return empresaRepository.findById(id);
    }
    
    @Override
    public List<Empresa> findByRuc(String ruc) {
        return empresaRepository.findByRuc(ruc);
    }
    
    @Override
    public List<Empresa> findByRazonSocial(String razonSocial) {
        return empresaRepository.findByRazonSocial(razonSocial);
    }
    
    @Override
    public Empresa save(Empresa empresa) {
        return empresaRepository.save(empresa);
    }
    
    @Override
    public void deleteById(Long id) {
        empresaRepository.deleteById(id);
    }
    
    @Override
    public List<Empresa> findAll() {
        return empresaRepository.findAll();
    }
}
