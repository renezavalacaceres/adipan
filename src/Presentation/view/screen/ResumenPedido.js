import React, { useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  ScrollView,
  HStack,
  VStack,
  Image,
  Text,
  Button,
  Divider,
  Spacer,
} from "native-base";
import PedidoContext from "../../../../src/context/pedidos/pedidosContext";
import COLORS from "../../const/colors";
import FirebaseService from "../../../firebase";
import axios from "axios";
import Loader from "../../component/Loader";

// ⚙️ Cambia esta URL por la de tu backend real
const API_URL = "https://tu-servidor.com/api";

const ResumenPedido = ({ navigation }) => {
  const {
    pedido,
    total,
    mostrarResumen,
    eliminarProducto,
    fechaEntrega,
    region,
    limpiarPedido,
  } = useContext(PedidoContext);

  const [userDetails, setUserDetails] = useState(null);
  const [isSelected, setSelection] = useState(false);
  const [totalFinal, setTotalFinal] = useState(total);
  const [incrementoCredito, setIncrementoCredito] = useState(0);
  const [loading, setLoading] = useState(false);
  // 🔹 Obtener el último número de pedido y generar el siguiente
  const [nuevoNumero, setNuevoNumero] = useState(null);

useEffect(() => {
  const obtenerNumeroPedido = async () => {
    try {
      const pedidosRef = FirebaseService.db.collection("pedidos");
      const snapshot = await pedidosRef.orderBy("numeroPedido", "desc").limit(1).get();
      const ultimoNumero = snapshot.empty ? 0 : snapshot.docs[0].data().numeroPedido || 0;
      setNuevoNumero(ultimoNumero + 1);
    } catch (error) {
      console.error("Error al obtener número de pedido:", error);
    }
  };

  obtenerNumeroPedido();
}, []);



  // 🔹 Cargar usuario desde AsyncStorage y luego refrescar desde backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (!stored) return;
        const userObj = JSON.parse(stored);

        const response = await axios.get(`${API_URL}/user/${userObj.id}`);
        if (response.data.success) {
          const updatedUser = response.data.data;
          setUserDetails(updatedUser);
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("✅ Usuario actualizado desde backend:", updatedUser);
        } else {
          setUserDetails(userObj);
          console.warn("⚠️ No se pudo actualizar usuario desde backend, usando cache local.");
        }
      } catch (error) {
        console.error("❌ Error al obtener usuario actualizado:", error);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Recalcular total al cambiar pedido
  useEffect(() => {
    const nuevoTotal = pedido.reduce((acc, articulo) => acc + articulo.total, 0);
    mostrarResumen(nuevoTotal);
  }, [pedido]);

  // 🔹 Calcular incremento si es crédito
  useEffect(() => {
    let nuevoTotal = total;
    let incremento = 0;

    if (isSelected) {
      incremento = pedido.reduce((acc, item) => acc + item.cantidad * 2, 0);
      nuevoTotal += incremento;
    }

    setIncrementoCredito(incremento);
    setTotalFinal(nuevoTotal);
  }, [isSelected, total, pedido]);

  const confirmarEliminar = (id) => {
    Alert.alert(
      "¿Deseas eliminar este artículo?",
      "Una vez eliminado no se puede recuperar",
      [
        { text: "Confirmar", onPress: () => eliminarProducto?.(id) },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const progresoPedido = () => {
  if (!userDetails) {
    Alert.alert("Espera un momento", "Cargando datos del usuario. Intenta nuevamente en unos segundos.");
    return;
  }

  setTimeout(() => {
    Alert.alert(
      "Revisa tu pedido",
      "Una vez que realizas tu pedido, no podrás cambiarlo",
      [
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              setLoading(true);
              const tipoSeleccionado = isSelected ? "Crédito" : "Contado";

              const numeroPedido = nuevoNumero || Date.now();

              const pedidoObj = {
                numeroPedido,
                idUsuario: userDetails.id, // ✅ ya no fallará porque lo validamos
                usuario: userDetails.name || "Cliente",
                direccion: userDetails.direccion || "No especificada",
                fechaEntrega: fechaEntrega ? fechaEntrega.toISOString() : "No seleccionada",
                tipoCompra: tipoSeleccionado,
                region: region || "Sin región",
                total: totalFinal,
                detalle: pedido.map((item) => ({
                  id: item.id,
                  nombre: item.nombre,
                  unidadMedida: item.unidadMedida || "Sin unidad de medida",
                  precio: item.precio,
                  cantidad: item.cantidad,
                  total: item.total,
                })),
                creado: new Date().toISOString(),
                completado: false,
                tiempoentrega: 30,
              };

              const pedidoRef = await FirebaseService.db.collection("pedidos").add(pedidoObj);
              const pedidoId = pedidoRef.id;

              if (tipoSeleccionado === "Crédito") {
                const cuotas = [];
                const montoCuota = parseFloat((totalFinal / 4).toFixed(2));
                const hoy = new Date();
                for (let i = 1; i <= 4; i++) {
                  const fechaVencimiento = new Date(hoy);
                  fechaVencimiento.setDate(hoy.getDate() + i * 7);
                  cuotas.push({
                    numeroCuota: i,
                    monto: montoCuota,
                    fechaVencimiento: fechaVencimiento.toLocaleDateString(),
                    pagado: false,
                  });
                }
                await FirebaseService.db.collection("pedidos").doc(pedidoId).update({ cuotas });
                
                limpiarPedido();
              }
              

              navigation.navigate("ProgresoPedido", { pedidoId });
            } catch (error) {
              console.error("❌ Error al registrar pedido:", error);
              Alert.alert("Error", "No se pudo registrar el pedido.");
            } finally {
              setLoading(false);
            }
          },
        },
        { text: "Revisar", style: "cancel" },
      ]
    );
  }, 100);
};



return (
    <Box flex={1} bg="white">
      <Loader visible={loading} />
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <Text fontSize="2xl" bold mb={4} color={COLORS.orangeLight} alignSelf="center">
          Resumen Pedido
        </Text>

        {/* Fecha de entrega */}
        <Box mb={4} p={3} borderWidth={1} borderColor="gray.200" borderRadius="md" bg={COLORS.light}>
          <Text fontSize="md" bold color={COLORS.azul}>
            Fecha de entrega:
          </Text>
          <Text bold>{fechaEntrega ? fechaEntrega.toLocaleDateString() : "No seleccionada"}</Text>
        </Box>

        {/* Total a pagar */}
        <Box mb={4} p={3} borderWidth={1} borderColor="gray.200" borderRadius="md">
          <Text fontSize="lg" bold color={COLORS.orangeLight} alignSelf="center">
            Total a Pagar:
          </Text>
          <Text bold alignSelf="center" fontSize={20}>
            S/ {totalFinal}
          </Text>
        </Box>

        {pedido.length === 0 && <Text>No hay productos en el pedido.</Text>}

        {pedido.map((insumo, i) => (
          <Box key={insumo.id + i} mb={4} borderWidth={1} borderColor="gray.200" borderRadius="md" p={2} bg={COLORS.light}>
            <HStack space={3} alignItems="center">
              <Image source={{ uri: insumo.imagen }} alt={insumo.nombre} size="lg" borderRadius="md" />
              <VStack flex={1}>
                <Text bold fontSize="md" color={COLORS.orangeLight}>
                  {insumo.nombre}
                </Text>
                <Text>Cantidad: {insumo.cantidad}</Text>
                <Text>Precio: S/ {insumo.precio}</Text>
                <Spacer />
                <Button mt={2} colorScheme="danger" onPress={() => confirmarEliminar(insumo.id)} height={10} width="50%">
                  Eliminar
                </Button>
              </VStack>
            </HStack>
          </Box>
        ))}

        <Divider my={4} />

        {/* 🔹 Checkbox visible solo si el crédito está activo */}
        {userDetails?.creditoActivo === 1 && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontSize: 16, color: COLORS.darkBlue, marginRight: 10 }}>
                Tipo de compra: Contado
              </Text>

              <CheckBox
                title="¿A CRÉDITO?"
                checked={isSelected}
                onPress={() => setSelection(!isSelected)}
                checkedColor={COLORS.azul}
                containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0, margin: 0 }}
                textStyle={{ color: COLORS.orangeLight, fontWeight: "bold", fontSize: 16 }}
              />
            </View>

            <Text style={{ fontSize: 12, color: COLORS.marron, textAlign: "right" }}>
              Crédito Seleccionado: {isSelected ? "👍" : "👎"}
            </Text>
          </>
        )}
      </ScrollView>

      {/* Botones fijos */}
      <Box position="absolute" bottom={0} left={0} right={0} p={4} bg="white">
        {region && (
          <Button
            mb={3}
            borderRadius={20}
            colorScheme="blueGray"
            _text={{ color: COLORS.orangeLight, fontWeight: "bold", fontSize: 16 }}
            onPress={() => {
              if (region) navigation.navigate("CatalogoRegion", { region });
              else Alert.alert("Aviso", "No tienes una región seleccionada.");
            }}
          >
            Seguir Pidiendo
          </Button>
        )}

        <Button
          colorScheme="orange"
          onPress={progresoPedido}
          borderRadius={20}
          _text={{ fontSize: 18, fontWeight: "bold", color: COLORS.white }}
        >
          Ordenar Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default ResumenPedido;
