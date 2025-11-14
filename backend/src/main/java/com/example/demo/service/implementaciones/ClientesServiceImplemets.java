package com.example.demo.service.implementaciones;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Clientes;
import com.example.demo.repository.ClientesRepository;
import com.example.demo.service.ClientesService;
@Service
public class ClientesServiceImplemets implements ClientesService {
    
@Autowired
private ClientesRepository clientesRepository;


@Override
public Optional<Clientes> findById(Long id) {
    return clientesRepository.findById(id);
}

@Override
public List<Clientes>findByNombreCompleto(String nombreCompleto) {
    return clientesRepository.findByNombreCompleto(nombreCompleto);
}

@Override
public List<Clientes> findByDni(String dni) {
    return clientesRepository.findByDni(dni);
}

@Override
public Clientes save(Clientes cliente) {
    return clientesRepository.save(cliente);
}

@Override
public void deleteById(Long id) {
    clientesRepository.deleteById(id);
}

@Override
public List<Clientes> findAll() {
    return clientesRepository.findAll();
}

}
