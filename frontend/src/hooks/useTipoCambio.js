import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTipoCambio = () => {
  const [tipoCambio, setTipoCambio] = useState(3.70); // Valor inicial
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const obtenerTipoCambio = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://open.er-api.com/v6/latest/USD");

      // Validación de la API
      if (!response.data?.rates?.PEN) {
        throw new Error("Respuesta inválida de API");
      }

      const tasa = Number(response.data.rates.PEN);

      setTipoCambio(tasa);
      setUltimaActualizacion(new Date());
      setLoading(false);

      return tasa;
    } catch (err) {
      console.warn("⚠️ Error al obtener tipo de cambio:", err.message);

      setError("No se pudo obtener el tipo de cambio actual");

      // Mantiene valor actual (fallback)
      setLoading(false);
      return tipoCambio;
    }
  };

  // Convertir USD → PEN
  const convertirUSDtoSoles = (montoUSD) => {
    if (!montoUSD) return "0.00";
    return (parseFloat(montoUSD) * tipoCambio).toFixed(2);
  };

  // Convertir PEN → USD
  const convertirSolesToUSD = (montoSoles) => {
    if (!montoSoles) return "0.00";
    return (parseFloat(montoSoles) / tipoCambio).toFixed(2);
  };

  // Se ejecuta una vez al cargar el componente
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
    convertirSolesToUSD,
  };
};
