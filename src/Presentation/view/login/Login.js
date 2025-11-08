import React, { useEffect, useState } from 'react';
import { 
  View, Text, Platform, TouchableWithoutFeedback, Keyboard, Alert, 
  ImageBackground, StyleSheet, ScrollView, Image, KeyboardAvoidingView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../const/colors';
import Button from '../../component/Button';
import Input from '../../component/Input';
import Loader from '../../component/Loader';
import { SaveUserUseCase } from '../../../Domain/useCases/userLocal/SaveUserLocal';
import { useUserLocal } from '../../hooks/useUserLocal';
import { LoginAuthUseCase } from '../../../Domain/useCases/auth/LoginAuth';

const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const { user, getUserSession } = useUserLocal();

  // ✅ Revisar si el usuario ya se registró alguna vez
  useEffect(() => {
    const checkRegistro = async () => {
      const registrado = await AsyncStorage.getItem('yaRegistrado');
      setMostrarRegistro(!registrado);
    };
    checkRegistro();
  }, []);

  // ✅ Si ya hay sesión activa, navegar a Home
  useEffect(() => {
    if (user?.id) {
      navigation.navigate('HomeScreen');
    }
  }, [user]);

  const handleOnchange = (text, input) => {
    setInputs(prev => ({ ...prev, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors(prev => ({ ...prev, [input]: error }));
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Por favor ingrese su correo electrónico', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Por favor ingrese su contraseña', 'password');
      isValid = false;
    }
    if (isValid) login();
  };

  const login = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const response = await LoginAuthUseCase(inputs.email, inputs.password);

      if (!response.success) {
        Alert.alert(response.message);
      } else {
        const userData = {
          ...response.data,
          credito: response.data?.credito ?? 0,
          creditoActivo: response.data?.creditoActivo ?? 0,
        };

        await SaveUserUseCase(userData);
        getUserSession();

        // ✅ Marcar que el usuario ya se registró
        await AsyncStorage.setItem('yaRegistrado', 'true');
        setMostrarRegistro(false);
      }
    }, 3000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: COLORS.guinda}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Loader visible={loading} />
          <Image
            style={styles.imageBackg}
            source={require('../../../../assets/img/imagen0.png')}
          />
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../../assets/logo4.png')}
              style={styles.logoImage}
            />
            <Text style={styles.logotext1}>Tu proveedor de confianza</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.marron,
                width: 300,
                bottom: 35,
              }}
            />

            <View style={{ marginVertical: 20,bottom: 40 }}>
              <Input
                onChangeText={text => handleOnchange(text, 'email')}
                onFocus={() => handleError(null, 'email')}
                iconName="email-outline"
                label="Email"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                password={false}
              />

              <Input
                onChangeText={text => handleOnchange(text, 'password')}
                onFocus={() => handleError(null, 'password')}
                iconName="lock-outline"
                label="Password"
                placeholder="Password"
                error={errors.password}
                password
              />

              <Button title="Iniciar Sesión" onPress={validate} />

              <Text
                style={{ color: COLORS.light, marginTop: 1, textDecorationLine: "underline", textAlign:'right' }}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                ¿Olvidaste tu contraseña?
              </Text>

              {mostrarRegistro && (
                <Text
                  style={{
                    color: COLORS.marron,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                    marginTop: 20
                  }}
                >
                  ¿No tienes cuenta?{' '}
                  <Text
                    onPress={() => navigation.navigate('RegisterScreen')}
                    style={{
                      color: COLORS.orange,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 16,
                    }}
                  >
                    Registraté
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  imageBackg:{
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
    top: 40,
    left: 0,
    opacity: 0.6,
  },
  logoContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '10%',
  },
  logoImage: {
    width: 250,
    height: 250,
    alignSelf:'center',
    resizeMode:'contain'
  },
  logoImage1: {
    width: 50,
    height: 50,
    alignSelf:'center',
    resizeMode:'stretch'
  },
  logotext1:{
    color: COLORS.orange,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    bottom: 50,
  },
  logotext2:{
    color: COLORS.guinda,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  }
});

export default LoginScreen;


