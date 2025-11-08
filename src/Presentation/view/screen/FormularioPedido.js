import React, { useContext, useState, useEffect } from "react";
import { Box, Button, HStack, Input, Text } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import PedidoContext from "../../../../src/context/pedidos/pedidosContext";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../const/colors";
import { TextInput,StyleSheet } from "react-native";

const FormularioPedido = () => {
  const navigation = useNavigation();
  const { insumo, guardarPedido, guardarFechaEntrega } = useContext(PedidoContext);
  const { precio } = insumo;

  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(precio);
  const [fecha, setFecha] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Calcular subtotal automáticamente
  useEffect(() => {
    setTotal(precio * cantidad);
  }, [cantidad]);

  // Manejar selección de fecha
  const onChangeFecha = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowPicker(false);
    setFecha(currentDate);
    guardarFechaEntrega(currentDate);
  };

  const incrementar = () => setCantidad(cantidad + 1);
  const decrementar = () => cantidad > 1 && setCantidad(cantidad - 1);

  // Confirmar pedido solo guarda en contexto y navega
  const confirmarPedido = () => {
    const pedidoObj = { ...insumo, cantidad, total };
    guardarPedido(pedidoObj);
    navigation.navigate("ResumenPedido");
  };

  return (
    <Box flex={1} bg="white" p={4}>
      <Text fontSize="2xl" color={COLORS.orangeLight} bold mb={4} >Pedido de {insumo.nombre}</Text>

      {/* Cantidad */}
      <Text fontSize="md" mb={2} bold textAlign="center">Cantidad</Text>
      <HStack space={2} mb={4} alignItems="center">
        <Button onPress={decrementar} flex={1} size="lg" backgroundColor='#848a8f'><Text fontSize="lg" color={COLORS.white} bold>-</Text></Button>
        <TextInput
          style={styles.input}
          size="lg" bold
          flex={2}
          keyboardType="numeric"
          textAlign="center"
          value={cantidad.toString()}
          onChangeText={(text) => setCantidad(parseInt(text) || 0)}
        />
        <Button onPress={incrementar} flex={1} backgroundColor='#848a8f'><Text fontSize="lg" color={COLORS.white} bold>+</Text></Button>
      </HStack>

      {/* Subtotal */}
      <Text fontSize="md" mb={4} bold color={COLORS.azul}>Subtotal: S/ {total}</Text>

      {/* Fecha de entrega */}
      <HStack alignItems="center" mb={4} space={2}>
        <Text fontSize="md" bold color={COLORS.orangeLight}>Fecha de entrega:</Text>
        <Button 
        backgroundColor="#485762"
        onPress={() => setShowPicker(true)}>
          <Text color={COLORS.white}>{fecha ? fecha.toLocaleDateString() : "Seleccionar"}</Text>
        </Button>
      </HStack>
      {showPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={onChangeFecha}
        />
      )}

      {/* Botón agregar al pedido */}
      <Button colorScheme="orange" onPress={confirmarPedido} borderRadius={10}>
        <Text color={COLORS.white} fontSize="lg">Agregar al Pedido</Text>
      </Button>
      
    </Box>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    //borderWidth: 0.5,
    padding: 10,
    backgroundColor: COLORS.light,
    // cross-platform shadow / elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 4,
  },
});

export default FormularioPedido;





