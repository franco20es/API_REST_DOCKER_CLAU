import React, { useState } from "react";
import { useProductos } from "../hooks/useProductos"; // ← Importar el hook
import "./ProductosForm.css";

const ProductosForm = ({ agregarProducto, recargarProductos }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");

  // ← Usar el hook
  const { guardarProducto, loading, error } = useProductos();

  const handleSubmit = async (e) => { // ← async
    e.preventDefault();
    
    if (!nombre || !precio || !cantidad) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (parseFloat(precio) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    if (parseInt(cantidad) <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    const nuevoProducto = {
      nombre: nombre.trim(),
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad)
    };

    try {
      // ← Guardar en el backend (Spring Boot)
      const productoGuardado = await guardarProducto(nuevoProducto);
      
      alert(`✅ Producto "${nombre}" agregado exitosamente a la base de datos`);
      
      // ← Recargar lista de productos desde el backend
      if (recargarProductos) {
        await recargarProductos();
      }
      
      // Si hay función del padre (para estado local)
      if (agregarProducto) {
        agregarProducto(productoGuardado);
      }

      // Limpiar formulario
      setNombre("");
      setPrecio("");
      setCantidad("");
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("❌ Error al guardar el producto en la base de datos");
    }
  };

  return (
    <div className="productos-form-container">
      <h2 className="form-titulo">📦 Agregar Producto</h2>
      
      {/* ← Mostrar error si existe */}
      {error && (
        <div className="error-message" style={{
          background: '#fee', 
          color: '#c00', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form-productos">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">
              <span className="label-icon">🏷️</span>
              Nombre del Producto
            </label>
            <input 
              id="nombre"
              type="text" 
              placeholder="Ej: Paracetamol, Laptop, etc."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-input"
              maxLength={100}
              disabled={loading} // ← Deshabilitar mientras carga
            />
            <small className="input-hint">
              {nombre.length}/100 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="precio">
              <span className="label-icon">💰</span>
              Precio Unitario (S/)
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix">S/</span>
              <input 
                id="precio"
                type="number" 
                placeholder="0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="form-input input-with-prefix-field"
                step="0.01"
                min="0.01"
                disabled={loading}
              />
            </div>
            {precio && (
              <small className="input-hint precio-preview">
                Precio: S/ {parseFloat(precio).toFixed(2)}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cantidad">
              <span className="label-icon">📊</span>
              Cantidad en Stock
            </label>
            <div className="cantidad-controls">
              <button 
                type="button"
                className="btn-cantidad"
                onClick={() => setCantidad(Math.max(0, parseInt(cantidad || 0) - 1))}
                disabled={loading}
              >
                −
              </button>
              <input 
                id="cantidad"
                type="number" 
                placeholder="0"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="form-input input-cantidad"
                min="1"
                disabled={loading}
              />
              <button 
                type="button"
                className="btn-cantidad"
                onClick={() => setCantidad(parseInt(cantidad || 0) + 1)}
                disabled={loading}
              >
                +
              </button>
            </div>
            {cantidad && (
              <small className="input-hint">
                {parseInt(cantidad)} unidades
              </small>
            )}
          </div>
        </div>

        {nombre && precio && cantidad && (
          <div className="producto-preview">
            <div className="preview-header">
              <span className="preview-icon">👁️</span>
              <strong>Vista Previa del Producto</strong>
            </div>
            <div className="preview-content">
              <div className="preview-item">
                <span className="preview-label">Producto:</span>
                <span className="preview-value">{nombre}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Precio Unitario:</span>
                <span className="preview-value precio">S/ {parseFloat(precio).toFixed(2)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Cantidad:</span>
                <span className="preview-value">{cantidad} unidades</span>
              </div>
              <div className="preview-item total">
                <span className="preview-label">Valor Total:</span>
                <span className="preview-value valor-total">
                  S/ {(parseFloat(precio) * parseInt(cantidad)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="btn-agregar-producto" disabled={loading}>
          <span className="btn-icon">➕</span>
          {loading ? "Guardando..." : "Agregar Producto al Inventario"}
        </button>
      </form>
    </div>
  );
};

export default ProductosForm;