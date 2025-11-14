import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL || ''}/api/productos`;

export const useProductos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los productos
  const obtenerProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(BACKEND_URL);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al obtener productos');
      console.error('Error obteniendo productos:', err);
      throw err;
    }
  };

  // Guardar producto en el backend
  const guardarProducto = async (productoData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(BACKEND_URL, {
        nombre: productoData.nombre,
        precio: productoData.precio,
        cantidad: productoData.cantidad
      });
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al guardar producto en la base de datos');
      console.error('Error guardando producto:', err);
      throw err;
    }
  };

  // Buscar producto por ID
  const buscarProductoPorId = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/${id}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Producto no encontrado');
      console.error('Error buscando producto:', err);
      return null;
    }
  };

  // Buscar productos por nombre
  const buscarProductosPorNombre = async (nombre) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/buscar/nombre/${nombre}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('No se encontraron productos con ese nombre');
      console.error('Error buscando productos:', err);
      return [];
    }
  };

  // Actualizar producto
  const actualizarProducto = async (id, productoData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${BACKEND_URL}/${id}`, {
        nombre: productoData.nombre,
        precio: productoData.precio,
        cantidad: productoData.cantidad
      });
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al actualizar producto');
      console.error('Error actualizando producto:', err);
      throw err;
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${BACKEND_URL}/${id}`);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError('Error al eliminar producto');
      console.error('Error eliminando producto:', err);
      throw err;
    }
  };

  return {
    loading,
    error,
    obtenerProductos,
    guardarProducto,
    buscarProductoPorId,
    buscarProductosPorNombre,
    actualizarProducto,
    eliminarProducto
  };
};