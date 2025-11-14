import React, { useState } from "react";
import { useClientes } from "../hooks/useClientes";
import { useFacturas } from "../hooks/useFacturas";
import { useEmpresas } from "../hooks/useEmpresas"; // ✅ Importar hook de empresas
import axios from "axios";
import "./VentasForm.css";

const VentasForm = ({ productos, clientesRegistrados, agregarFactura }) => {
  // Estados para cliente o empresa
  const [tipoCliente, setTipoCliente] = useState("persona");
  const [dni, setDni] = useState("");
  const [ruc, setRuc] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  
  // ✅ Hooks
  const { buscarClientePorDNI, buscarClienteEnBackend, loading: loadingCliente } = useClientes();
  const { buscarEmpresaPorRUC, loading: loadingEmpresa, error: errorEmpresa } = useEmpresas();
  const { guardarFactura, generarNumeroComprobante, loading: loadingFactura, error: errorFactura } = useFacturas();

  // Estados para productos
  const [codigoProducto, setCodigoProducto] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Estados para factura
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [moneda, setMoneda] = useState("PEN");
  const [tipoCambio, setTipoCambio] = useState(null);

  // Buscar cliente por DNI, nombre o apellido
  const buscarCliente = async () => {
    if (!dni) {
      alert("Ingrese DNI, nombre o apellido del cliente");
      return;
    }

    const busqueda = dni.toLowerCase().trim();

    try {
      // Si tiene 8 dígitos, buscar por DNI exacto
      if (busqueda.length === 8 && /^\d+$/.test(busqueda)) {
        // Buscar en el backend por DNI
        const clienteBackend = await buscarClienteEnBackend(busqueda);
        
        if (clienteBackend && clienteBackend.length > 0) {
          setClienteSeleccionado({
            id_cliente: clienteBackend[0].id_cliente,
            dni: clienteBackend[0].dni,
            nombreCompleto: clienteBackend[0].nombre_completo,
            nombres: clienteBackend[0].nombres,
            apellidoPaterno: clienteBackend[0].apellido_paterno,
            apellidoMaterno: clienteBackend[0].apellido_materno
          });
          return;
        }

        // Si no está en backend, buscar en RENIEC
        const clienteReniec = await buscarClientePorDNI(busqueda);
        alert("⚠️ Cliente encontrado en RENIEC pero no está registrado. Por favor regístrelo primero en la sección 'Clientes'");
        setClienteSeleccionado(null);
        return;
      }

      // Si NO es un DNI de 8 dígitos, buscar por NOMBRE en el backend
      // Hacer una petición al backend para buscar por nombre/apellido
      const response = await axios.get(`http://localhost:8080/api/clientes`);
      const todosLosClientes = response.data;
      
      // Buscar coincidencias por nombre, apellido paterno o apellido materno
      const clienteEncontrado = todosLosClientes.find(c => 
        (c.nombre_completo && c.nombre_completo.toLowerCase().includes(busqueda)) ||
        (c.nombres && c.nombres.toLowerCase().includes(busqueda)) ||
        (c.apellido_paterno && c.apellido_paterno.toLowerCase().includes(busqueda)) ||
        (c.apellido_materno && c.apellido_materno.toLowerCase().includes(busqueda))
      );

      if (clienteEncontrado) {
        setClienteSeleccionado({
          id_cliente: clienteEncontrado.id_cliente,
          dni: clienteEncontrado.dni,
          nombreCompleto: clienteEncontrado.nombre_completo,
          nombres: clienteEncontrado.nombres,
          apellidoPaterno: clienteEncontrado.apellido_paterno,
          apellidoMaterno: clienteEncontrado.apellido_materno
        });
        return;
      }

      // Si no se encontró nada
      alert(` No se encontró ningún cliente con: "${dni}"\n\nIntente con:\n- DNI completo (8 dígitos)\n- Nombre completo\n- Apellido`);
      setClienteSeleccionado(null);

    } catch (err) {
      console.error("Error al buscar cliente:", err);
      alert(" Error al buscar el cliente. Verifique su conexión al servidor.");
      setClienteSeleccionado(null);
    }
  };

  // Buscar empresa por RUC (Backend primero, luego SUNAT con registro automático)
  const buscarEmpresa = async () => {
    if (!ruc || ruc.length !== 11) {
      alert("Ingrese un RUC válido (11 dígitos)");
      return;
    }

    try {
      // PRIMERO: Buscar en el backend local
      try {
        const responseBackend = await axios.get(`http://localhost:8080/api/empresas/ruc/${ruc}`, {
          validateStatus: function (status) {
            // ✅ Considerar 404 como respuesta válida (no lanzar error)
            return status >= 200 && status < 300 || status === 404;
          }
        });
        
        // Si la respuesta es exitosa y tiene datos
        if (responseBackend.status === 200 && responseBackend.data) {
          const empresa = responseBackend.data;
          setEmpresaSeleccionada({
            id_empresa: empresa.id_empresa,
            ruc: empresa.ruc,
            razonSocial: empresa.razon_social,
            direccion: empresa.direccion || '-',
            estado: empresa.estado || 'ACTIVO',
            condicion: empresa.condicion || 'HABIDO',
            departamento: empresa.departamento || '-',
            provincia: empresa.provincia || '-',
            distrito: empresa.distrito || '-',
            ubigeo: empresa.ubigeo || '-'
          });
          alert("✅ Empresa encontrada en el sistema");
          return;
        }
        
        // Si es 404, simplemente continuar con SUNAT (sin error)
        if (responseBackend.status === 404) {
          // Continuar con SUNAT
        }
      } catch (backendError) {
        // Solo mostrar error si es diferente a 404
        console.error("Error inesperado al buscar en backend:", backendError);
        // Continuar con SUNAT de todos modos
      }

      // SEGUNDO: Buscar en SUNAT y registrar automáticamente
      const empresaSUNAT = await buscarEmpresaPorRUC(ruc);

      if (empresaSUNAT) {
        // ✅ REGISTRAR AUTOMÁTICAMENTE en el backend
        try {
          const empresaData = {
            ruc: empresaSUNAT.ruc,
            razon_social: empresaSUNAT.razonSocial,
            direccion: empresaSUNAT.direccion || '-',
            departamento: empresaSUNAT.departamento || '-',
            provincia: empresaSUNAT.provincia || '-',
            distrito: empresaSUNAT.distrito || '-',
            estado: empresaSUNAT.estado || 'ACTIVO',
            condicion: empresaSUNAT.condicion || 'HABIDO'
          };

          const responseRegistro = await axios.post('http://localhost:8080/api/empresas', empresaData);
          
          // Usar la empresa recién registrada (con su id_empresa)
          setEmpresaSeleccionada({
            id_empresa: responseRegistro.data.id_empresa,
            ruc: empresaSUNAT.ruc,
            razonSocial: empresaSUNAT.razonSocial,
            direccion: empresaSUNAT.direccion,
            estado: empresaSUNAT.estado,
            condicion: empresaSUNAT.condicion,
            departamento: empresaSUNAT.departamento || '-',
            provincia: empresaSUNAT.provincia || '-',
            distrito: empresaSUNAT.distrito || '-',
            ubigeo: empresaSUNAT.ubigeo || '-'
          });
          
          alert("✅ Empresa encontrada en SUNAT y registrada automáticamente");
          return; // ✅ IMPORTANTE: Salir aquí si todo fue exitoso
        } catch (errorRegistro) {
          // Si falla el registro (ej: ya existe), intentar buscar nuevamente en backend
          if (errorRegistro.response?.status === 409) {
            // La empresa ya existe, buscarla nuevamente
            const responseBackend = await axios.get(`http://localhost:8080/api/empresas/ruc/${ruc}`);
            if (responseBackend.data) {
              setEmpresaSeleccionada({
                id_empresa: responseBackend.data.id_empresa,
                ruc: responseBackend.data.ruc,
                razonSocial: responseBackend.data.razon_social,
                direccion: responseBackend.data.direccion,
                estado: responseBackend.data.estado,
                condicion: responseBackend.data.condicion,
                departamento: responseBackend.data.departamento || '-',
                provincia: responseBackend.data.provincia || '-',
                distrito: responseBackend.data.distrito || '-',
                ubigeo: responseBackend.data.ubigeo || '-'
              });
              alert("✅ Empresa encontrada en el sistema");
              return; // ✅ IMPORTANTE: Salir aquí si todo fue exitoso
            }
          } else {
            // Error diferente al 409, propagar
            throw errorRegistro;
          }
        }
      } else {
        alert("❌ No se encontraron datos de la empresa en SUNAT");
        setEmpresaSeleccionada(null);
      }
    } catch (err) {
      // Solo manejar errores reales, no los casos de éxito
      console.error("Error al buscar empresa:", err);
      alert(`❌ Error: ${err.message || "No se pudo consultar la empresa"}`);
      setEmpresaSeleccionada(null);
    }
  };

  // Obtener tipo de cambio si es necesario
  const obtenerTipoCambio = async () => {
    // Si ya tenemos el tipo de cambio guardado, retornarlo
    if (tipoCambio) {
      return tipoCambio;
    }

    // Si no tenemos tipo de cambio, obtenerlo de la API
    try {
      const response = await axios.get("https://api.exchangerate.host/convert?from=USD&to=PEN&amount=1");
      const tasaCambio = response.data.result || 3.80;
      setTipoCambio(tasaCambio);
      return tasaCambio;
    } catch (err) {
      console.error("Error al obtener tipo de cambio:", err);
      alert("No se pudo obtener el tipo de cambio. Usando 3.80 por defecto");
      setTipoCambio(3.80);
      return 3.80;
    }
  };

  // Buscar y agregar producto
  const agregarProducto = () => {
    if (!codigoProducto) {
      alert("Ingrese un código de producto");
      return;
    }

    const producto = productos.find(p => 
      String(p.id_producto).toLowerCase().includes(codigoProducto.toLowerCase()) ||
      p.nombre.toLowerCase().includes(codigoProducto.toLowerCase())
    );

    if (!producto) {
      alert("Producto no encontrado");
      return;
    }

    // Verificar stock disponible
    if (producto.cantidad < cantidadProducto) {
      alert(`Stock insuficiente. Solo hay ${producto.cantidad} unidades disponibles`);
      return;
    }

    const existe = productosSeleccionados.find(p => p.id_producto === producto.id_producto);
    if (existe) {
      alert("Este producto ya está agregado. Modifique la cantidad en la tabla.");
      return;
    }

    const productoConCantidad = {
      ...producto,
      cantidadVendida: parseInt(cantidadProducto),
      subtotalProducto: producto.precio * parseInt(cantidadProducto)
    };

    setProductosSeleccionados([...productosSeleccionados, productoConCantidad]);
    setCodigoProducto("");
    setCantidadProducto(1);
  };

  // Eliminar producto de la lista
  const eliminarProducto = (id_producto) => {
    setProductosSeleccionados(productosSeleccionados.filter(p => p.id_producto !== id_producto));
  };

  // Actualizar cantidad
  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    // Verificar stock
    const producto = productos.find(p => p.id_producto === id_producto);
    if (producto && nuevaCantidad > producto.cantidad) {
      alert(`Stock insuficiente. Solo hay ${producto.cantidad} unidades disponibles`);
      return;
    }
    
    setProductosSeleccionados(productosSeleccionados.map(p => 
      p.id_producto === id_producto 
        ? { ...p, cantidadVendida: parseInt(nuevaCantidad), subtotalProducto: p.precio * parseInt(nuevaCantidad) }
        : p
    ));
  };

  // Calcular totales
  const calcularSubtotal = () => {
    return productosSeleccionados.reduce((total, p) => total + p.subtotalProducto, 0);
  };

  const calcularIGV = () => {
    return calcularSubtotal() * 0.18;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIGV();
  };

  // Generar factura y guardar en backend
  const generarFacturaVenta = async () => {
    // Validar que haya cliente o empresa
    if (!clienteSeleccionado && !empresaSeleccionada) {
      alert("Debe seleccionar un cliente o empresa");
      return;
    }

    if (productosSeleccionados.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    // Obtener tipo de cambio si es necesario
    let cambio = 1;
    if (moneda === "USD") {
      cambio = await obtenerTipoCambio();
      
      // Validar que el tipo de cambio sea válido
      if (!cambio || isNaN(cambio)) {
        alert(" Error al obtener el tipo de cambio. Intente nuevamente.");
        return;
      }
    }

    const subtotalMoneda = calcularSubtotal();
    const subtotalSoles = moneda === "USD" ? subtotalMoneda * cambio : subtotalMoneda;
    const igvSoles = subtotalSoles * 0.18;
    const totalSoles = subtotalSoles + igvSoles;

    // Determinar tipo de comprobante
    const tipoComprobante = clienteSeleccionado ? "BOLETA" : "FACTURA";
    
    // Generar número de comprobante
    const numero = generarNumeroComprobante(tipoComprobante);

    // Validar que tenga id_cliente si es boleta
    if (tipoComprobante === "BOLETA" && !clienteSeleccionado?.id_cliente) {
      alert("❌ El cliente debe estar registrado en el sistema");
      return;
    }

    // Validar que tenga id_empresa si es factura
    if (tipoComprobante === "FACTURA" && !empresaSeleccionada?.id_empresa) {
      alert("❌ La empresa debe estar registrada en el sistema.\n\nPor favor, regístrela primero en la sección 'Empresas'");
      return;
    }

    // Crear objeto de factura para el backend
    const facturaData = {
      tipoComprobante,
      numero,
      subtotal: parseFloat(subtotalSoles.toFixed(2)),
      igv: parseFloat(igvSoles.toFixed(2)),
      total: parseFloat(totalSoles.toFixed(2)),
      metodoPago: metodoPago.toUpperCase(),
      moneda: moneda, // "PEN" o "USD"
      tipo_cambio: moneda === "USD" ? parseFloat(cambio.toFixed(2)) : null,
      id_cliente: clienteSeleccionado?.id_cliente || null, // ID del cliente (para BOLETA)
      id_empresa: empresaSeleccionada?.id_empresa || null, // ID de la empresa (para FACTURA)
      productos: productosSeleccionados.map(p => ({
        id_producto: p.id_producto,
        cantidadVendida: p.cantidadVendida,
        precio: p.precio,
        subtotalProducto: p.subtotalProducto
      }))
    };

    try {
      // Guardar en el backend
      const facturaGuardada = await guardarFactura(facturaData);
    
      alert(`✅ ${tipoComprobante} ${numero} registrada exitosamente en la base de datos!`);
      
      // Si hay función del padre (para estado local del frontend)
      if (agregarFactura) {
        const facturaParaFrontend = {
          id: Date.now(),
          fecha: new Date().toLocaleString(),
          tipoComprobante: tipoComprobante,
          cliente: clienteSeleccionado || null,
          empresa: empresaSeleccionada || null,
          productos: productosSeleccionados,
          subtotal: subtotalSoles.toFixed(2),
          igv: igvSoles.toFixed(2),
          total: totalSoles.toFixed(2),
          metodoPago: metodoPago,
          monedaOriginal: moneda,
          tipoCambio: moneda === "USD" ? cambio.toFixed(2) : null,
          moneda: moneda
        };
        agregarFactura(facturaParaFrontend);
      }
      
      // Limpiar formulario
      limpiarFormulario();
    } catch (err) {
      alert(`❌ Error al guardar la venta: ${errorFactura || err.response?.data?.message || err.message}`);
    }
  };

  const limpiarFormulario = () => {
    setTipoCliente("persona");
    setDni("");
    setRuc("");
    setClienteSeleccionado(null);
    setEmpresaSeleccionada(null);
    setCodigoProducto("");
    setCantidadProducto(1);
    setProductosSeleccionados([]);
    setMetodoPago("efectivo");
    setMoneda("PEN");
    setTipoCambio(null);
  };

  return (
    <div className="ventas-container">
      <h2>📝 Registrar Venta</h2>

      {/* Mostrar error si existe */}
      {errorFactura && (
        <div className="error-message" style={{
          background: '#fee', 
          color: '#c00', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px'
        }}>
          ⚠️ {errorFactura}
        </div>
      )}

      {/* Sección 1: Seleccionar tipo y buscar Cliente/Empresa */}
      <div className="seccion-venta">
        <h3>🔍 Buscar Cliente o Empresa</h3>
        
        {/* Radio buttons para seleccionar tipo */}
        <div className="tipo-cliente-selector">
          <label>
            <input
              type="radio"
              value="persona"
              checked={tipoCliente === "persona"}
              onChange={(e) => {
                setTipoCliente(e.target.value);
                setEmpresaSeleccionada(null);
                setClienteSeleccionado(null);
                setRuc("");
                setDni("");
              }}
            />
            👤 Persona Natural (DNI)
          </label>
          <label>
            <input
              type="radio"
              value="empresa"
              checked={tipoCliente === "empresa"}
              onChange={(e) => {
                setTipoCliente(e.target.value);
                setEmpresaSeleccionada(null);
                setClienteSeleccionado(null);
                setRuc("");
                setDni("");
              }}
            />
            🏢 Empresa (RUC)
          </label>
        </div>

        {/* Buscar Persona */}
        {tipoCliente === "persona" && (
          <div className="form-group-inline">
            <input
              type="text"
              placeholder="DNI, nombre o apellido del cliente"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <button onClick={buscarCliente} className="btn-buscar" disabled={loadingCliente}>
              {loadingCliente ? "Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        )}

        {/* Buscar Empresa */}
        {tipoCliente === "empresa" && (
          <div className="form-group-inline">
            <input
              type="text"
              placeholder="Ingrese RUC (11 dígitos)"
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').slice(0, 11))}
              maxLength="11"
            />
            <button onClick={buscarEmpresa} className="btn-buscar" disabled={loadingEmpresa}>
              {loadingEmpresa ? "Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        )}

        {/* Mostrar cliente seleccionado */}
        {clienteSeleccionado && (
          <div className="cliente-seleccionado">
            <p><strong>Cliente:</strong> {clienteSeleccionado.nombreCompleto || `${clienteSeleccionado.nombres} ${clienteSeleccionado.apellidoPaterno}`}</p>
            <p><strong>DNI:</strong> {clienteSeleccionado.dni}</p>
            <p><em>Se generará una BOLETA</em></p>
          </div>
        )}

        {/* Mostrar empresa seleccionada */}
        {empresaSeleccionada && (
          <div className="cliente-seleccionado">
            <p><strong>Empresa:</strong> {empresaSeleccionada.razonSocial}</p>
            <p><strong>RUC:</strong> {empresaSeleccionada.ruc}</p>
            {empresaSeleccionada.direccion && <p><strong>Dirección:</strong> {empresaSeleccionada.direccion}</p>}
            {empresaSeleccionada.estado && <p><strong>Estado:</strong> {empresaSeleccionada.estado}</p>}
            <p><em> NOTA: Para generar FACTURA, la empresa debe estar registrada como cliente en el sistema</em></p>
          </div>
        )}
      </div>

      {/* Sección 2: Buscar y Agregar Producto */}
      <div className="seccion-venta">
        <h3>🔍 Buscar Producto</h3>
        <div className="form-group-inline">
          <input
            type="text"
            placeholder="Código o nombre del producto"
            value={codigoProducto}
            onChange={(e) => setCodigoProducto(e.target.value)}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidadProducto}
            onChange={(e) => setCantidadProducto(e.target.value)}
            min="1"
            className="input-cantidad"
          />
          <button onClick={agregarProducto} className="btn-agregar">
            ➕ Agregar
          </button>
        </div>
      </div>

      {/* Sección 3: Tabla de Productos */}
      {productosSeleccionados.length > 0 && (
        <div className="seccion-venta">
          <h3>🛒 Productos Seleccionados</h3>
          <table className="tabla-productos-venta">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Precio Unit.</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosSeleccionados.map((producto) => (
                <tr key={producto.id_producto}>
                  <td>{producto.id_producto}</td>
                  <td>{producto.nombre}</td>
                  <td>S/ {producto.precio.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={producto.cantidadVendida}
                      onChange={(e) => actualizarCantidad(producto.id_producto, e.target.value)}
                      min="1"
                      max={producto.cantidad}
                      className="input-cantidad-tabla"
                    />
                  </td>
                  <td>S/ {producto.subtotalProducto.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => eliminarProducto(producto.id_producto)} 
                      className="btn-eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sección 4: Totales y Método de Pago */}
      {productosSeleccionados.length > 0 && (
        <div className="seccion-venta">
          <div className="totales-container">
            <div className="totales">
              <div className="fila-total">
                <span>Subtotal:</span>
                <span>S/ {calcularSubtotal().toFixed(2)}</span>
              </div>
              <div className="fila-total">
                <span>IGV (18%):</span>
                <span>S/ {calcularIGV().toFixed(2)}</span>
              </div>
              <div className="fila-total total-final">
                <span>TOTAL:</span>
                <span>S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="metodo-pago">
              <h4>💳 Método de Pago</h4>
              <div className="opciones-pago">
                <label>
                  <input
                    type="radio"
                    value="efectivo"
                    checked={metodoPago === "efectivo"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  💵 Efectivo
                </label>
                <label>
                  <input
                    type="radio"
                    value="tarjeta"
                    checked={metodoPago === "tarjeta"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  💳 Tarjeta
                </label>
              </div>

              <div className="opciones-moneda">
                <label>
                  <input
                    type="radio"
                    value="PEN"
                    checked={moneda === "PEN"}
                    onChange={(e) => {
                      setMoneda(e.target.value);
                      setTipoCambio(null);
                    }}
                  />
                  🇵🇪 Soles (PEN)
                </label>
                <label>
                  <input
                    type="radio"
                    value="USD"
                    checked={moneda === "USD"}
                    onChange={(e) => {
                      setMoneda(e.target.value);
                      obtenerTipoCambio();
                    }}
                  />
                  💵 Dólares (USD)
                </label>
              </div>

              {moneda === "USD" && tipoCambio && (
                <div className="tipo-cambio-info">
                  <p><strong>⚠️ Tipo de cambio:</strong> $1 USD = S/ {tipoCambio.toFixed(2)} PEN</p>
                  <p><em>Los totales se mostrarán en Soles (requerimiento SUNAT)</em></p>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={generarFacturaVenta} 
            className="btn-generar-factura"
            disabled={loadingFactura}
          >
            {loadingFactura 
              ? "⏳ Guardando..." 
              : (clienteSeleccionado 
                  ? "🧾 Generar Boleta" 
                  : "📄 Generar Factura")}
          </button>
        </div>
      )}
    </div>
  );
};

export default VentasForm;