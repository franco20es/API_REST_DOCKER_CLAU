import React, { useState } from "react";
import axios from "axios";

const FacturaForm = ({ agregarFactura }) => {
  const [ruc, setRuc] = useState("");
  const [empresa, setEmpresa] = useState(null);
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState("PEN");
  const [factura, setFactura] = useState(null);
  
  const URL="https://api.perudevs.com/api/v1/ruc?document=NUMERO_RUC&key=TU_TOKEN";
  const TOKEN="cGVydWRldnMucHJvZHVjdGlvbi5maXRjb2RlcnMuNjhmMTkzNTcyZGZhMTIyNjA3ZTgzZTk5";
  const buscarEmpresa = async () => {
    try {
      const res = await axios.get(
        `${URL}${ruc}&token=${TOKEN}`
      );
      setEmpresa(res.data);
    } catch (err) {
      alert("Empresa no encontrada");
    }
  };

  const calcularFactura = async () => {
    let montoFinal = parseFloat(monto);
    if (moneda === "USD") {
      const cambio = await axios.get(
        "https://api.exchangerate.host/convert?from=USD&to=PEN"
      );
      montoFinal = montoFinal * cambio.data.result;
    }

    const igv = montoFinal * 0.18;
    const total = montoFinal + igv;

    const nuevaFactura = {
      empresa: empresa?.razonSocial || "Sin empresa",
      monto: montoFinal.toFixed(2),
      igv: igv.toFixed(2),
      total: total.toFixed(2),
      moneda: "PEN",
    };

    setFactura(nuevaFactura);
    agregarFactura(nuevaFactura);
  };

  return (
    <div className="form-card">
      <h2>Registrar Factura</h2>

      <input
        type="text"
        placeholder="RUC Empresa"
        value={ruc}
        onChange={(e) => setRuc(e.target.value)}
      />
      <button onClick={buscarEmpresa}>Buscar Empresa (SUNAT)</button>

      {empresa && <p><b>Razón Social:</b> {empresa.razonSocial}</p>}

      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <select value={moneda} onChange={(e) => setMoneda(e.target.value)}>
        <option value="PEN">Soles</option>
        <option value="USD">Dólares</option>
      </select>

      <button onClick={calcularFactura}>Generar Factura</button>

      {factura && (
        <div className="factura-resumen">
          <p><b>Empresa:</b> {factura.empresa}</p>
          <p><b>Monto:</b> S/ {factura.monto}</p>
          <p><b>IGV (18%):</b> S/ {factura.igv}</p>
          <p><b>Total:</b> S/ {factura.total}</p>
        </div>
      )}
    </div>
  );
};

export default FacturaForm;
