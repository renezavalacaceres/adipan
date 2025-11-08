import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { GetUserUseCase } from "../../Domain/useCases/userLocal/GetUserLocal";
import firebase from "../../firebase";
import COLORS from "../const/colors";

const ComprasRealizadas = () => {
  const [compras, setCompras] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectorValue, setSelectorValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await GetUserUseCase();
        if (!userDetails?.id) {
          setLoading(false);
          return;
        }

        // Escuchar pedidos pendientes en tiempo real
        const unsubscribeCompras = firebase.db
  .collection("ventas_realizadas")
  .where("idUsuario", "==", userDetails.id)
  .orderBy("fechaEntrega", "desc")
  .onSnapshot((snapshot) => {
    const comprasData = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((c) => c.estado !== "Pagado"); // filtrar JS
    setCompras(comprasData.slice(0, 3)); // máximo 3 pedidos
    setLoading(false);
  });


        // Escuchar todos los pagos del usuario
        const unsubscribePagos = firebase.db
          .collection("pagos")
          .where("idUsuario", "==", userDetails.id)
          .orderBy("fechaPago", "desc")
          .onSnapshot((snapshot) => {
            const pagosData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMovimientos(pagosData);
          });

        return () => {
          unsubscribeCompras();
          unsubscribePagos();
        };
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const abrirDetalle = (detalle) => {
    setDetalleSeleccionado(detalle);
    setDetalleVisible(true);
  };

  const cerrarDetalle = () => {
    setDetalleVisible(false);
    setDetalleSeleccionado([]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", margin: 10, color: COLORS.marron }}>
        Pedidos Pendientes
      </Text>

      {compras.length === 0 ? (
        <Text style={{ textAlign: "center", color: "gray", margin: 10 }}>
          ✅🎉 Todos tus pedidos están pagados.
        </Text>

      ) : (
        compras.map((pedido) => (
          <View
            key={pedido.id}
            style={{
              backgroundColor: COLORS.light,
              marginHorizontal: 10,
              padding: 15,
              borderRadius: 10,
              elevation: 2,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#0C2434", marginBottom: 4 }}>
              Pedido Nº {pedido.numeroPedido || "—"}
            </Text>
            <Text>💳 Tipo de compra: {pedido.tipoCompra}</Text>
            <Text>📅 Fecha entrega: {pedido.fechaEntrega}</Text>
            <Text>💰 Total: S/ {pedido.total}</Text>
            <Text>📦 Estado: {pedido.estado}</Text>

            <TouchableOpacity
              style={{
                backgroundColor: COLORS.orange,
                marginTop: 10,
                padding: 8,
                borderRadius: 8,
              }}
              onPress={() => abrirDetalle(pedido.detalle)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Ver Detalle</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* ================= MODAL DETALLE ================= */}
      <Modal visible={detalleVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "90%",
              borderRadius: 10,
              padding: 15,
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Detalle de Compra
            </Text>

            {detalleSeleccionado.length === 0 ? (
              <Text>No hay productos en este pedido.</Text>
            ) : (
              detalleSeleccionado.map((p, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                    paddingVertical: 5,
                  }}
                >
                  <Text>🧁 {p.nombre}</Text>
                  <Text>Cantidad: {p.cantidad}</Text>
                  <Text>Precio: S/ {p.precio}</Text>
                  <Text>Total: S/ {p.total}</Text>
                  <Text>Unidad: {p.unidadMedida}</Text>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={cerrarDetalle}
              style={{
                backgroundColor: "#0C2434",
                marginTop: 15,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MOVIMIENTOS PERMANENTE ================= */}
      <View style={{ marginHorizontal: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6, color: COLORS.marron }}>
          Movimientos de pagos
        </Text>

        <DropDownPicker
          open={open}
          value={selectorValue}
          items={movimientos
            .slice(0, 50)
            .map((mov) => ({
              label: (
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={{ flex: 1, fontWeight: "bold", color: "#0C2434" }}>
                    {mov.tipoCompra === "contado" ? "💰 Contado" : "💳 Crédito"}
                    {mov.numeroCuota ? ` — Cuota Nº${mov.numeroCuota}` : ""}
                  </Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: "bold", color: COLORS.orange }}>
                      S/ {mov.montoPagado}
                    </Text>
                    <Text style={{ fontSize: 12, color: "gray" }}>
                      {mov.fechaPago?.toDate
                        ? mov.fechaPago.toDate().toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : new Date(mov.fechaPago).toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                    </Text>
                  </View>
                </View>
              ),
              value: mov.id,
            }))}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback(selectorValue);
            if (newValue === selectorValue) setSelectorValue(null);
            else setSelectorValue(newValue);
          }}
          placeholder="Ver movimientos de pagos"
          style={{ borderColor: COLORS.orangeLight }}
          dropDownContainerStyle={{
            maxHeight: 300,
            zIndex: 3000,
            elevation: 3,
          }}
        />
      </View>
    </View>
  );
};

export default ComprasRealizadas;
























