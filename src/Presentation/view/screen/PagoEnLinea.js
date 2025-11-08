import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { VStack, Button } from "native-base";
import FirebaseService from "../../../firebase";
import COLORS from "../../const/colors";
import Loader from "../../component/Loader";

const PagoEnLinea = ({ route, navigation }) => {
  const { idUsuario } = route.params;
  const [pedidos, setPedidos] = useState([]);
  const [cuotasPorPedido, setCuotasPorPedido] = useState({});
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const unsubscribeVentas = FirebaseService.db
      .collection("ventas_realizadas")
      .where("idUsuario", "==", idUsuario)
      .where("tipoCompra", "in", ["Contado", "Crédito"])
      .orderBy("fechaEntrega", "desc")
      .limit(3) // máximo 3 pedidos pendientes
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          setPedidos([]);
          setCuotasPorPedido({});
          setLoading(false);
          return;
        }

        const docsPendientes = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((d) => d.estado !== "Pagado"); // solo pedidos pendientes

        setPedidos(docsPendientes);

        docsPendientes.forEach((pedido) => {
          const unsubscribePagos = FirebaseService.db
            .collection("pagos")
            .where("pedidoId", "==", pedido.id)
            .where("idUsuario", "==", idUsuario)
            .orderBy("fechaPago", "desc")
            .limit(50)
            .onSnapshot((pagosSnap) => {
              const pagos = pagosSnap.docs.map((d) => d.data());
              let cuotasPreparadas = [];

              if ((pedido.tipoCompra || "").toLowerCase() === "contado") {
                const pago = pagos[0] || {};
                cuotasPreparadas = [
                  {
                    numeroCuota: 1,
                    pagada: pago.pagado || pedido.pagado || false,
                    comprobanteUrl: pago.comprobanteUrl || pedido.comprobanteUrl || null,
                    montoPagado: pago.montoPagado || pedido.total || 0,
                    fechaPago: pago.fechaPago
                      ? (pago.fechaPago.toDate ? pago.fechaPago.toDate() : new Date(pago.fechaPago))
                      : null,
                  },
                ];
              } else {
                cuotasPreparadas = (pedido.cuotas || []).map((cuota) => {
                  const pagoRelacionado = pagos.find(
                    (p) => p.numeroCuota === cuota.numeroCuota
                  );
                  return {
                    ...cuota,
                    pagada: pagoRelacionado?.pagado || cuota.pagada || false,
                    comprobanteUrl:
                      pagoRelacionado?.comprobanteUrl || cuota.comprobanteUrl || null,
                    montoPagado: pagoRelacionado?.montoPagado || 0,
                    fechaPago: pagoRelacionado?.fechaPago
                      ? (pagoRelacionado.fechaPago.toDate
                          ? pagoRelacionado.fechaPago.toDate()
                          : new Date(pagoRelacionado.fechaPago))
                      : null,
                  };
                });
              }

              setCuotasPorPedido((prev) => ({ ...prev, [pedido.id]: cuotasPreparadas }));
              setLoading(false);
            });

          return () => unsubscribePagos();
        });
      });

    return () => unsubscribeVentas();
  }, [idUsuario]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader visible={true} />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.light }}>
      {pedidos.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            🎉✅ Todos tus pedidos están pagados.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const cuotas = cuotasPorPedido[item.id] || [];
            return (
              <View
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#eee",
                  borderRadius: 12,
                  marginBottom: 16,
                  backgroundColor: "#fefcfb",
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#0C2434", marginBottom: 4 }}>
                  Pedido Nº {item.numeroPedido || "—"}
                </Text>
                <Text style={{ color: "#333" }}>Monto total: S/ {Number(item.total).toFixed(2)}</Text>

                {cuotas.map((cuota, index) => (
                  <View
                    key={index}
                    style={{
                      marginTop: 10,
                      backgroundColor: cuota.pagada ? "#E6F4EA" : "#FFF4E5",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#0C2434" }}>
                      {item.tipoCompra === "Contado" ? "Total a pagar" : `Cuota ${cuota.numeroCuota}`}: S/{" "}
                      {cuota.montoPagado || cuota.monto}
                    </Text>
                    {cuota.fechaPago && (
                      <Text>📅 Fecha de pago: {cuota.fechaPago.toLocaleDateString()}</Text>
                    )}
                    <Text style={{ color: cuota.pagada ? "green" : "#FF8000" }}>
                      Estado: {cuota.pagada ? "✅ Pagada" : "Pendiente"}
                    </Text>
                    {cuota.comprobanteUrl && (
                      <Image
                        source={{ uri: cuota.comprobanteUrl }}
                        style={{
                          width: 140,
                          height: 140,
                          marginTop: 6,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#ccc",
                          alignSelf: "center",
                        }}
                      />
                    )}

                    {!cuota.pagada && (
                      <VStack style={{ marginTop: 8 }}>
                        <Button
                          h={10}
                          fontWeight={"bold"}
                          bg={COLORS.orangeLight}
                          onPress={() => {
                            const esContado = item.tipoCompra === "Contado";
                            const montoFinal = esContado ? item.total : cuota.monto;
                            const numeroCuota = esContado ? 1 : cuota.numeroCuota;

                            navigation.navigate("MercadoPago", {
                              pedidoId: item.id,
                              cuotaNumero: numeroCuota,
                              monto: montoFinal,
                              tipoCompra: item.tipoCompra,
                              idUsuario,
                            });
                          }}
                        >
                          {item.tipoCompra === "Contado" ? "Pagar total" : `Pagar cuota ${cuota.numeroCuota}`}
                        </Button>
                      </VStack>
                    )}
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default PagoEnLinea;



