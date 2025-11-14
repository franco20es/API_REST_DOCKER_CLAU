import React, { useState, useEffect, useContext } from "react";
import { useClientes } from "../hooks/useClientes";
import { FacturaContext } from "../context/FacturaContext";

const ClienteForm = ({ onClienteSeleccionado, clientesRegistrados = [], agregarClienteRegistrado }) => {
  const [dni, setDni] = useState("");
  const [cliente, setCliente] = useState(null);
  const [clientesBackend, setClientesBackend] = useState([]);

  const {
    buscarClientePorDNI,
    guardarClienteEnBackend,
    obtenerClientesRegistrados,
    buscarClienteEnBackend,
    loading,
    error
  } = useClientes();

  const { agregarCliente } = useContext(FacturaContext);

  // Cargar clientes del backend al montar el componente
  useEffect(() => {
    cargarClientesBackend();
  }, []);

  const cargarClientesBackend = async () => {
    try {
      const clientes = await obtenerClientesRegistrados();
      setClientesBackend(clientes);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const buscarCliente = async () => {
    if (!dni || dni.length !== 8) {
      alert("Ingrese un DNI válido (8 dígitos)");
      return;
    }

    try {
      const clienteEnBackend = await buscarClienteEnBackend(dni);

      if (clienteEnBackend && clienteEnBackend.length > 0) {  // Verificar array no vacío
        alert("Este cliente ya está registrado en la base de datos");
        setCliente({
          dni: clienteEnBackend[0].dni,  // Acceder al primer elemento
          nombres: clienteEnBackend[0].nombre_completo?.split(' ')[0] || '',
          apellidoPaterno: clienteEnBackend[0].apellido_paterno,
          apellidoMaterno: clienteEnBackend[0].apellido_materno,
          nombreCompleto: clienteEnBackend[0].nombre_completo,
          yaRegistrado: true
        });
        return;
      }

      // Si no existe, buscar en RENIEC
      const clienteData = await buscarClientePorDNI(dni);
      setCliente({ ...clienteData, yaRegistrado: false });
      agregarCliente(clienteData);

      // Si hay un callback, pasar los datos del cliente
      if (onClienteSeleccionado) {
        onClienteSeleccionado(clienteData);
      }
    } catch (err) {
      console.error("Error al consultar el DNI:", err);
      alert("No se encontró el cliente o la API no respondió");
      setCliente(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarCliente();
    }
  };

  const limpiarFormulario = () => {
    setDni("");
    setCliente(null);
  };

  const registrarCliente = async () => {
    if (!cliente) {
      alert("No hay cliente para registrar");
      return;
    }

    if (cliente.yaRegistrado) {
      alert("Este cliente ya está registrado");
      return;
    }

    try {
      // Guardar en el backend (Spring Boot)
      const clienteGuardado = await guardarClienteEnBackend(cliente);

      alert("Cliente registrado exitosamente en la base de datos");

      // Recargar la lista de clientes
      await cargarClientesBackend();

      // Usar la función del padre si existe
      if (agregarClienteRegistrado) {
        agregarClienteRegistrado(cliente);
      }

      limpiarFormulario();
    } catch (err) {
      console.error("Error al registrar cliente:", err);
      alert("Error al registrar el cliente en la base de datos");
    }
  };

  return (
    <div className="form-card">
      <h2>🔍 Buscar Cliente (RENIEC)</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Ingrese DNI (8 dígitos)"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
          onKeyPress={handleKeyPress}
          maxLength="8"
          disabled={loading}
        />
        <button
          onClick={buscarCliente}
          disabled={loading || !dni || dni.length !== 8}
          className="btn-primary"
        >
          {loading ? "Buscando..." : "🔍 Buscar"}
        </button>
        {cliente && (
          <button
            onClick={limpiarFormulario}
            className="btn-secondary"
          >
            🗑️ Limpiar
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {cliente && (
        <div className="cliente-info">
          <h3>Cliente Encontrado {cliente.yaRegistrado && '(Ya Registrado)'}</h3>
          <table className="tabla-cliente">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Nombres</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{cliente.dni}</td>
                <td>{cliente.nombreCompleto}</td>
                <td>{cliente.nombres}</td>
                <td>{cliente.apellidoPaterno}</td>
                <td>{cliente.apellidoMaterno}</td>
                <td>
                  {!cliente.yaRegistrado ? (
                    <button onClick={registrarCliente} className="btn-registrar">
                      ✓ Registrar en BD
                    </button>
                  ) : (
                    <span style={{ color: 'green' }}>✓ Ya registrado</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla de clientes registrados en el BACKEND */}
      {clientesBackend.length > 0 && (
        <div className="clientes-registrados">
          <h3>📋 Clientes en Base de Datos ({clientesBackend.length})</h3>
          <table className="tabla-clientes-registrados">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
              </tr>
            </thead>
            <tbody>
              {clientesBackend.map((cli) => (
                <tr key={cli.id_cliente}>
                  <td>{cli.id_cliente}</td>
                  <td>{cli.dni}</td>
                  <td>{cli.nombre_completo}</td>
                  <td>{cli.apellido_paterno}</td>
                  <td>{cli.apellido_materno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClienteForm;