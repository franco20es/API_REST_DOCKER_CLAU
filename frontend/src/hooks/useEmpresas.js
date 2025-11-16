import { useState } from 'react';
import axios from 'axios';

// URL REAL DEL BACKEND (producción / docker)
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://34.28.54.252:8080";

// ENDPOINT EMPRESAS
const BACKEND_URL = `${BASE_URL}/api/empresas`;

export const useEmpresas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------------------
  // Buscar empresa por RUC (SUNAT -> backend)
  // ---------------------------
  const buscarEmpresaPorRUC = async (ruc) => {
    if (!ruc || ruc.length !== 11) {
      throw new Error("RUC debe tener 11 dígitos");
    }

    setLoading(true);
    setError(null);

    try {
      //  Siempre llamar a backend completo (NO /api/... directo)
      const url = `${BASE_URL}/api/reniec/ruc/${ruc}`;

      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data;

      setLoading(false);

      return {
        ruc: data.ruc || ruc,
        razonSocial: data.razonSocial || "No disponible",
        direccion: data.direccion || "-",
        estado: data.estado || "ACTIVO",
        condicion: data.condicion || "HABIDO"
      };
    } catch (err) {
      setLoading(false);

      if (err.code === "ECONNABORTED") {
        setError("Tiempo de espera agotado.");
      } else if (err.response) {
        setError(`Error del servidor: ${err.response.status}`);
      } else {
        setError("No se pudo conectar con el backend");
      }

      return null;
    }
  };

  // ---------------------------
  // Guardar empresa en el backend
  // ---------------------------
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
        departamento: empresaData.departamento || "-",
        provincia: empresaData.provincia || "-",
        distrito: empresaData.distrito || "-",
        ubigeo: empresaData.ubigeo || "-"
      });

      setLoading(false);
      return response.data;

    } catch (err) {
      setLoading(false);

      if (err.response?.status === 409) {
        setError("Esta empresa ya está registrada");
        return err.response.data;
      }

      setError("Error al guardar la empresa");
      throw err;
    }
  };

  // ---------------------------
  // Buscar empresa en PostgreSQL
  // ---------------------------
  const buscarEmpresaEnBackend = async (ruc) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/buscar/ruc/${ruc}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  // ---------------------------
  // Obtener todas las empresas
  // ---------------------------
  const obtenerEmpresasRegistradas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError("Error al obtener empresas");
      throw err;
    }
  };

  // ---------------------------
  // Eliminar empresa
  // ---------------------------
  const eliminarEmpresa = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError("Error al eliminar empresa");
      throw err;
    }
  };

  return {
    loading,
    error,
    buscarEmpresaPorRUC,
    guardarEmpresaEnBackend,
    buscarEmpresaEnBackend,
    obtenerEmpresasRegistradas,
    eliminarEmpresa
  };
};
