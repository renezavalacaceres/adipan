import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Linking,
} from "react-native";
import {
  Box,
  ScrollView,
  Text,
  Button,
  Heading,
  VStack,
  HStack,
} from "native-base";
import FirebaseService from "../../../firebase";
import globalStyles from "../../../styles/global";
import COLORS from "../../const/colors";
import { GetUserUseCase } from "../../../Domain/useCases/userLocal/GetUserLocal";


// ---------- Función para enmascarar tarjeta ----------
const maskCard = (numero) => {
  const clean = numero.replace(/\s+/g, "");
  const last4 = clean.slice(-4);
  return "•••• •••• •••• " + last4;
};

const MercadoPago = ({ route, navigation }) => {
  const { pedidoId, cuotaNumero, monto } = route.params;

  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

  // ---------- Actualiza la cuota en Firestore ----------
  const actualizarCuota = async (metodo) => {
    try {
      const pagoRecord = {
        pedidoId,
        cuotaNumero,
        monto,
        metodo,
        status: "success",
        createdAt: Date.now(),
      };
      await FirebaseService.db.collection("pagos").add(pagoRecord);

      const docRef = FirebaseService.db.collection("pedidos").doc(pedidoId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        Alert.alert("Error", "Orden no encontrada");
        setLoading(false);
        return;
      }
      const data = docSnap.data();
      const nuevasCuotas = (data.cuotas || []).map((c) =>
        c.numero === cuotaNumero ? { ...c, pagado: true } : c
      );
      const todasPagadas = nuevasCuotas.every((c) => c.pagado === true);

      await docRef.update({
        cuotas: nuevasCuotas,
        completado: todasPagadas,
      });
    } catch (error) {
      console.log("❌ Error al actualizar cuota:", error);
      Alert.alert("Error", "Ocurrió un error al procesar el pago");
    }
  };

  // ---------- Pago con tarjeta REAL usando MercadoPago ----------

const API_URL = "https://repealable-superabstract-tomas.ngrok-free.dev";

const procesarPagoTarjeta = async () => {
  if (!numeroTarjeta || !nombreTitular || !fechaVencimiento || !cvv) {
    Alert.alert("Atención", "Completa todos los campos de la tarjeta");
    return;
  }

  const cleanNumber = numeroTarjeta.replace(/\s+/g, "");
  if (cleanNumber.length < 12) {
    Alert.alert("Error", "Número de tarjeta inválido");
    return;
  }

  try {
    setLoading(true);

    // Obtener datos del usuario
    const user = await GetUserUseCase();
    if (!user?.session_token) {
      Alert.alert("Error", "No se encontró información del usuario. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const cleanToken = user.session_token.replace("JWT ", "");
    const token = await AsyncStorage.getItem("session_token");
    

    // Construir items del pago
    const items = [
      { title: `Pedido ${pedidoId} - Cuota ${cuotaNumero}`, quantity: 1, unit_price: Number(monto) }
    ];

    // Petición al backend
    const response = await fetch(`${API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${user.session_token.replace(/^JWT\s+/i, "")}`,
      },


      body: JSON.stringify({ items }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Respuesta no JSON del backend:", text);
      Alert.alert("Error", "No se pudo generar el enlace de pago. Revisa tu sesión o token.");
      setLoading(false);
      return;
    }

    if (!data?.init_point) {
      console.error("❌ Respuesta inesperada:", data);
      Alert.alert("Error", "No se pudo generar el enlace de pago.");
      setLoading(false);
      return;
    }

    // Abrir el checkout de MercadoPago
    Alert.alert(
      "Redirigiendo",
      "Serás dirigido al pago seguro de MercadoPago.",
      [
        {
          text: "Continuar",
          onPress: () => {
            Linking.openURL(data.init_point);

            // Guardar intento de pago en Firestore
            actualizarCuota("tarjeta");

            navigation.navigate("PagoConfirmacion", {
              metodo: "tarjeta",
              monto,
              pedidoId,
              cuotaNumero,
            });
            setLoading(false);
          }
        }
      ]
    );

  } catch (error) {
    console.error("❌ Error al procesar pago:", error);
    Alert.alert("Error", "Ocurrió un problema al crear el pago.");
    setLoading(false);
  }
};

  // ---------- Pagos digitales (Yape / Plin) ----------
  const procesarPagoDigital = (metodo) => {
    setMetodoSeleccionado(metodo);

    Alert.prompt(
      "Confirmar pago",
      `Para pagar con ${metodo.toUpperCase()}, ingresa el código de pago que te proporcionamos:`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => setMetodoSeleccionado(null) },
        {
          text: "Confirmar",
          onPress: (codigo) => {
            if (codigo === "1234") {
              confirmarPagoDigital(metodo);
            } else {
              Alert.alert("Código incorrecto", "El código ingresado no es válido.");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const confirmarPagoDigital = async (metodo) => {
    setLoading(true);
    setTimeout(async () => {
      await actualizarCuota(metodo);

      navigation.navigate("PagoConfirmacion", {
        metodo,
        monto,
        pedidoId,
        cuotaNumero,
      });

      setMetodoSeleccionado(null);
      setLoading(false);
    }, 1000);
  };

  // ---------- Interfaz ----------
  return (
    <Box flex={1} bg={COLORS.light} style={globalStyles.contenedor}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Heading textAlign="center" mb={5} color={COLORS.marron}>
            Pago en Línea
          </Heading>

          {/* Tarjeta visual */}
          <Box style={styles.card}>
            <View style={styles.bgCircle1} />
            <View style={styles.bgCircle2} />
            <Text style={styles.cardNumberPreview}>
              {numeroTarjeta ? maskCard(numeroTarjeta) : "•••• •••• •••• ••••"}
            </Text>
            <HStack justifyContent="space-between">
              <Text style={styles.cardNamePreview}>
                {nombreTitular ? nombreTitular.toUpperCase() : "NOMBRE TITULAR"}
              </Text>
              <Text style={styles.cardExpiryPreview}>
                {fechaVencimiento ? fechaVencimiento : "MM/AA"}
              </Text>
            </HStack>
          </Box>

          {/* Formulario tarjeta */}
          <VStack space={3}>
            <TextInput
              style={styles.TextInp}
              placeholder="Número de Tarjeta"
              keyboardType="numeric"
              value={numeroTarjeta}
              onChangeText={(text) => {
                const onlyNums = text.replace(/\D/g, "");
                const parts = [];
                for (let i = 0; i < onlyNums.length; i += 4) {
                  parts.push(onlyNums.substring(i, i + 4));
                }
                setNumeroTarjeta(parts.join(" ").trim());
              }}
            />
            <TextInput
              style={styles.TextInp}
              placeholder="Nombre en tarjeta"
              value={nombreTitular}
              onChangeText={setNombreTitular}
            />
            <HStack space={3}>
              <TextInput
                style={styles.TextInp}
                placeholder="MM/AA"
                value={fechaVencimiento}
                onChangeText={(text) => {
                  const onlyNums = text.replace(/\D/g, "");
                  let out = onlyNums;
                  if (onlyNums.length > 2) {
                    out = onlyNums.slice(0, 2) + "/" + onlyNums.slice(2, 4);
                  }
                  setFechaVencimiento(out);
                }}
                maxLength={5}
                flex={0.6}
              />
              <TextInput
                style={styles.TextInp}
                placeholder="CVV"
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, ""))}
                maxLength={4}
                flex={0.35}
              />
            </HStack>
          </VStack>
          <Button
            mt={5}
            bg="#ccc"
            borderRadius={10}
            onPress={() =>
              Alert.alert(
                "Modo de prueba",
                "El pago con tarjeta (Mercado Pago) aún está en modo de prueba. Por favor, utiliza Yape, Plin o Banca Móvil por ahora."
              )
            }
          >
            <Text color="#333" bold>Pagar con tarjeta (en prueba)</Text>
          </Button>
          <Text mt={5} fontWeight="bold" textAlign="center" color={COLORS.marron}>
            O pagar con monedero digital
          </Text>

          <HStack justifyContent="space-around" mt={3} padding={2}>
            <Button
              bg={COLORS.purpura}
              width={20}
              borderRadius={10}
              onPress={() =>
                navigation.navigate("YapePago", { pedidoId, cuotaNumero, monto, tipoCompra: "Crédito" })
              }
            >
              Yape
            </Button>

            <Button
              bg={COLORS.verdeAgua || "#00DBC8"}
              width={20}
              borderRadius={10}
              onPress={() =>
                navigation.navigate("PlinPago", { pedidoId, cuotaNumero, monto, tipoCompra: "Crédito" })
              }
            >
              Plin
            </Button>

            <Button
              bg="#36387a"
              borderRadius={10}
              onPress={() =>
                navigation.navigate("BancaMovilPago", { pedidoId, cuotaNumero, monto, tipoCompra: "Crédito" })
              }
            >
              BancaMovil
            </Button>
          </HStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 140,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    marginBottom: 20,
    padding: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  bgCircle1: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.08)", right: -40, top: -40 },
  bgCircle2: { position: "absolute", width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.05)", left: -30, bottom: -30 },
  cardNumberPreview: { color: "#fff", fontSize: 18, letterSpacing: 2, fontWeight: "700", marginBottom: 8 },
  cardNamePreview: { color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "700" },
  cardExpiryPreview: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "700" },
  TextInp: { borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10 },
});

export default MercadoPago;



