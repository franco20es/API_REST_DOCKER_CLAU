import { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || "";
const BACKEND_URL = `${API}/api/facturas`;

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
      throw err;
    }
  };

  // Guardar factura o boleta
  const guardarFactura = async (facturaData) => {
    setLoading(true);
    setError(null);

    // Validación productos
    if (!facturaData.productos || facturaData.productos.length === 0) {
      setError("Debe agregar al menos un producto");
      setLoading(false);
      return;
    }

    try {
      const facturaBackend = {
        tipo_comprobante: facturaData.tipoComprobante,
        numero: facturaData.numero,
        subtotal: facturaData.subtotal,
        igv: facturaData.igv,
        total: facturaData.total,
        metodo_pago: facturaData.metodoPago,
        moneda: facturaData.moneda,
        tipo_cambio: facturaData.tipoCambio || 1,

        id_cliente: facturaData.tipoComprobante === "BOLETA" ? facturaData.id_cliente : null,
        id_empresa: facturaData.tipoComprobante === "FACTURA" ? facturaData.id_empresa : null,

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
      setError(err.response?.data || 'Error al guardar factura');
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
      throw err;
    }
  };

  // Generar número automático
  const generarNumeroComprobante = (tipo) => {
    const serie = tipo === "BOLETA" ? "B001" : "F001";
    const ts = Date.now();
    return `${serie}-${ts}`;
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
