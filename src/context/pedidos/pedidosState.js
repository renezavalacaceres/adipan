import React, { useReducer,useState } from "react";
import PedidosReducer from "./pedidosReducer";
import PedidosContext from "./pedidosContext";

import {
  NUEVA_ORDEN,
  SELECCIONAR_PRODUCTO,
  CONFIRMAR_ORDENAR_INSUMO,
  MOSTRAR_RESUMEN,
  ELIMINAR_PRODUCTO,
  PEDIDO_ORDENADO,
  LIMPIAR_PEDIDO,
  GUARDAR_REGION,
  GUARDAR_FECHA_ENTREGA
} from '../../types';

const PedidosState = (props) => {

  const [userDetails, setUserDetails] = useState(null);

// Función para guardar el usuario en el contexto
const guardarUsuario = (usuario) => setUserDetails(usuario);

  // 🔹 Estado inicial con region y fechaEntrega incluidos
  const initialState = {
    pedido: [],
    insumo: null,
    total: 0,
    idpedido: '',
    region: 'default',   // antes no estaba
    fechaEntrega: null,  // antes no estaba
    userDetails: null  // antes no estaba
  };

  const [state, dispatch] = useReducer(PedidosReducer, initialState);

  // ---------------- Funciones para manejar el estado ----------------
  const seleccionarInsumo = (insumo) => {
    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: insumo,
    });
  };

  const guardarPedido = (pedido) => {
    dispatch({
      type: CONFIRMAR_ORDENAR_INSUMO,
      payload: pedido,
    });
  };

  const mostrarResumen = (total) => {
    dispatch({
      type: MOSTRAR_RESUMEN,
      payload: total,
    });
  };

  const eliminarProducto = (id) => {
    dispatch({
      type: ELIMINAR_PRODUCTO,
      payload: id,
    });
  };

  const pedidoRealizado = (id) => {
    dispatch({
      type: PEDIDO_ORDENADO,
      payload: id,
    });
  };

  const limpiarPedido = () => {
    dispatch({
      type: LIMPIAR_PEDIDO,
    });
  };

  const guardarRegion = (regionSeleccionada) => {
    dispatch({
      type: GUARDAR_REGION,
      payload: regionSeleccionada,
    });
  };

  const guardarFechaEntrega = (fecha) => {
    dispatch({
      type: GUARDAR_FECHA_ENTREGA,
      payload: fecha,
    });
  };

  // ---------------- Provider ----------------
  return (
    <PedidosContext.Provider
      value={{
        pedido: state.pedido,
        insumo: state.insumo,
        total: state.total,
        idpedido: state.idpedido,
        region: state.region,
        fechaEntrega: state.fechaEntrega,
        seleccionarInsumo,
        guardarPedido,
        mostrarResumen,
        eliminarProducto,
        pedidoRealizado,
        limpiarPedido,
        guardarRegion,
        guardarFechaEntrega,
        guardarUsuario,
        userDetails: state.userDetails, // Asegúrate de manejar userDetails en alguna parte
      }}
    >
      {props.children}
    </PedidosContext.Provider>
  );
};

export default PedidosState;


