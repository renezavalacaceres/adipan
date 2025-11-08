import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeBaseProvider } from "native-base";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

// 🔹 Modal de Términos
import TerminosModal from "./src/Presentation/Navigation/TerminosModal";

// Contextos
import FirebaseState from "./src/context/firebase/firebaseState";
import PedidosState from "./src/context/pedidos/pedidosState";

// Componentes
import Loader from "./src/Presentation/component/Loader";
import BotonResumen from "./src/Presentation/Navigation/BotonResumen";

// Screens
import LoginScreen from "./src/Presentation/view/login/Login";
import RegisterScreen from "./src/Presentation/view/register/Register";
import DrawerNavigator from "./src/Presentation/Navigation/DrawerNavigator";
import CatalogoRegion from "./src/Presentation/view/screen/CatalogoRegion";
import DetallePedido from "./src/Presentation/view/screen/DetallePedido";
import FormularioPedido from "./src/Presentation/view/screen/FormularioPedido";
import ResumenPedido from "./src/Presentation/view/screen/ResumenPedido";
import ProgresoPedido from "./src/Presentation/view/screen/ProgresoPedido";
import PagoEnLinea from "./src/Presentation/view/screen/PagoEnLinea";
import PagoConfirmacion from "./src/Presentation/view/screen/PagoConfirmacion";
import MercadoPago from "./src/Presentation/view/screen/MercadoPago";
import YapePago from "./src/Presentation/view/screen/YapePago";
import PlinPago from "./src/Presentation/view/screen/PlinPago";
import ForgotPassword from "./src/Presentation/view/screen/ForgotPassword";
import DetalleCompra from "./src/Presentation/Navigation/DetalleCompras";
import BancaMovilPago from "./src/Presentation/view/screen/BancaMovilPago";
import COLORS from "./src/Presentation/const/colors";
import CustomSplash from "./src/Presentation/component/CustomSplash";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

const App = () => {
  const [showTerminos, setShowTerminos] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  // 🔹 Verificar si el usuario ya aceptó los términos
  useEffect(() => {
    const verificarTerminos = async () => {
      try {
        const aceptado = await AsyncStorage.getItem("terminosAceptados");
        if (!aceptado) {
          setShowTerminos(true); // Mostrar modal
        }
      } catch (error) {
        console.error("Error al leer AsyncStorage", error);
      } finally {
        setChecked(true);
      }
    };
    verificarTerminos();
  }, []);

  // 🔹 Guardar aceptación
  const handleAceptar = async () => {
    await AsyncStorage.setItem("terminosAceptados", "true");
    setShowTerminos(false);
  };

  // 🔹 Carga inicial y splash
  useEffect(() => {
    const iniciarApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await SplashScreen.hideAsync();
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await checkUserStatus();
      setShowSplash(false);
    };
    iniciarApp();
  }, []);

  const checkUserStatus = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      if (userData) {
        userData = JSON.parse(userData);
        //@ts-ignore
        if (userData?.loggedIn) {
          setInitialRouteName("HomeScreen");
        } else {
          setInitialRouteName("RegisterScreen");
        }
      } else {
        setInitialRouteName("LoginScreen");
      }
    } catch {
      setInitialRouteName("LoginScreen");
    }
  };

  if (!checked) return null;
  if (showSplash) return <CustomSplash onFinish={() => setShowSplash(false)} />;

  return (
    <GluestackUIProvider config={config}>
      <NativeBaseProvider>
        <FirebaseState>
          <PedidosState>
            <NavigationContainer>
              {!initialRouteName ? (
                <Loader visible={true} />
              ) : (
                <Stack.Navigator
                  initialRouteName={initialRouteName}
                  screenOptions={{ headerShown: false }}
                >
                  <Stack.Screen name="LoginScreen" component={LoginScreen} />
                  <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                  <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
                  <Stack.Screen name="CatalogoRegion" component={CatalogoRegion} />
                  <Stack.Screen name="DetallePedido" component={DetallePedido} />
                  <Stack.Screen name="FormularioPedido" component={FormularioPedido} />
                  <Stack.Screen name="ResumenPedido" component={ResumenPedido} />
                  <Stack.Screen name="ProgresoPedido" component={ProgresoPedido} />
                  <Stack.Screen name="PagoEnLinea" component={PagoEnLinea} />
                  <Stack.Screen name="MercadoPago" component={MercadoPago} />
                  <Stack.Screen name="PagoConfirmacion" component={PagoConfirmacion} />
                  <Stack.Screen name="YapePago" component={YapePago} />
                  <Stack.Screen name="PlinPago" component={PlinPago} />
                  <Stack.Screen name="BancaMovilPago" component={BancaMovilPago} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                  <Stack.Screen name="DetalleCompra" component={DetalleCompra} />
                </Stack.Navigator>
              )}
            </NavigationContainer>

            {/* 🔹 Modal de Términos solo al primer uso */}
            {showTerminos && (
              <TerminosModal isOpen={showTerminos} onClose={handleAceptar} />
            )}
          </PedidosState>
        </FirebaseState>
      </NativeBaseProvider>
    </GluestackUIProvider>
  );
};

export default App;


