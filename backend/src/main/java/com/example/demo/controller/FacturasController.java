package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Clientes;
import com.example.demo.model.DetalleFactura;
import com.example.demo.model.Empresa;
import com.example.demo.model.Factura;
import com.example.demo.model.Producto;
import com.example.demo.service.ClientesService;
import com.example.demo.service.EmpresaService;
import com.example.demo.service.FacturasService;
import com.example.demo.service.ProductoService;

@RestController
@RequestMapping("/api/facturas")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "http://34.28.54.252",
        "http://34.28.54.252:80",
        "http://34.28.54.252:3000",
        "http://34.28.54.252:5173"
})
public class FacturasController {

    @Autowired
    private FacturasService facturasService;

    @Autowired
    private ClientesService clientesService;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private EmpresaService empresaService;

    // Obtener todas las facturas
    @GetMapping
    public ResponseEntity<List<Factura>> obtenerTodasLasFacturas() {
        List<Factura> facturas = facturasService.findAll();
        return ResponseEntity.ok(facturas);
    }

    // Obtener factura por ID
    @GetMapping("/{id}")
    public ResponseEntity<Factura> obtenerFacturaPorId(@PathVariable Long id) {
        Factura factura = facturasService.findById(id);
        if (factura != null) {
            return ResponseEntity.ok(factura);
        }
        return ResponseEntity.notFound().build();
    }

    // Crear nueva factura/boleta
    @PostMapping
    public ResponseEntity<?> crearFactura(@RequestBody Map<String, Object> facturaData) {
        try {
            Factura factura = new Factura();
            factura.setTipo_comprobante(facturaData.get("tipo_comprobante").toString());
            factura.setNumero(facturaData.get("numero").toString());
            factura.setFecha_emision(LocalDateTime.now());
            factura.setSubtotal(Double.valueOf(facturaData.get("subtotal").toString()));
            factura.setIgv(Double.valueOf(facturaData.get("igv").toString()));
            factura.setTotal(Double.valueOf(facturaData.get("total").toString()));
            factura.setMetodo_pago(facturaData.get("metodo_pago").toString());
            factura.setMoneda(facturaData.get("moneda").toString());

            // Validar BOLETA o FACTURA
            String tipoComprobante = facturaData.get("tipo_comprobante").toString();

            if ("BOLETA".equals(tipoComprobante)) {
                if (!facturaData.containsKey("id_cliente")) {
                    return ResponseEntity.badRequest().body("BOLETA requiere id_cliente");
                }
                Long idCliente = Long.valueOf(facturaData.get("id_cliente").toString());
                Optional<Clientes> clienteOpt = clientesService.findById(idCliente);

                if (clienteOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Cliente no encontrado");
                }

                factura.setCliente(clienteOpt.get());
                factura.setEmpresa(null);

            } else if ("FACTURA".equals(tipoComprobante)) {
                if (!facturaData.containsKey("id_empresa")) {
                    return ResponseEntity.badRequest().body("FACTURA requiere id_empresa");
                }

                Long idEmpresa = Long.valueOf(facturaData.get("id_empresa").toString());
                Optional<Empresa> empresaOpt = empresaService.findById(idEmpresa);

                if (empresaOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Empresa no encontrada");
                }

                factura.setEmpresa(empresaOpt.get());
                factura.setCliente(null);

            } else {
                return ResponseEntity.badRequest().body("Tipo de comprobante inválido. Use BOLETA o FACTURA");
            }

            // Procesar los detalles
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> detallesData = (List<Map<String, Object>>) facturaData.get("detalles");
            List<DetalleFactura> detalles = new ArrayList<>();

            for (Map<String, Object> detalleData : detallesData) {
                Long idProducto = Long.valueOf(detalleData.get("id_producto").toString());
                Optional<Producto> productoOpt = productoService.findById(idProducto);

                if (productoOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Producto con ID " + idProducto + " no encontrado");
                }

                Producto producto = productoOpt.get();

                DetalleFactura detalle = new DetalleFactura();
                detalle.setFactura(factura);
                detalle.setProducto(producto);
                detalle.setCantidad(Integer.valueOf(detalleData.get("cantidad").toString()));
                detalle.setPrecio_unitario(Double.valueOf(detalleData.get("precio_unitario").toString()));
                detalle.setSubtotal(Double.valueOf(detalleData.get("subtotal").toString()));

                detalles.add(detalle);

                // Actualizar stock
                int nuevoStock = producto.getCantidad() - detalle.getCantidad();
                if (nuevoStock < 0) {
                    return ResponseEntity.badRequest().body("Stock insuficiente para: " + producto.getNombre());
                }
                producto.setCantidad(nuevoStock);
                productoService.save(producto);
            }

            factura.setDetalles(detalles);

            Factura facturaGuardada = facturasService.save(factura);
            return ResponseEntity.status(HttpStatus.CREATED).body(facturaGuardada);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la factura: " + e.getMessage());
        }
    }

    // Buscar facturas por cliente
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Factura>> obtenerFacturasPorCliente(@PathVariable Long idCliente) {
        Optional<Clientes> clienteOpt = clientesService.findById(idCliente);
        if (clienteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Factura> todasFacturas = facturasService.findAll();
        List<Factura> facturasCliente = todasFacturas.stream()
                .filter(f -> f.getCliente() != null && f.getCliente().getId_cliente().equals(idCliente))
                .toList();

        return ResponseEntity.ok(facturasCliente);
    }

    // Eliminar factura
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFactura(@PathVariable Long id) {
        Factura factura = facturasService.findById(id);
        if (factura != null) {
            facturasService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
