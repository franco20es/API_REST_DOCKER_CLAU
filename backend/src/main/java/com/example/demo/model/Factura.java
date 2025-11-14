package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "facturas")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_factura;

    private String tipo_comprobante; // "BOLETA" o "FACTURA"
    private String numero;            // Ej: "B001-1762801991358"
    private LocalDateTime fecha_emision = LocalDateTime.now();
    private Double subtotal;
    private Double igv;
    private Double total;
    private String metodo_pago;       // Efectivo, Tarjeta, Yape, etc.
    private String moneda;            // Soles, Dólares

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Clientes cliente; // Relación con cliente (para BOLETAS)

    @ManyToOne
    @JoinColumn(name = "id_empresa")
    private Empresa empresa; // Relación con empresa (para FACTURAS)

    // Relación con los detalles de la factura
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleFactura> detalles;
}
