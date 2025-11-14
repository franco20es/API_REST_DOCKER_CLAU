import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL || ''}/api/facturas`;

export const useFacturas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las facturas
  const obtenerFacturas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al obtener facturas');
      console.error('Error obteniendo facturas:', err);
      throw err;
    }
  };

  // Guardar factura/boleta en el backend
  const guardarFactura = async (facturaData) => {
    setLoading(true);
    setError(null);

    try {
      // Estructura de datos para el backend
      const facturaBackend = {
        tipo_comprobante: facturaData.tipoComprobante, // "BOLETA" o "FACTURA"
        numero: facturaData.numero, // "B001-00001" o "F001-00001"
        subtotal: facturaData.subtotal,
        igv: facturaData.igv,
        total: facturaData.total,
        metodo_pago: facturaData.metodoPago, // "EFECTIVO", "TARJETA", "YAPE"
        moneda: facturaData.moneda, // "PEN" o "USD"
        tipo_cambio: facturaData.tipo_cambio, // Tipo de cambio para USD
        id_cliente: facturaData.id_cliente, // ID del cliente (para BOLETA)
        id_empresa: facturaData.id_empresa, // ID de la empresa (para FACTURA)
        detalles: facturaData.productos.map(producto => ({
          id_producto: producto.id_producto,
          cantidad: producto.cantidadVendida || producto.cantidad,
          precio_unitario: producto.precio,
          subtotal: producto.subtotalProducto || (producto.precio * (producto.cantidadVendida || producto.cantidad))
        }))
      };

      const response = await axios.post(BACKEND_URL, facturaBackend);
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Error al guardar factura en la base de datos');
      throw err;
    }
  };

  // Buscar factura por ID
  const buscarFacturaPorId = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/${id}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Factura no encontrada');
      console.error('Error buscando factura:', err);
      return null;
    }
  };

  // Buscar facturas por cliente
  const buscarFacturasPorCliente = async (idCliente) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/cliente/${idCliente}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('No se encontraron facturas para este cliente');
      console.error('Error buscando facturas por cliente:', err);
      return [];
    }
  };

  // Eliminar factura
  const eliminarFactura = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError('Error al eliminar factura');
      console.error('Error eliminando factura:', err);
      throw err;
    }
  };

  // Generar número de comprobante automático
  const generarNumeroComprobante = (tipo) => {
    const serie = tipo === "BOLETA" ? "B001" : "F001";
    const timestamp = Date.now();
    return `${serie}-${timestamp}`;
  };

  return {
    loading,
    error,
    obtenerFacturas,
    guardarFactura,
    buscarFacturaPorId,
    buscarFacturasPorCliente,
    eliminarFactura,
    generarNumeroComprobante
  };
};