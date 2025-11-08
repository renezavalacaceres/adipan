import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'native-base';
import { format } from 'date-fns';

const TicketResumen = ({
  pedido,
  total,
  userDetails,
  formaPago,
  tipoCompra,
  cuotas = 4,
  incrementoCredito = 2,
  fechaPedido,
  nroPedido = '0001',
}) => {
  return (
    <ScrollView style={{ padding: 10, backgroundColor: '#FFF' }}>
      {/* Encabezado */}
      <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
        ADIPAN
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 12 }}>Boleta de Pedido</Text>
      <Text style={{ textAlign: 'center', fontSize: 10 }}>Pedido N°: {nroPedido}</Text>
      <Text style={{ textAlign: 'center', fontSize: 10 }}>
        Fecha emisión: {format(new Date(), 'dd/MM/yyyy HH:mm')}
      </Text>

      <View style={{ marginVertical: 10, borderBottomWidth: 1, borderColor: '#000' }} />

      {/* Cliente */}
      <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
        Cliente: {userDetails?.name}
      </Text>
      <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
        Documento: {userDetails?.dni || userDetails?.ruc}
      </Text>
      <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
        Email: {userDetails?.email}
      </Text>

      <View style={{ marginVertical: 5, borderBottomWidth: 1, borderColor: '#000' }} />

      {/* Productos */}
      {pedido.map((item, index) => {
        const precioUnitario =
          tipoCompra === 'credito' ? item.precio + incrementoCredito : item.precio;
        return (
          <View key={item.id + index} style={{ marginBottom: 5 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
              {item.nombre}
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
              Cant: {item.cantidad}  P.U: S/ {precioUnitario}  Total: S/ {precioUnitario * item.cantidad}
            </Text>
          </View>
        );
      })}

      <View style={{ marginVertical: 5, borderBottomWidth: 1, borderColor: '#000' }} />

      {/* Totales */}
      <Text style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' }}>
        TOTAL A PAGAR: S/ {total}
      </Text>
      <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
        Forma de pago: {formaPago}
      </Text>
      <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
        Tipo de compra: {tipoCompra === 'credito' ? `Crédito en ${cuotas} cuotas` : 'Contado'}
      </Text>
      {tipoCompra === 'credito' && (
        <Text style={{ fontFamily: 'monospace', fontSize: 12, color: 'orange' }}>
          Cada producto +S/ {incrementoCredito}, total dividido en {cuotas} cuotas
        </Text>
      )}

      <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
        Fecha de entrega: {fechaPedido ? format(new Date(fechaPedido), 'dd/MM/yyyy HH:mm') : 'No disponible'}
      </Text>

      <View style={{ marginVertical: 10, borderBottomWidth: 1, borderColor: '#000' }} />

      {/* Pie del ticket */}
      <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 5 }}>
        ¡Gracias por su compra!
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 10 }}>
        GRUPO ADIPAN
      </Text>
    </ScrollView>
  );
};

export default TicketResumen;
