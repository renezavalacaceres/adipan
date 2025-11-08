import React from "react";
import { Box, Text, Button, VStack, Icon, HStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../const/colors";

const PagoConfirmacion = ({ route, navigation }) => {
  const { metodo, monto, pedidoId, cuotaNumero } = route.params || {};

  return (
    <Box flex={1} bg="white" alignItems="center" justifyContent="center" px={6}>
      {/* Ícono de éxito */}
      <Icon
        as={MaterialIcons}
        name="check-circle"
        size="80"
        color={COLORS.verde || "#10B981"}
        mb={4}
      />

      {/* Texto principal */}
      <VStack space={2} alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color={COLORS.marron || "#5A3E36"}>
          ¡Pago Exitoso!
        </Text>
        <Text fontSize="md" textAlign="center" color="gray.600">
          Tu pago de <Text bold>S/ {monto}</Text> por la cuota{" "}
          <Text bold>#{cuotaNumero}</Text> fue registrado correctamente.
        </Text>
        <Text fontSize="md" mt={2} color="gray.500">
          Método usado: <Text bold>{metodo.toUpperCase()}</Text>
        </Text>
      </VStack>

      {/* Botones */}
      <HStack mt={8} space={3}>
        <Button
          bg={COLORS.verde || "#10B981"}
          borderRadius={10}
          onPress={() => navigation.navigate("Pedidos")}
        >
          <Text color="white" bold>
            Ver mis pedidos
          </Text>
        </Button>

        <Button
          variant="outline"
          borderColor={COLORS.marron || "#5A3E36"}
          borderRadius={10}
          onPress={() => navigation.navigate("Inicio")}
        >
          <Text color={COLORS.marron || "#5A3E36"} bold>
            Volver al inicio
          </Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default PagoConfirmacion;
