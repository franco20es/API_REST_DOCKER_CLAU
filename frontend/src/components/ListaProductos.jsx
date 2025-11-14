import React from "react";
import "./ListaProductos.css";

const ListaProductos = ({ productos }) => {
  return (
    <div className="lista-productos-container">   
      <h2 className="titulo-productos">📦 Lista de Productos Registrados</h2>
      
      {productos.length === 0 ? (
        <div className="sin-productos">
          <div className="icono-vacio">📦</div>
          <p>No hay productos registrados</p>
          <small>Agrega productos desde el formulario de arriba</small>
        </div>
      ) : (
        <div className="tabla-wrapper">
          <div className="info-productos">
            <span className="total-productos">
              Total de productos: <strong>{productos.length}</strong>
            </span>
            <span className="stock-total">
              Stock total: <strong>{productos.reduce((sum, p) => sum + parseInt(p.cantidad || 0), 0)}</strong> unidades
            </span>
          </div>
          
          <table className="tabla-productos">
            <thead>
              <tr>
                <th className="col-codigo">Código</th>
                <th className="col-nombre">Nombre del Producto</th>
                <th className="col-precio">Precio Unitario</th>
                <th className="col-cantidad">Stock</th>
                <th className="col-total">Valor Total</th>
              </tr>
            </thead>
            
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id_producto}> {/* ← CAMBIO AQUÍ: id_producto */}
                  <td className="codigo-cell">
                    <span className="badge-codigo">#{producto.id_producto}</span> {/* ← CAMBIO AQUÍ */}
                  </td>
                  <td className="nombre-cell">
                    <strong>{producto.nombre}</strong>
                  </td>
                  <td className="precio-cell">
                    S/ {parseFloat(producto.precio).toFixed(2)}
                  </td>
                  <td className="cantidad-cell">
                    <span className={`badge-stock ${producto.cantidad < 10 ? 'stock-bajo' : 'stock-ok'}`}>
                      {producto.cantidad} un.
                    </span>
                  </td>
                  <td className="total-cell">
                    S/ {(parseFloat(producto.precio) * parseInt(producto.cantidad)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            
            <tfoot>
              <tr className="fila-totales">
                <td colSpan="3"></td>
                <td><strong>TOTAL INVENTARIO:</strong></td>
                <td className="total-inventario">
                  <strong>
                    S/ {productos.reduce((sum, p) => sum + (parseFloat(p.precio) * parseInt(p.cantidad || 0)), 0).toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaProductos;