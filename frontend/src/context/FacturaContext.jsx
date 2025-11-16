import React, { createContext, useReducer, useEffect } from 'react';

// Estado inicial
const initialState = {
  facturas: [],
  clientes: [],
  tipoCambio: 3.70, 
  loading: false,
  error: null
};

// Tipos de acciones
export const ACTIONS = {
  ADD_FACTURA: 'ADD_FACTURA',
  UPDATE_FACTURA: 'UPDATE_FACTURA',
  DELETE_FACTURA: 'DELETE_FACTURA',
  SET_FACTURAS: 'SET_FACTURAS',
  ADD_CLIENTE: 'ADD_CLIENTE',
  SET_TIPO_CAMBIO: 'SET_TIPO_CAMBIO',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer principal
const facturaReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_FACTURA:
      return {
        ...state,
        facturas: [...state.facturas, { ...action.payload, id: Date.now() }]
      };

    case ACTIONS.UPDATE_FACTURA:
      return {
        ...state,
        facturas: state.facturas.map((f) =>
          f.id === action.payload.id ? action.payload : f
        )
      };

    case ACTIONS.DELETE_FACTURA:
      return {
        ...state,
        facturas: state.facturas.filter((f) => f.id !== action.payload)
      };

    case ACTIONS.SET_FACTURAS:
      return {
        ...state,
        facturas: action.payload
      };

    case ACTIONS.ADD_CLIENTE:
      return {
        ...state,
        clientes: [...state.clientes, action.payload]
      };

    case ACTIONS.SET_TIPO_CAMBIO:
      return {
        ...state,
        tipoCambio: action.payload
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};

// Crear contexto
export const FacturaContext = createContext();

// Provider
export const FacturaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(facturaReducer, initialState);

  // Cargar facturas desde localStorage
  useEffect(() => {
    const facturasGuardadas = localStorage.getItem('facturas');
    if (facturasGuardadas) {
      dispatch({
        type: ACTIONS.SET_FACTURAS,
        payload: JSON.parse(facturasGuardadas)
      });
    }
  }, []);

  // Guardar facturas en localStorage
  useEffect(() => {
    localStorage.setItem('facturas', JSON.stringify(state.facturas));
  }, [state.facturas]);

  // Obtener tipo de cambio (desactivado si falla la API)
  useEffect(() => {
    const obtenerTipoCambio = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();

        if (data?.rates?.PEN) {
          dispatch({
            type: ACTIONS.SET_TIPO_CAMBIO,
            payload: data.rates.PEN
          });
        }
      } catch (error) {
        console.error('No se pudo obtener el tipo de cambio. Se mantiene el valor por defecto.');
      }
    };

    obtenerTipoCambio();

    const interval = setInterval(obtenerTipoCambio, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    state,
    dispatch,
    agregarFactura: (factura) =>
      dispatch({ type: ACTIONS.ADD_FACTURA, payload: factura }),
    actualizarFactura: (factura) =>
      dispatch({ type: ACTIONS.UPDATE_FACTURA, payload: factura }),
    eliminarFactura: (id) =>
      dispatch({ type: ACTIONS.DELETE_FACTURA, payload: id }),
    agregarCliente: (cliente) =>
      dispatch({ type: ACTIONS.ADD_CLIENTE, payload: cliente })
  };

  return (
    <FacturaContext.Provider value={value}>
      {children}
    </FacturaContext.Provider>
  );
};
