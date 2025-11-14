import React, { useState, useEffect } from "react";
import { useClientes } from "../hooks/useClientes";
import { useUsuarios } from "../hooks/useUsuarios";
import "./ProductosForm.css";
const UsuarioForm = () => {
  const [dni, setDni] = useState("");
  const [cliente, setCliente] = useState(null);
  const [credenciales, setCredenciales] = useState({
    usuario: "",
    password: "",
    rol: "USER"
  });
  const [usuariosBackend, setUsuariosBackend] = useState([]);

  const { buscarClientePorDNI, loading: loadingReniec } = useClientes();
  const { 
    guardarUsuarioEnBackend,
    obtenerUsuariosRegistrados,
    buscarUsuarioEnBackend,
    loading: loadingUsuario
  } = useUsuarios();

  useEffect(() => {
    cargarUsuariosBackend();
  }, []);

  const cargarUsuariosBackend = async () => {
    try {
      const usuarios = await obtenerUsuariosRegistrados();
      setUsuariosBackend(usuarios);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const buscarCliente = async () => {
    if (!dni || dni.length !== 8) {
      alert("Ingrese un DNI válido (8 dígitos)");
      return;
    }

    try {
      // Verificar si ya existe como usuario
      const usuarioExistente = await buscarUsuarioEnBackend(dni);
      if (usuarioExistente && usuarioExistente.length > 0) {
        alert("Este DNI ya está registrado como usuario");
        return;
      }

      // Buscar en RENIEC
      const clienteData = await buscarClientePorDNI(dni);
      setCliente(clienteData);
      
      // Autocompletar usuario con nombres
      setCredenciales({
        ...credenciales,
        usuario: clienteData.nombres?.toLowerCase().replace(/\s+/g, '') || ''
      });
    } catch (err) {
      console.error("Error al consultar el DNI:", err);
      alert("No se encontró el cliente en RENIEC");
      setCliente(null);
    }
  };

  const registrarUsuario = async () => {
    if (!cliente) {
      alert("Primero busque un cliente por DNI");
      return;
    }

    if (!credenciales.usuario || !credenciales.password) {
      alert("Complete el usuario y contraseña");
      return;
    }

    try {
      await guardarUsuarioEnBackend(cliente, credenciales);
      alert("Usuario registrado exitosamente");
      
      // Recargar la lista
      await cargarUsuariosBackend();
      
      // Limpiar formulario
      setDni("");
      setCliente(null);
      setCredenciales({ usuario: "", password: "", rol: "USER" });
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      alert("Error al registrar el usuario");
    }
  };

  return (
    <div className="form-card">
      <h2>👤 Registrar Usuario</h2>

      {/* Buscar por DNI */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Ingrese DNI (8 dígitos)"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
          maxLength="8"
          disabled={loadingReniec}
        />
        <button 
          onClick={buscarCliente} 
          disabled={loadingReniec || !dni || dni.length !== 8}
          className="btn-primary"
        >
          {loadingReniec ? "Buscando..." : "🔍 Buscar"}
        </button>
      </div>

      {/* Datos del cliente encontrado */}
      {cliente && (
        <div className="cliente-info">
          <h3>✅ Cliente Encontrado</h3>
          <table className="tabla-cliente">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Nombres</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dni}</td>
                <td>{cliente.nombreCompleto}</td>
                <td>{cliente.nombres}</td>
                <td>{cliente.apellidoPaterno}</td>
                <td>{cliente.apellidoMaterno}</td>
              </tr>
            </tbody>
          </table>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '2px solid #ddd' }} />

          <h3>🔐 Credenciales de Usuario</h3>
          <div className="form-group">
            <label>Usuario:</label>
            <input
              type="text"
              value={credenciales.usuario}
              onChange={(e) => setCredenciales({...credenciales, usuario: e.target.value})}
              placeholder="Nombre de usuario"
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={credenciales.password}
              onChange={(e) => setCredenciales({...credenciales, password: e.target.value})}
              placeholder="Contraseña"
            />
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select
              value={credenciales.rol}
              onChange={(e) => setCredenciales({...credenciales, rol: e.target.value})}
            >
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button 
            onClick={registrarUsuario} 
            className="btn-registrar"
            disabled={loadingUsuario}
          >
            {loadingUsuario ? "Guardando..." : "✓ Registrar Usuario"}
          </button>
        </div>
      )}

      {/* Tabla de usuarios registrados */}
      {usuariosBackend.length > 0 && (
        <div className="clientes-registrados">
          <h3>📋 Usuarios Registrados ({usuariosBackend.length})</h3>
          <table className="tabla-clientes-registrados">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Usuario</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuariosBackend.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.dni}</td>
                  <td><strong>{usuario.nombre_completo}</strong></td>
                  <td>{usuario.usuario}</td>
                  <td>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: usuario.rol === 'ADMIN' ? '#e74c3c' : '#3498db',
                      color: 'white'
                    }}>
                      {usuario.rol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsuarioForm;