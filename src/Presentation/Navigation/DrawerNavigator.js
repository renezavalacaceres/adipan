import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../view/home/Home";
import Configuracion from "./Configuración";
import ComprasRealizadas from "./ComprasRealizadas";
import Reset from "./Reset";
import TerminosModal from "./TerminosModal";
import COLORS from "../const/colors";
import TerminosScreen from "./TerminosScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);


  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerTintColor: "white",
          headerStyle: { backgroundColor: COLORS.orange },
          drawerActiveTintColor: "#FF8000",
          drawerLabelStyle: { fontSize: 16, fontWeight: "bold", color: "white" },
          drawerStyle: { backgroundColor: COLORS.guinda },
        }}
      >
        <Drawer.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
            drawerIcon: ({ size }) => (
              <Ionicons name="home-outline" color={COLORS.orange} size={size} />
            ),
            headerTitleAlign: "center",
          }}
        />

        <Drawer.Screen
          name="Configuración"
          component={Configuracion}
          options={{
            drawerIcon: ({ size }) => (
              <Ionicons name="settings-outline" color={COLORS.orange} size={size} />
            ),
            headerTintColor: COLORS.orange,
            headerStyle: { backgroundColor: COLORS.guinda },
          }}
        />

        <Drawer.Screen
          name="Compras Realizadas"
          component={ComprasRealizadas}
          options={{
            drawerIcon: ({ size }) => (
              <Ionicons name="cart-outline" color={COLORS.orange} size={size} />
            ),
            headerTintColor: COLORS.orange,
            headerStyle: { backgroundColor: COLORS.guinda },
          }}
        />

        <Drawer.Screen
          name="Reset"
          component={Reset}
          options={{
            drawerIcon: ({ size }) => (
              <Ionicons name="refresh-outline" color={COLORS.orange} size={size} />
            ),
            headerTintColor: COLORS.orange,
            headerStyle: { backgroundColor: COLORS.guinda },
          }}
        />

        {/* 🔹 ÚNICO ÍTEM DE TÉRMINOS */}
        <Drawer.Screen
  name="Términos y Condiciones"
  component={TerminosScreen}
  options={{
    drawerIcon: ({ size }) => (
      <Ionicons name="document-text-outline" color={COLORS.orange} size={size} />
    ),
    headerTintColor: COLORS.orange,
    headerStyle: { backgroundColor: COLORS.guinda },
  }}
/>

      </Drawer.Navigator>

       {/* 🔹 Modal de Términos y Condiciones */}
      <TerminosModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}



