import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL || ''}/api/usuarios`;

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
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al guardar usuario en la base de datos');
      console.error('Error guardando usuario:', err);
      throw err;
    }
  };

  const obtenerUsuariosRegistrados = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al obtener usuarios');
      throw err;
    }
  };

  const buscarUsuarioEnBackend = async (dni) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/buscar/dni/${dni}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      return null;
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
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Credenciales incorrectas');
      throw err;
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