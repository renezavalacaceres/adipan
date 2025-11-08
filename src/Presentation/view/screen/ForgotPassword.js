import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { VStack, Input, Button, Text } from "native-base";
import axios from "axios";
import COLORS from "../../const/colors"; // ajusta la ruta si hace falta

const API_URL = "http://192.168.18.12:3000"; // usa tu IP / URL real

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    if (!email.trim()) {
      Alert.alert("Aviso", "Ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    try {
      console.log("🔔 Enviando request forgotPassword para:", email);
      const res = await axios.post(`${API_URL}/api/registro/forgotPassword`, { email: email.trim() });
      if (res.data?.success) {
        Alert.alert(
          "Contraseña temporal generada",
          `Tu nueva contraseña es: ${res.data.tempPassword}`,
          [{ text: "Ir al Login", onPress: () => navigation.navigate("LoginScreen") }]
        );
      } else {
        Alert.alert("Error", res.data?.message || "No se pudo generar la contraseña temporal");
      }
    } catch (error) {
      console.error("❌ Error forgotPassword:", error?.response?.data || error.message || error);
      Alert.alert("Error", "No se pudo generar la contraseña temporal. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <VStack px={6} space={4}>
        <Text fontSize="2xl" bold color={COLORS.orangeLight} textAlign="center" mb={2}>
          Recuperar Contraseña
        </Text>

        <TextInput
          placeholder="Correo"
          value={email}
          onChangeText={(t) => { console.log('txt', t); setEmail(t); }}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, padding: 10, borderRadius: 6 }}
        />

        <Button
          onPress={handleForgot}
          isLoading={loading}
          isDisabled={loading}
          borderRadius={20}
          colorScheme="orange"
          _text={{ color: "white", fontWeight: "bold" }}
        >
          Generar Contraseña Temporal
        </Button>

        <Text textAlign="center" mt={3} color="gray.500">
          Ingresa el correo con el que te registraste. Si el correo existe, se generará una contraseña temporal.
        </Text>
      </VStack>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

