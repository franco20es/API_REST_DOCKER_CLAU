import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEmpresas } from "../hooks/useEmpresas"; //  Importar el hook
import "./ProductosForm.css"; // Usamos el mismo CSS que otros formularios

const EmpresaForm = () => {
  const [ruc, setRuc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccion, setDireccion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [estado, setEstado] = useState("ACTIVO");
  const [condicion, setCondicion] = useState("HABIDO");
  const [loadingRegistro, setLoadingRegistro] = useState(false);
  const [empresasRegistradas, setEmpresasRegistradas] = useState([]);

  //  Usar el hook de empresas
  const { buscarEmpresaPorRUC, loading: loadingBusqueda, error: errorBusqueda } = useEmpresas();

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const response = await axios.get("/api/empresas");
      setEmpresasRegistradas(response.data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  };

  const buscarEnSUNAT = async () => {
    if (!ruc || ruc.length !== 11) {
      alert(" Ingrese un RUC válido de 11 dígitos");
      return;
    }

    try {
      //  Usar el hook para buscar en SUNAT
      const empresa = await buscarEmpresaPorRUC(ruc);

      if (empresa) {
        // Rellenar el formulario con los datos encontrados
        setRazonSocial(empresa.razonSocial || "");
        setDireccion(empresa.direccion || "");
        setDepartamento(empresa.departamento || "");
        setProvincia(empresa.provincia || "");
        setDistrito(empresa.distrito || "");
        setEstado(empresa.estado || "ACTIVO");
        setCondicion(empresa.condicion || "HABIDO");
        alert(" Datos encontrados en SUNAT. Verifique y registre.");
      } else {
        alert(" No se encontraron datos en SUNAT. Complete manualmente.");
      }
    } catch (error) {
      // El error ya está manejado en el hook
      alert(` ${errorBusqueda || "Error al consultar SUNAT"}. Complete los datos manualmente.`);
    }
  };

  const registrarEmpresa = async (e) => {
    e.preventDefault();

    if (!ruc || !razonSocial) {
      alert(" RUC y Razón Social son obligatorios");
      return;
    }

    const empresaData = {
      ruc,
      razon_social: razonSocial,
      direccion: direccion || "-",
      departamento: departamento || "-",
      provincia: provincia || "-",
      distrito: distrito || "-",
      estado: estado || "ACTIVO",
      condicion: condicion || "HABIDO"
    };

    try {
      setLoadingRegistro(true);
      const response = await axios.post("/api/empresas", empresaData);
      
      alert(" Empresa registrada exitosamente");
      limpiarFormulario();
      cargarEmpresas();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(" Esta empresa ya está registrada");
      } else {
        alert(` Error al registrar: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoadingRegistro(false);
    }
  };

  const limpiarFormulario = () => {
    setRuc("");
    setRazonSocial("");
    setDireccion("");
    setDepartamento("");
    setProvincia("");
    setDistrito("");
    setEstado("ACTIVO");
    setCondicion("HABIDO");
  };

  const eliminarEmpresa = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta empresa?")) {
      return;
    }

    try {
      await axios.delete(`/api/empresas/${id}`);
      alert(" Empresa eliminada");
      cargarEmpresas();
    } catch (error) {
      alert(" Error al eliminar empresa");
    }
  };

  return (
    <div className="productos-container">
      <h2>🏢 Registrar Empresa</h2>

      <form className="productos-form" onSubmit={registrarEmpresa}>
        <div className="form-row">
          <div className="form-group">
            <label>🔢 RUC (11 dígitos) *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                placeholder="20123456789"
                maxLength="11"
                required
              />
              <button 
                type="button" 
                onClick={buscarEnSUNAT}
                disabled={loadingBusqueda || ruc.length !== 11}
                className="btn-buscar"
              >
                {loadingBusqueda ? "Buscando..." : "🔍 Buscar"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>🏢 Razón Social *</label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              placeholder="EMPRESA S.A.C."
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>📍 Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Av. Principal 123"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>🗺️ Departamento</label>
            <input
              type="text"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              placeholder="LIMA"
            />
          </div>

          <div className="form-group">
            <label>🏙️ Provincia</label>
            <input
              type="text"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              placeholder="LIMA"
            />
          </div>

          <div className="form-group">
            <label>🏘️ Distrito</label>
            <input
              type="text"
              value={distrito}
              onChange={(e) => setDistrito(e.target.value)}
              placeholder="SAN ISIDRO"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>📊 Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="ACTIVO">ACTIVO</option>
              <option value="BAJA">BAJA DE OFICIO</option>
              <option value="SUSPENSION">SUSPENSIÓN TEMPORAL</option>
            </select>
          </div>

          <div className="form-group">
            <label>✅ Condición</label>
            <select value={condicion} onChange={(e) => setCondicion(e.target.value)}>
              <option value="HABIDO">HABIDO</option>
              <option value="NO HABIDO">NO HABIDO</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loadingRegistro}>
            {loadingRegistro ? "Guardando..." : "✅ Registrar Empresa"}
          </button>
          <button type="button" onClick={limpiarFormulario}>
            🔄 Limpiar
          </button>
        </div>
      </form>

      {/* TABLA DE EMPRESAS REGISTRADAS */}
      <div className="tabla-productos">
        <h3>📋 Empresas Registradas ({empresasRegistradas.length})</h3>
        <table>
          <thead>
            <tr>
              <th>RUC</th>
              <th>Razón Social</th>
              <th>Dirección</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Condición</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresasRegistradas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No hay empresas registradas
                </td>
              </tr>
            ) : (
              empresasRegistradas.map((empresa) => (
                <tr key={empresa.id_empresa}>
                  <td>{empresa.ruc}</td>
                  <td>{empresa.razon_social}</td>
                  <td>{empresa.direccion}</td>
                  <td>
                    {empresa.distrito}, {empresa.provincia}, {empresa.departamento}
                  </td>
                  <td>
                    <span className={`badge ${empresa.estado === 'ACTIVO' ? 'badge-success' : 'badge-danger'}`}>
                      {empresa.estado}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${empresa.condicion === 'HABIDO' ? 'badge-success' : 'badge-warning'}`}>
                      {empresa.condicion}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => eliminarEmpresa(empresa.id_empresa)}
                      className="btn-eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpresaForm;
