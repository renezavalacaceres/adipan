import React from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@rneui/themed";
import moment from "moment";

const DetalleCompra = ({ route }) => {
  const { compra } = route.params;

  const fechaFormateada = moment(compra.fecha.toDate ? compra.fecha.toDate() : compra.fecha).format("DD/MM/YYYY HH:mm");

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6FA", padding: 10 }}>
      <Card containerStyle={{ borderRadius: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Detalle de Compra</Text>
        <Text style={{ color: "gray", marginTop: 5 }}>Fecha: {fechaFormateada}</Text>
        <Text style={{ color: "gray" }}>Método: {compra.metodoPago}</Text>
        <Text style={{ color: "gray" }}>Estado: {compra.estado}</Text>
      </Card>

      <Text style={{ margin: 10, fontWeight: "bold", fontSize: 16 }}>Productos</Text>
      <FlatList
        data={compra.productos || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card containerStyle={{ borderRadius: 12, marginBottom: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16 }}>{item.nombre}</Text>
              <Text style={{ fontSize: 16 }}>x{item.cantidad}</Text>
            </View>
            <Text style={{ color: "gray" }}>S/ {item.precio?.toFixed(2)}</Text>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "gray" }}>Sin productos en esta compra.</Text>
        }
      />

      <Card containerStyle={{ borderRadius: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "right" }}>
          Total: S/ {compra.total?.toFixed(2)}
        </Text>
      </Card>
    </View>
  );
};

export default DetalleCompra;
