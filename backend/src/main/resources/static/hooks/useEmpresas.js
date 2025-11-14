import { useState } from 'react';
import axios from 'axios';

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
      // API de SUNAT (usando PeruDevs)
      const token = 'cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjhmMTkzNTcyZGZhMTIyNjA3ZTgzZTk5';
      const url = `https://api.perudevs.com/api/v1/ruc/simple?document=${ruc}&key=${token}`;
      
      const response = await axios.get(url, {
        timeout: 10000 // 10 segundos de timeout
      });
      
      const data = response.data;
      
      setLoading(false);
      
      // Verificar si se encontró la empresa
      if (data && data.estado && data.mensaje === "Encontrado" && data.resultado) {
        const resultado = data.resultado;
        
        return {
          ruc: resultado.ruc || ruc,
          razonSocial: resultado.razon_social || resultado.nombre_o_razon_social || 'No disponible',
          direccion: resultado.direccion || resultado.direccion_completa || '-',
          estado: resultado.estado || resultado.estado_contribuyente || 'ACTIVO',
          condicion: resultado.condicion || resultado.condicion_domicilio || '-',
          departamento: resultado.departamento || '-',
          provincia: resultado.provincia || '-',
          distrito: resultado.distrito || '-',
          ubigeo: resultado.ubigeo || '-'
        };
      } else {
        setError('No se encontraron datos de la empresa en SUNAT');
        return null;
      }
    } catch (err) {
      setLoading(false);
      
      if (err.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. Verifique su conexión a internet');
      } else if (err.response) {
        // Error de respuesta del servidor
        setError(`Error del servidor: ${err.response.status} - ${err.response.data?.mensaje || 'Error desconocido'}`);
      } else if (err.request) {
        // No se recibió respuesta
        setError('No se pudo conectar con el servidor. Verifique su conexión a internet');
      } else {
        setError(`Error: ${err.message}`);
      }
      
      console.error('Error completo al buscar empresa:', err);
      throw err;
    }
  };

  return {
    loading,
    error,
    buscarEmpresaPorRUC
  };
};
