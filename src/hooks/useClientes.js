import { useState } from 'react';
import axios from 'axios';

// Usa variable de entorno: localhost:8080 en dev, /api en producción
const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL || ''}/api/clientes`;

export const useClientes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarClientePorDNI = async (dni) => {
    if (!dni || dni.length !== 8) {
      throw new Error('DNI debe tener 8 dígitos');
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar al backend que consulta RENIEC (evita CORS)
      const url = `/api/reniec/dni/${dni}`;
      
      const response = await axios.get(url);
      
      // Respuesta ya viene formateada del backend
      const data = response.data;
      
      setLoading(false);
      
      return {
        dni: data.dni || dni,
        nombres: data.nombres,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        nombreCompleto: data.nombreCompleto
      };
    } catch (err) {
      setLoading(false);
      setError('No se pudo consultar el DNI');
      throw err;
    }
  };

  // ← ESTA FUNCIÓN FALTA
  const guardarClienteEnBackend = async (clienteData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(BACKEND_URL, {
        dni: clienteData.dni,
        nombre_completo: clienteData.nombreCompleto,
        apellido_paterno: clienteData.apellidoPaterno,
        apellido_materno: clienteData.apellidoMaterno
      });
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al guardar cliente en la base de datos');
      console.error('Error guardando cliente:', err);
      throw err;
    }
  };

  // ← ESTA FUNCIÓN FALTA
  const obtenerClientesRegistrados = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al obtener clientes');
      throw err;
    }
  };

  // ← ESTA FUNCIÓN FALTA (la que causa el error)
  const buscarClienteEnBackend = async (dni) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/buscar/dni/${dni}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      // No es error si no se encuentra, retorna null
      return null;
    }
  };

  const buscarEmpresaPorRUC = async (ruc) => {
    if (!ruc || ruc.length !== 11) {
      throw new Error('RUC debe tener 11 dígitos');
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar al backend que consulta SUNAT (evita CORS)
      const url = `/api/reniec/ruc/${ruc}`;
      
      const response = await axios.get(url);
      
      // Respuesta ya viene formateada del backend
      const data = response.data;
      
      setLoading(false);
      
      return {
        ruc: data.ruc || ruc,
        razonSocial: data.razonSocial,
        direccion: data.direccion,
        estado: data.estado,
        condicion: data.condicion
      };
    } catch (err) {
      setLoading(false);
      setError('No se pudo consultar el RUC');
      throw err;
    }
  };

  // ← IMPORTANTE: Retornar todas las funciones
  return {
    loading,
    error,
    buscarClientePorDNI,
    guardarClienteEnBackend,           // ← Agregar
    obtenerClientesRegistrados,        // ← Agregar
    buscarClienteEnBackend,            // ← Agregar (la que falta)
    buscarEmpresaPorRUC
  };
};