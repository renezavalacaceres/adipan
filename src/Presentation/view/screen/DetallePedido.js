import React, { useContext } from "react";
import { Image } from "react-native";
import { Box, ScrollView, VStack, Text, Button, Center } from "native-base";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../../styles/global";

import PedidoContext from "../../../../src/context/pedidos/pedidosContext";
import COLORS from "../../const/colors";

const DetallePedido = () => {
  const { insumo } = useContext(PedidoContext);
  const { nombre, imagen, unidadMedida, precio } = insumo;
  const navigation = useNavigation();

  return (
    <Box flex={1} bg="white" safeArea>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text fontSize="2xl" bold mb={4} textAlign="center">
          {nombre}
        </Text>

        <Box
          borderWidth={1}
          borderColor="gray.200"
          borderRadius={10}
          backgroundColor={COLORS.light}
          overflow="hidden"
          mb={6}
        >
          {imagen ? (
            <Image
              source={{ uri: imagen }}
              style={{ width: "100%", height: 200 }}
              resizeMode="contain"
            />
          ) : (
            <Center bg="gray.200" height={200}>
              <Text color="gray.400">Sin imagen</Text>
            </Center>
          )}

          <VStack p={4} space={3}>
            <Text alignSelf="center" bold>{unidadMedida}</Text>
            <Text fontSize="md" bold color={COLORS.orangeLight}>
              Precio: S/. {precio}
            </Text>
            
            
          </VStack>
        </Box>

        <Button
          onPress={() => navigation.navigate("FormularioPedido")}
          borderRadius={10}
          bg="orange.500"
          _text={{ color: "white", fontWeight: "bold", fontSize: "lg" }}
        >
          Realizar Pedido
        </Button>
      </ScrollView>
    </Box>
  );
};

export default DetallePedido;
