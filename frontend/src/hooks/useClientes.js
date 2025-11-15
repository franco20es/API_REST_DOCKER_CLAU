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
      // API de RENIEC (DeColecta)
      const token = 'sk_10991.mftCUraGWAg9GH57tcKSAQ6kHiMy2NOD';
      const url = `https://api.decolecta.com/v1/reniec/dni?numero=${dni}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Respuesta: { first_name, first_last_name, second_last_name, document_number, full_name }
      const data = response.data;
      
      setLoading(false);
      
      return {
        dni: data.document_number || dni,
        nombres: data.first_name,
        apellidoPaterno: data.first_last_name,
        apellidoMaterno: data.second_last_name,
        nombreCompleto: data.full_name || `${data.first_name} ${data.first_last_name} ${data.second_last_name}`
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
      // API de SUNAT (DeColecta)
      const token = 'sk_10991.mftCUraGWAg9GH57tcKSAQ6kHiMy2NOD';
      const url = `https://api.decolecta.com/v1/sunat/ruc?numero=${ruc}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Respuesta: { razon_social, numero_documento, estado, condicion, direccion, ... }
      const data = response.data;
      
      setLoading(false);
      
      return {
        ruc: data.numero_documento || ruc,
        razonSocial: data.razon_social,
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