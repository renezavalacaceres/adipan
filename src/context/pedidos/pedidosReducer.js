import {
  SELECCIONAR_PRODUCTO,
  CONFIRMAR_ORDENAR_INSUMO,
  MOSTRAR_RESUMEN,
  ELIMINAR_PRODUCTO,
  PEDIDO_ORDENADO,
  LIMPIAR_PEDIDO,
  GUARDAR_REGION,
  GUARDAR_FECHA_ENTREGA
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        insumo: action.payload,
      };

    case CONFIRMAR_ORDENAR_INSUMO:
      return {
        ...state,
        pedido: [...state.pedido, action.payload],
      };

    case MOSTRAR_RESUMEN:
      return {
        ...state,
        total: action.payload,
      };

    case ELIMINAR_PRODUCTO:
      return {
        ...state,
        pedido: state.pedido.filter(
          (articulo) => articulo.id !== action.payload
        ),
      };

    case PEDIDO_ORDENADO:
      return {
        ...state,
        idpedido: action.payload,
      };

    case LIMPIAR_PEDIDO:
      return {
        ...state,
        pedido: [],
        total: 0,
      };
    case GUARDAR_REGION:
      return {
        ...state,
        region: action.payload,
      };
    case GUARDAR_FECHA_ENTREGA:
      return {
        ...state,
        fechaEntrega: action.payload,
      };

    default:
      return state;
  }
};

