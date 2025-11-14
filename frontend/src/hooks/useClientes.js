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
      // API de RENIEC (usando PeruDevs)
      const token = 'cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjhmMTkzNTcyZGZhMTIyNjA3ZTgzZTk5';
      const url = `https://api.perudevs.com/api/v1/dni/simple?document=${dni}&key=${token}`;
      
      const response = await axios.get(url);
      const data = response.data.resultado || response.data.data || response.data;
      
      setLoading(false);
      
      return {
        dni: data.numero || dni,
        nombres: data.nombres,
        apellidoPaterno: data.apellido_paterno || data.apellidoPaterno,
        apellidoMaterno: data.apellido_materno || data.apellidoMaterno,
        nombreCompleto: `${data.nombres} ${data.apellido_paterno || data.apellidoPaterno} ${data.apellido_materno || data.apellidoMaterno}`
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
      // API de SUNAT (usando PeruDevs)
      const token = 'cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjhmMTkzNTcyZGZhMTIyNjA3ZTgzZTk5';
      const url = `https://api.perudevs.com/api/v1/ruc/simple?document=${ruc}&key=${token}`;
      
      const response = await axios.get(url);
      const data = response.data.resultado || response.data.data || response.data;
      
      setLoading(false);
      
      return {
        ruc: data.ruc || ruc,
        razonSocial: data.razon_social || data.razonSocial || data.nombre_o_razon_social,
        direccion: data.direccion || data.direccion_completa,
        estado: data.estado || data.estado_contribuyente,
        condicion: data.condicion || data.condicion_domicilio
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