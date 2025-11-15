import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL || ''}/api/empresas`;

export const useEmpresas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar empresa por RUC (SUNAT)
  const buscarEmpresaPorRUC = async (ruc) => {
    if (!ruc || ruc.length !== 11) {
      throw new Error('RUC debe tener 11 dígitos');
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar al backend que consulta SUNAT (evita CORS)
      const url = `/api/reniec/ruc/${ruc}`;
      
      const response = await axios.get(url, {
        timeout: 10000
      });
      
      const data = response.data;
      
      setLoading(false);
      
      return {
        ruc: data.ruc || ruc,
        razonSocial: data.razonSocial || 'No disponible',
        direccion: data.direccion || '-',
        estado: data.estado || 'ACTIVO',
        condicion: data.condicion || 'HABIDO'
      };
    } catch (err) {
      setLoading(false);
      
      if (err.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. Verifique su conexión a internet');
      } else if (err.response) {
        setError(`Error del servidor: ${err.response.status} - ${err.response.data?.mensaje || 'Error desconocido'}`);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifique su conexión a internet');
      } else {
        setError(`Error: ${err.message}`);
      }
      
      return null;
    }
  };

  // ← GUARDAR empresa en el backend
  const guardarEmpresaEnBackend = async (empresaData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(BACKEND_URL, {
        ruc: empresaData.ruc,
        razon_social: empresaData.razonSocial,
        direccion: empresaData.direccion,
        estado: empresaData.estado,
        condicion: empresaData.condicion,
        departamento: empresaData.departamento || '-',
        provincia: empresaData.provincia || '-',
        distrito: empresaData.distrito || '-',
        ubigeo: empresaData.ubigeo || '-'
      });
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      
      if (err.response?.status === 409) {
        // Empresa ya existe - retornar la empresa existente
        setError('Esta empresa ya está registrada');
        return err.response.data;
      }
      
      setError('Error al guardar empresa en la base de datos');
      console.error('Error guardando empresa:', err);
      throw err;
    }
  };

  // ← BUSCAR empresa en backend por RUC
  const buscarEmpresaEnBackend = async (ruc) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/buscar/ruc/${ruc}`);
      setLoading(false);
      return response.data; // Retorna array de empresas
    } catch (err) {
      setLoading(false);
      return null; // No es error si no se encuentra
    }
  };

  // ← OBTENER todas las empresas registradas
  const obtenerEmpresasRegistradas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al obtener empresas');
      console.error('Error obteniendo empresas:', err);
      throw err;
    }
  };

  // ← ELIMINAR empresa
  const eliminarEmpresa = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError('Error al eliminar empresa');
      console.error('Error eliminando empresa:', err);
      throw err;
    }
  };

  return {
    loading,
    error,
    buscarEmpresaPorRUC,              // Consulta SUNAT
    guardarEmpresaEnBackend,          // Guarda en PostgreSQL
    buscarEmpresaEnBackend,           // Busca en PostgreSQL
    obtenerEmpresasRegistradas,       // Lista todas de PostgreSQL
    eliminarEmpresa                   // Elimina de PostgreSQL
  };
};