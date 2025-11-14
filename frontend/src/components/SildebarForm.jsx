import React from "react";
import "./Sidebar.css";

const Sidebar = ({ seccionActiva, cambiarSeccion, cerrarSesion }) => {
  const menuItems = [
    { id: "inicio", nombre: "Inicio", icono: "🏠" },
    { id: "clientes", nombre: "Clientes", icono: "👥" },
    { id: "empresas", nombre: "Empresas", icono: "🏢" },       // ✅ NUEVO
    { id: "usuarios", nombre: "Usuarios", icono: "👤" },
    { id: "productos", nombre: "Productos", icono: "📦" },
    { id: "ventas", nombre: "Ventas", icono: "🛒" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>💼 Sistema Facturación</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${seccionActiva === item.id ? "activo" : ""}`}
              onClick={() => cambiarSeccion(item.id)}
            >
              <span className="icono">{item.icono}</span>
              <span className="texto">{item.nombre}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;