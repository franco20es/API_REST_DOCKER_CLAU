import React, { useState } from "react";
import "./FacturaList.css";

const FacturaList = ({ facturas, datosEmpresa }) => {
  const [facturaExpandida, setFacturaExpandida] = useState(null);

  const empresa = datosEmpresa || {
    ruc: "20543827402",
    razonSocial: "TU EMPRESA S.A.C.",
    direccion: "Av. Principal 123, Lima - Perú",
    telefono: "(01) 234-5678",
    email: "ventas@tuempresa.com"
  };

  if (!facturas || facturas.length === 0) {
    return (
      <div className="facturas-list">
        <h2>Comprobantes Electrónicos</h2>
        <p className="sin-facturas">No hay comprobantes registrados</p>
      </div>
    );
  }

  const toggleFactura = (id) => {
    setFacturaExpandida(facturaExpandida === id ? null : id);
  };

  const generarNumeroComprobante = (id, tipo) => {
    const serie = tipo === "BOLETA" ? "B001" : "F001";
    const numero = String(id).padStart(8, "0");
    return `${serie}-${numero}`;
  };

  return (
    <div className="facturas-list">
      <h2>Comprobantes Electrónicos ({facturas.length})</h2>

      <div className="facturas-container">
        {facturas.map((factura) => {
          const tipoComprobante = factura.tipoComprobante || "FACTURA";
          const numeroComprobante = generarNumeroComprobante(factura.id, tipoComprobante);
          const esFactura = tipoComprobante === "FACTURA";

          return (
            <div key={factura.id} className={`factura-card comprobante-${tipoComprobante.toLowerCase()}`}>

              {/* Vista previa */}
              <div className="factura-preview" onClick={() => toggleFactura(factura.id)}>
                <div className="preview-left">
                  <span className={`badge-comprobante ${tipoComprobante.toLowerCase()}`}>
                    {tipoComprobante}
                  </span>
                  <span className="numero-comprobante">{numeroComprobante}</span>
                </div>

                <div className="preview-right">
                  <span className="cliente-nombre">
                    {esFactura
                      ? (factura.empresa?.razonSocial || "Empresa")
                      : (factura.cliente?.nombreCompleto ||
                        `${factura.cliente?.nombres || ""} ${factura.cliente?.apellidoPaterno || ""}`.trim() ||
                        "Cliente")}
                  </span>
                  <span className="comprobante-total">S/ {factura.total}</span>
                </div>

                <button className="btn-expandir-comprobante">
                  {facturaExpandida === factura.id ? "" : ""}
                </button>
              </div>

              {/* Comprobante expandido */}
              {facturaExpandida === factura.id && (
                <div className="comprobante-completo">

                  {/* Encabezado */}
                  <div className="comprobante-header">
                    <div className="empresa-info">
                      <h3>{empresa.razonSocial}</h3>
                      <p><strong>RUC:</strong> {empresa.ruc}</p>
                      <p>{empresa.direccion}</p>
                      <p><strong>Tel:</strong> {empresa.telefono}</p>
                      <p><strong>Email:</strong> {empresa.email}</p>
                    </div>

                    <div className="comprobante-tipo-box">
                      <h2 className={`tipo-titulo ${tipoComprobante.toLowerCase()}`}>
                        {tipoComprobante} DE VENTA
                      </h2>
                      <p className="comprobante-serie">ELECTRÓNICA</p>
                      <p className="comprobante-numero">{numeroComprobante}</p>
                    </div>
                  </div>

                  <hr className="separador-comprobante" />

                  {/* Datos cliente */}
                  <div className="cliente-datos">
                    <h4>DATOS DEL {esFactura ? "CLIENTE" : "ADQUIRIENTE"}</h4>

                    {esFactura ? (
                      <>
                        <p><strong>RUC:</strong> {factura.empresa?.ruc || "N/A"}</p>
                        <p><strong>Razón Social:</strong> {factura.empresa?.razonSocial || "N/A"}</p>
                        <p><strong>Dirección:</strong> {factura.empresa?.direccion || "N/A"}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>DNI:</strong> {factura.cliente?.dni || "N/A"}</p>
                        <p><strong>Nombre:</strong> {factura.cliente?.nombreCompleto ||
                          `${factura.cliente?.nombres || ""} ${factura.cliente?.apellidoPaterno || ""}`.trim() ||
                          "No especificado"}</p>
                        <p><strong>Dirección:</strong> {factura.cliente?.direccion || "Lima - Perú"}</p>
                      </>
                    )}

                    <p><strong>Fecha de Emisión:</strong> {factura.fecha}</p>
                    <p><strong>Moneda:</strong> {factura.moneda === "USD" ? "DÓLARES AMERICANOS" : "SOLES"}</p>
                  </div>

                  <hr className="separador-comprobante" />

                  {/* Productos */}
                  <div className="productos-seccion">
                    <h4>DETALLE DE LA VENTA</h4>

                    <table className="tabla-comprobante">
                      <thead>
                        <tr>
                          <th>CANT.</th>
                          <th>DESCRIPCIÓN</th>
                          <th>P/U</th>
                          <th>IMPORTE</th>
                        </tr>
                      </thead>

                      <tbody>
                        {factura.productos?.map((producto, idx) => (
                          <tr key={idx}>
                            <td className="text-center">
                              {producto.cantidadVendida || producto.cantidad}
                            </td>
                            <td>{producto.nombre}</td>
                            <td className="text-right">
                              {factura.moneda || "S/"} {producto.precio?.toFixed(2) || "0.00"}
                            </td>
                            <td className="text-right">
                              {factura.moneda || "S/"} {(
                                producto.subtotalProducto ||
                                (producto.precio || 0) *
                                (producto.cantidadVendida || producto.cantidad || 0)
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <hr className="separador-comprobante" />

                  {/* Totales */}
                  <div className="totales-comprobante">
                    <div className="totales-izquierda">
                      <p><strong>Método de Pago:</strong> {factura.metodoPago}</p>
                      {factura.tipoCambio && (
                        <p><strong>Tipo de Cambio:</strong> S/ {factura.tipoCambio}</p>
                      )}
                    </div>

                    <div className="totales-derecha">
                      <div className="fila-total">
                        <span>OP. GRAVADA:</span>
                        <span>{factura.moneda || "S/"} {factura.subtotal}</span>
                      </div>
                      <div className="fila-total">
                        <span>IGV (18%):</span>
                        <span>{factura.moneda || "S/"} {factura.igv}</span>
                      </div>
                      <div className="fila-total total-grande">
                        <span>IMPORTE TOTAL:</span>
                        <span>{factura.moneda || "S/"} {factura.total}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="separador-comprobante" />

                  {/* Pie */}
                  <div className="comprobante-footer">
                    <p className="texto-legal">
                      Representación impresa del {tipoComprobante} Electrónico <br />
                      Verifique este documento en www.sunat.gob.pe <br />
                    </p>

                    <div className="hash-comprobante">
                      <small>Hash: {`${factura.id}-${tipoComprobante}`}</small>
                    </div>
                  </div>

                  <div className="acciones-comprobante">
                    <button
                      className="btn-imprimir"
                      onClick={() => window.print()}
                    >
                      Imprimir {tipoComprobante}
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacturaList;
