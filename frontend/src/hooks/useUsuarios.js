import { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') || "";
const BACKEND_URL = `${BASE_URL}/api/usuarios`;

export const useUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const guardarUsuarioEnBackend = async (usuarioData, credenciales) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(BACKEND_URL, {
        dni: usuarioData.dni,
        nombre_completo: usuarioData.nombreCompleto,
        apellido_paterno: usuarioData.apellidoPaterno,
        apellido_materno: usuarioData.apellidoMaterno,
        usuario: credenciales.usuario,
        password: credenciales.password,
        rol: credenciales.rol || 'USER'
      });

      return response.data;

    } catch (err) {
      setError('Error al guardar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuariosRegistrados = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      return response.data;

    } catch (err) {
      setError('Error al obtener usuarios');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuarioEnBackend = async (dni) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/buscar/dni/${dni}`);
      return response.data;

    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loginUsuario = async (usuario, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        usuario,
        password
      });

      return response.data;

    } catch (err) {
      setError('Credenciales incorrectas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    guardarUsuarioEnBackend,
    obtenerUsuariosRegistrados,
    buscarUsuarioEnBackend,
    loginUsuario
  };
};
