import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../Presentation/component/Button';
import COLORS from '../../../Presentation/const/colors';
import { RemoveUserUseCase } from '../../../Domain/useCases/userLocal/RemoveUserLocal';
import TerminosModal from '../../Navigation/TerminosModal'; // Ajusta la ruta según tu proyecto


const HomeScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState();
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      setUserDetails(JSON.parse(user));
    }
  };

  const logout = async () => {
    await RemoveUserUseCase();
    navigation.replace('LoginScreen');
  };

  const handleRealizarPedido = () => {
    if (!userDetails?.region) {
      alert('No se ha asignado una región a este usuario');
      return;
    }
    navigation.navigate('CatalogoRegion', { region: userDetails.region });
  };
  useEffect(() => {
    const checkTerminos = async () => {
      const aceptado = await AsyncStorage.getItem("terminosAceptados");
      if (!aceptado) setModalVisible(true);
    };
    checkTerminos();
  }, []);

  const aceptarTerminos = async () => {
    await AsyncStorage.setItem("terminosAceptados", "true");
    setModalVisible(false);
  };

  const image = require('../../../../assets/img/imagen0.png');

  return (
    <>
  <SafeAreaView style={{ backgroundColor: COLORS.guinda, flex: 1 }}>
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <Text style={styles.bienvenida}>
        Bienvenido: {userDetails?.name}
      </Text>

      <View style={styles.container}>
        {/* Botones */}
        <Pressable
          onPress={() =>
            navigation.navigate('PagoEnLinea', { idUsuario: userDetails?.id })
          }
        >
          <Image
            source={require('../../../../assets/img/usd-circulo.png')}
            style={styles.logoutImage}
          />
          <Text style={styles.logoText}>Pagar</Text>
          <Text style={styles.logoText}>Deuda</Text>
        </Pressable>

        <Button title="Realizar Pedido" onPress={handleRealizarPedido} />
        <Button title="CERRAR" onPress={logout} />
      </View>
    </ImageBackground>
  </SafeAreaView>

  {/* Modal de términos */}
  <TerminosModal visible={modalVisible} onAccept={aceptarTerminos} />
</>

  );
};

const styles = StyleSheet.create({
  image: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  menuButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 50,
  },
  bienvenida: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop:10,
    marginLeft:20
  },
  logoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 1,
    fontFamily: 'inter-bold',
  },
  logoutImage: { width: 40, height: 40 },
});

export default HomeScreen;
