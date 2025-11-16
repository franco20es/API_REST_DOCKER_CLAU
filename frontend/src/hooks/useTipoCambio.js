import { useState, useEffect } from 'react';
import axios from 'axios';

// **CLAVE DECOLECTA (REQUERIDA)**
const DECOLECTA_API_KEY = "sk_10991.SttqhR57G89Ven46TNFgkzBd9WYOx6cu"; 

export const useTipoCambio = () => {
  const [tipoCambio, setTipoCambio] = useState(3.70); // Fallback inicial
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const obtenerTipoCambio = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. URL de la API de Decolecta (SBS Promedio)
      const DECOLECTA_URL = "https://api.decolecta.com/v1/tipo-cambio/sbs/average?currency=USD";

      const response = await axios.get(DECOLECTA_URL, {
        // 2. Incluye el Header de Autorización
        headers: {
          'Authorization': `Bearer ${DECOLECTA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      // 3. Validación y Extracción del precio de venta ("sell_price")
      // Usaremos el precio de Venta como la tasa de cambio
      const sellPrice = response.data?.data?.sell_price;
      
      if (!response.data?.success || !sellPrice) {
        throw new Error("Respuesta inválida o incompleta de la API de Decolecta/SBS");
      }

      const tasa = parseFloat(sellPrice); 

      setTipoCambio(tasa);
      setUltimaActualizacion(new Date());
      setLoading(false);

      return tasa;
    } catch (err) {
      console.warn(" Error al obtener tipo de cambio (Decolecta/SBS):", err.message);
      setError("No se pudo obtener el tipo de cambio actual de la SBS");
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

  // Se ejecuta una vez y luego cada 30 minutos
  useEffect(() => {
    obtenerTipoCambio();
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