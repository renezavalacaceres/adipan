import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../const/colors";

const API_URL = "http://192.168.18.12:3001/api/registro";

export default function Configuracion() {
  const [userDetails, setUserDetails] = useState(null);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(true);

  // Campos para cambio de contraseña
  const [actualPassword, setActualPassword] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Cargar datos del usuario al iniciar
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserDetails(user);

          // Traer datos actualizados del backend
          const res = await axios.get(`${API_URL}/${user.id}`);
          if (res.data.success) {
            const u = res.data.data;
            setNombre(u.name);
            setDireccion(u.direccion);
            setTelefono(u.phone);
          }
        }
      } catch (error) {
        console.log("❌ Error cargando usuario:", error);
        Alert.alert("Error", "No se pudo cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };
    cargarUsuario();
  }, []);

  // ✅ Actualizar datos generales
  const actualizarDatos = async () => {
    if (!nombre || !direccion || !telefono) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${userDetails.id}`, {
        name: nombre?.trim() || userDetails.name,
        direccion: direccion?.trim() || userDetails.direccion,
        phone: telefono?.trim() || userDetails.phone,
      });

      if (response.data.success) {
        Alert.alert("Éxito", "Datos actualizados correctamente ✅");
      } else {
        Alert.alert("Error", response.data.message || "No se pudo actualizar la información.");
      }
    } catch (error) {
      console.log("❌ Error al actualizar usuario:", error);
      Alert.alert("Error", "Error al actualizar datos del usuario.");
    }
  };

  // ✅ Cambiar contraseña
  const cambiarPassword = async () => {
    if (!actualPassword || !nuevaPassword || !confirmPassword) {
      Alert.alert("Error", "Completa todos los campos de contraseña.");
      return;
    }

    if (nuevaPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${userDetails.id}/password`, {
        actualPassword,
        nuevaPassword,
      });

      if (response.data.success) {
        Alert.alert("Éxito", "Contraseña cambiada correctamente 🔐");
        setActualPassword("");
        setNuevaPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", response.data.message || "No se pudo cambiar la contraseña.");
      }
    } catch (error) {
      console.log("❌ Error cambiando contraseña:", error);
      Alert.alert("Error", "Error al cambiar la contraseña.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF8000" />
        <Text style={{ marginTop: 10 }}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Configuración del Usuario</Text>

      {/* Datos generales */}
      <Text style={styles.subtitulo}>Información personal</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <TouchableOpacity style={styles.boton} onPress={actualizarDatos}>
        <Text style={styles.textoBoton}>Guardar Cambios</Text>
      </TouchableOpacity>

      {/* Cambio de contraseña */}
      <Text style={[styles.subtitulo, { marginTop: 30 }]}>Cambio de contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Contraseña actual"
        secureTextEntry
        value={actualPassword}
        onChangeText={setActualPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={nuevaPassword}
        onChangeText={setNuevaPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nueva contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.boton} onPress={cambiarPassword}>
        <Text style={styles.textoBoton}>Cambiar Contraseña</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.orangeLight,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.marron,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 20
  },
  boton: {
    backgroundColor: "#FF8000",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal:20
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
