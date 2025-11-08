import React, { useEffect, useContext, useState } from "react";
import { ScrollView } from "react-native";
import { Box, Text, Image, Pressable, Center, VStack, HStack } from "native-base";
import FirebaseService from "../../../firebase";
import PedidosContext from "../../../context/pedidos/pedidosContext";
import COLORS from "../../const/colors";

const CatalogoRegion = ({ route, navigation }) => {
  const { region = "default" } = route.params;
  const { seleccionarInsumo, guardarRegion } = useContext(PedidosContext);
  const [catalogo, setCatalogo] = useState([]);

  useEffect(() => {
    if (!region) {
      console.log("⚠️ No se ha asignado una región aún.");
      Alert.alert(
      "Región requerida",
      "Debes seleccionar una región antes de continuar.",
      [{ text: "OK" }]
    );
      return;
    }

    guardarRegion(region);
    const nombreColeccion = `productos_${region.toLowerCase()}`;
    console.log("📂 Escuchando colección:", nombreColeccion);

    const ref = FirebaseService.db.collection(nombreColeccion);

    // 🔹 Escucha en tiempo real de la colección
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("🟢 Productos recibidos:", data);
        setCatalogo(data);
      },
      (error) => {
        console.error("❌ Error al obtener productos:", error);
      }
    );

    // Limpieza del listener al desmontar
    return () => unsubscribe();
  }, [region]);

  const productosPorCategoria = catalogo.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});

  return (
    <Box flex={1} bg="white" safeArea>
      <Text
        fontSize="2xl"
        bold
        textAlign="center"
        style={{ marginTop: 0, marginBottom: 10, color: COLORS.orangeLight }}
        color="gray.800"
      >
        {region.toUpperCase()}
      </Text>

      {catalogo.length === 0 ? (
        <Center flex={1}>
          <Text color="gray.500" italic>
            No hay productos disponibles en esta región.
          </Text>
        </Center>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <VStack space={4} px={4}>
            {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
              <Box key={categoria}>
                <Box bg="orange.100" px={3} py={1} mb={2}>
                  <Text bold textTransform="uppercase" color="orange.800">
                    {categoria}
                  </Text>
                </Box>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space={3}>
                    {productos.map((prod) => (
                      <Pressable
                        key={prod.id}
                        onPress={() => {
                          if (!prod.disponible) return;
                          seleccionarInsumo(prod);
                          navigation.navigate("DetallePedido");
                        }}
                        disabled={!prod.disponible}
                      >
                        {({ isPressed }) => (
                          <Box
                            w={180}
                            p={3}
                            borderWidth={1}
                            borderColor="gray.200"
                            borderRadius="2xl"
                            bg="white"
                            shadow={3}
                            transform={[{ scale: isPressed ? 0.95 : 1 }]}
                          >
                            {prod.imagen ? (
                              <Image
                                source={{ uri: prod.imagen }}
                                alt="Imagen producto"
                                size="xl"
                                borderRadius="md"
                                mb={2}
                              />
                            ) : (
                              <Center
                                size="xl"
                                bg="gray.200"
                                borderRadius="md"
                                mb={2}
                              >
                                <Text color="gray.400" fontSize="xs">
                                  Sin imagen
                                </Text>
                              </Center>
                            )}

                            <Text bold fontSize="md" color="orange.600" numberOfLines={1}>
                              {prod.nombre}
                            </Text>
                            <Text fontSize="sm" color="brown.600" numberOfLines={1}>
                              {prod.unidadMedida}
                            </Text>
                            <Text bold fontSize="sm" color="brown.600" mt={1}>
                              S/ {prod.precio}
                            </Text>

                            {!prod.disponible ? (
                              <Text color="red.500" bold mt={2} textAlign="center">
                                Agotado
                              </Text>
                            ) : (
                              <Pressable
                                onPress={() => seleccionarInsumo(prod)}
                                style={({ isPressed }) => ({
                                  marginTop: 8,
                                  backgroundColor: COLORS.orangeLight,
                                  paddingVertical: 6,
                                  borderRadius: 8,
                                  opacity: isPressed ? 0.7 : 1,
                                })}
                              >
                                <Text textAlign="center" bold color="white">
                                  Agregar
                                </Text>
                              </Pressable>
                            )}
                          </Box>
                        )}
                      </Pressable>
                    ))}
                  </HStack>
                </ScrollView>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      )}
    </Box>
  );
};

export default CatalogoRegion;
