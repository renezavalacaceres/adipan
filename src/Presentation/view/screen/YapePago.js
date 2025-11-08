import React, { useState } from "react";
import { Image, Alert, ActivityIndicator } from "react-native";
import { Button, Text, Box, VStack, Heading, HStack, Icon } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../../Presentation/const/colors";
import FirebaseService from "../../../firebase";
import { GetUserUseCase } from "../../../Domain/useCases/userLocal/GetUserLocal";
import { useConfigPagos } from "../../hooks/useConfigPagos"; // 🔹 importamos el hook

const YapePago = ({ route, navigation }) => {
  const { pedidoId, cuotaNumero, monto, tipoCompra, idUsuario } = route.params || {};
  const [progreso, setProgreso] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const { numeros, loading } = useConfigPagos(); // 🔹 obtenemos los números desde Firestore

  const copiarNumero = async () => {
    if (!numeros.yape) {
      Alert.alert("Error", "Número de Yape no disponible");
      return;
    }
    await Clipboard.setStringAsync(numeros.yape);
    Alert.alert("Copiado", "Número de empresa copiado al portapapeles ✅");
  };

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleEnviarComprobante = async () => {
    if (!imagen) {
      Alert.alert("Aviso", "Por favor selecciona una imagen del comprobante.");
      return;
    }

    if (!pedidoId || cuotaNumero == null) {
      Alert.alert("Error", "No se pudo identificar el pedido o la cuota.");
      return;
    }

    try {
      setSubiendo(true);
      const response = await fetch(imagen);
      const blob = await response.blob();
      const fileName = `${pedidoId}_cuota${cuotaNumero}_plin.jpg`;
      const storageRef = FirebaseService.storage.ref(`comprobantes/${fileName}`);
      const uploadTask = storageRef.put(blob, { contentType: "image/jpeg" });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgreso(progress);
        },
        (error) => {
          console.error("❌ Error durante la subida:", error);
          Alert.alert("Error", "No se pudo subir el comprobante. Intenta nuevamente.");
          setSubiendo(false);
        },
        async () => {
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          const userDetails = await GetUserUseCase();

          const pagoData = {
            pedidoId,
            idUsuario: idUsuario || userDetails.id,
            nombreUsuario: userDetails.nombre || "Usuario",
            numeroCuota: cuotaNumero,
            fechaPago: new Date(),
            montoPagado: monto,
            comprobanteUrl: url,
            pagado: false,
          };

          await FirebaseService.db.collection("pagos").add(pagoData);

          Alert.alert(
            "Éxito",
            `El comprobante de la cuota ${cuotaNumero} fue enviado correctamente.`,
            [{ text: "OK", onPress: () => navigation.navigate("HomeScreen") }]
          );

          setSubiendo(false);
          setImagen(null);
        }
      );
    } catch (error) {
      console.error("❌ Error al enviar comprobante:", error);
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta nuevamente.");
      setSubiendo(false);
    }
  };

  if (loading) return <Text>Cargando número de Plin...</Text>;

  return (
    <Box flex={1} bg="white" p={6}>
      <Heading textAlign="center" mb={4} color={COLORS.marron}>
        Pago con Yape
      </Heading>

      <VStack space={4}>
        <Text fontSize="md" color="gray.700">
          Cuota N° {cuotaNumero ?? "?"}
        </Text>

        <Text fontSize="lg" bold color={COLORS.azul}>
          Monto a pagar: S/ {Number(monto).toFixed(2)}
        </Text>

        <Text fontSize="md" color="gray.600">
          Tipo de compra: {tipoCompra}
        </Text>

        <Box bg="#f5f5f5" p={3} borderRadius={10} borderWidth={1} borderColor="#ddd">
          <Text fontSize="md" textAlign="center" mb={2}>
            Número de empresa para pagar:
          </Text>

          <HStack justifyContent="center" alignItems="center" space={2}>
            <Text bold fontSize="xl" color={COLORS.azul}>
              {numeros.yape}
            </Text>
            <Button
              size="sm"
              bg={COLORS.azul}
              borderRadius={10}
              onPress={copiarNumero}
              leftIcon={<Icon as={MaterialIcons} name="content-copy" color="white" />}
            >
              Copiar
            </Button>
          </HStack>
        </Box>

        <Button colorScheme="purple" borderRadius={10} onPress={seleccionarImagen}>
          Seleccionar comprobante
        </Button>

        {imagen && (
          <Image
            source={{ uri: imagen }}
            style={{ width: "100%", height: 250, marginTop: 15, borderRadius: 10 }}
          />
        )}

        {subiendo ? (
          <VStack alignItems="center" mt={4}>
            <ActivityIndicator size="large" color={COLORS.azul} />
            <Text mt={2} color={COLORS.azul}>
              Subiendo comprobante... {progreso.toFixed(0)}%
            </Text>
          </VStack>
        ) : (
          <Button mt={4} bg={COLORS.orange} borderRadius={10} onPress={handleEnviarComprobante}>
            <Text color="white" bold>
              Enviar comprobante
            </Text>
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default YapePago;




