import React, { useState, useEffect } from "react";
import Sidebar from "./components/SildebarForm";
import ClienteForm from "./components/ClienteForm";
import FacturaForm from "./components/FacturaForm";
import FacturaList from "./components/FacturaList";
import ProductosForm from "./components/ProductosForm";
import ListaProductos from "./components/ListaProductos";
import VentasForm from "./components/VentasForm";
import UsuarioForm from "./components/UsuarioFrom";
import EmpresaForm from "./components/EmpresaForm"; // ✅ NUEVO
import Login from "./components/LoginForm";
import axios from "axios";
import "./App.css";
import { FacturaProvider } from "./context/FacturaContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [facturas, setFacturas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientesRegistrados, setClientesRegistrados] = useState([]);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);

  // Cargar productos desde el backend al iniciar
  useEffect(() => {
    cargarProductosDesdeBackend();
  }, []);

  const cargarProductosDesdeBackend = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/productos");
      setProductos(response.data);
      console.log(" Productos cargados desde el backend:", response.data);
    } catch (error) {
      console.error(" Error al cargar productos:", error);
    }
  };

  // Datos de tu empresa (puedes modificarlos aquí)
  const datosEmpresa = {
    ruc: "20543827402",
    razonSocial: "TU EMPRESA S.A.C.",
    direccion: "Av. Principal 123, Lima - Perú",
    telefono: "(01) 234-5678",
    email: "ventas@tuempresa.com"
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSeccionActiva("inicio");
  };

  const agregarFactura = (factura) => {
    setFacturas([...facturas, factura]);
  };

  const agregarProducto = (producto) => {
    // Agregar al estado local
    setProductos([...productos, producto]);
    // Recargar productos del backend para sincronizar
    cargarProductosDesdeBackend();
  };

  const agregarClienteRegistrado = (cliente) => {
    // Verificar si ya está registrado
    const yaRegistrado = clientesRegistrados.find(c => c.dni === cliente.dni);
    if (yaRegistrado) {
      alert("Este cliente ya está registrado");
      return false;
    }
    setClientesRegistrados([...clientesRegistrados, cliente]);
    return true;
  };

  // ← NUEVO: Agregar usuario registrado
  const agregarUsuarioRegistrado = (usuario) => {
    const yaRegistrado = usuariosRegistrados.find(u => u.dni === usuario.dni);
    if (yaRegistrado) {
      alert("Este usuario ya está registrado");
      return false;
    }
    setUsuariosRegistrados([...usuariosRegistrados, usuario]);
    return true;
  };

  // Renderiza el contenido según la sección
  const renderContenido = () => {
    switch (seccionActiva) {
      case "inicio":
        return (
          <div className="seccion-inicio">
            <h2>Bienvenido al Sistema de Facturación</h2>
            <div className="estadisticas">
              <div className="card">
                <h3>Total Clientes</h3>
                <p className="numero">{clientesRegistrados.length}</p>
              </div>
              <div className="card">
                <h3>Total Productos</h3>
                <p className="numero">{productos.length}</p>
              </div>
              <div className="card">
                <h3>Total Facturas</h3>
                <p className="numero">{facturas.length}</p>
              </div>
              {/* ← NUEVO: Card de usuarios */}
              <div className="card">
                <h3>Total Usuarios</h3>
                <p className="numero">{usuariosRegistrados.length}</p>
              </div>
            </div>
          </div>
        );

      case "clientes":
        return (
          <FacturaProvider>
            <ClienteForm 
              clientesRegistrados={clientesRegistrados}
              agregarClienteRegistrado={agregarClienteRegistrado}
            />
          </FacturaProvider>
        );

      // ← NUEVO: Sección de usuarios
      case "usuarios":
        return (
          <UsuarioForm 
            usuariosRegistrados={usuariosRegistrados}
            agregarUsuarioRegistrado={agregarUsuarioRegistrado}
          />
        );

      // ✅ NUEVO: Sección de empresas
      case "empresas":
        return <EmpresaForm />;

      case "productos":
        return (
          <div>
            <ProductosForm agregarProducto={agregarProducto} />
            <ListaProductos productos={productos} />
          </div>
        );

      case "ventas":
        return (
          <div>
            <VentasForm 
              productos={productos}
              clientesRegistrados={clientesRegistrados}
              agregarFactura={agregarFactura}
            />
            <FacturaList facturas={facturas} datosEmpresa={datosEmpresa} />
          </div>
        );

      case "facturas":
        return (
          <FacturaProvider>
            <FacturaList facturas={facturas} datosEmpresa={datosEmpresa} />
          </FacturaProvider>
        );

      case "nueva-factura":
        return (
          <FacturaProvider>
            <FacturaForm agregarFactura={agregarFactura} />
          </FacturaProvider>
        );

      case "reportes":
        return (
          <div>
            <h2>📊 Reportes</h2>
            <p>Aquí irán los reportes y estadísticas</p>
          </div>
        );

      default:
        return <div><h2>Selecciona una opción del menú</h2></div>;
    }
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar 
            seccionActiva={seccionActiva} 
            cambiarSeccion={setSeccionActiva}
            cerrarSesion={handleLogout}
          />
          <main className="contenido-principal">
            {renderContenido()}
          </main>
        </>
      )}
    </div>
  );
}

export default App;