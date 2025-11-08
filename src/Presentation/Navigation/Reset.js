// configuracion.js
import React from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../const/colors';

const Reset = () => {

  const resetApp = async () => {
    try {
      await AsyncStorage.clear(); // borra todo el almacenamiento local
      Alert.alert('App reiniciada', 'Se han borrado todos los datos locales.');
      // opcional: puedes forzar reinicio o navegar a pantalla de Registro
      navigation.reset({ index: 0, routes: [{ name: 'Registro' }] });
    } catch (error) {
      console.log('Error al reiniciar la app:', error);
    }
  };

  return (
    <View>
      {/* Este botón lo puedes ocultar o mostrar solo en modo desarrollo */}
      <Button 
      style={{marginTop: 20, marginHorizontal: 20, backgroundColor: COLORS.sirhuelo,height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10,textAlign: 'center'}}
      title="Cerrar App (dev)" onPress={resetApp} 
        >CERRAR APP</Button>
    </View>
  );
};

export default Reset;
