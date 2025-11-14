import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTipoCambio = () => {
  const [tipoCambio, setTipoCambio] = useState(3.70); // Valor por defecto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const obtenerTipoCambio = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usando API gratuita de tipo de cambio
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      
      const tasaPEN = response.data.rates.PEN;
      
      setTipoCambio(tasaPEN);
      setUltimaActualizacion(new Date());
      setLoading(false);
      
      return tasaPEN;
    } catch (err) {
      console.error('Error al obtener tipo de cambio:', err);
      setError('No se pudo obtener el tipo de cambio');
      setLoading(false);
      return tipoCambio; // Retorna el valor actual si hay error
    }
  };

  const convertirUSDtoSoles = (montoUSD) => {
    return (parseFloat(montoUSD) * tipoCambio).toFixed(2);
  };

  const convertirSolesToUSD = (montoSoles) => {
    return (parseFloat(montoSoles) / tipoCambio).toFixed(2);
  };

  // Obtener tipo de cambio al montar el componente
  useEffect(() => {
    obtenerTipoCambio();
    
    // Actualizar cada 30 minutos
    const interval = setInterval(obtenerTipoCambio, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    tipoCambio,
    loading,
    error,
    ultimaActualizacion,
    obtenerTipoCambio,
    convertirUSDtoSoles,
    convertirSolesToUSD
  };
};
