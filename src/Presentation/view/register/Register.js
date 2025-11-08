//import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import COLORS from '../../../Presentation/const/colors';
import Button from '../../../Presentation/component/Button';
import Input from '../../../Presentation/component/Input';
import Loader from '../../../Presentation/component/Loader';
import { RegisterAuthUseCase } from '../../../Domain/useCases/auth/RegisterAut';
import { KeyboardAvoidingView } from 'native-base';
import RegionesDropdown from '../../component/RegionesDropDown';
import { InputIcon } from '@gluestack-ui/themed';

const RegisterScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({
    name: '',
    dni: '',
    phone: '',
    direccion: '',
    provincia: '',
    distrito: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Estado real del selector
  const [region, setRegion] = useState('');

  const validate = () => {
    console.log('DEBUG validate - inputs:', inputs, 'region:', region);
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.name) {
      handleError('Por favor ingrese su nombre completo', 'name');
      isValid = false;
    }

    if (!inputs.dni) {
      handleError('Por favor ingrese su DNI o RUC', 'dni');
      isValid = false;
    } else if (inputs.dni.length !== 8 && inputs.dni.length !== 11) {
      handleError('Ingrese un DNI válido (8 dígitos) o RUC válido (11 dígitos)', 'dni');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Por favor ingrese su teléfono', 'phone');
      isValid = false;
    } else if (inputs.phone.length !== 9) {
      handleError('El teléfono debe tener 9 dígitos', 'phone');
      isValid = false;
    }

    if (!inputs.direccion) {
      handleError('Por favor ingrese su direccion', 'direccion');
      isValid = false;
    }

    // ✅ VALIDAR EL NUEVO SELECTOR
    if (!region) {
      handleError('Por favor seleccione su región', 'region');
      isValid = false;
    }

    if (!inputs.provincia) {
      handleError('Por favor ingrese su provincia', 'provincia');
      isValid = false;
    }

    if (!inputs.distrito) {
      handleError('Por favor ingrese su distrito', 'distrito');
      isValid = false;
    }

    if (!inputs.email) {
      handleError('Por favor ingrese su correo electronico', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Por favor ingrese su correo electronico valido', 'email');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Por favor ingrese su contraseña', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('La contraseña debe tener mínimo 5 caracteres', 'password');
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };

  const register = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const dataToSend = { ...inputs, region }; // ✅ se agrega el valor del selector
        const response = await RegisterAuthUseCase(dataToSend);
        console.log('RESULT:' + JSON.stringify(response));
        setLoading(false);
        navigation.navigate('LoginScreen');
      } catch (error) {
        setLoading(false);
        console.error('Error en el registro:', error);
        Alert.alert('Error', 'No se pudo completar el registro');
      }
    }, 3000);
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 150 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Loader visible={loading} />
            <Image style={styles.imageBackg} />

            <View style={styles.logoContainer}>
              <Text style={styles.logotext}>¡Afíliate!</Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.marron,
                  width: 300,
                }}
              />

              <View style={{ marginVertical: 10 }}>
                <Input
                  onChangeText={(text) => handleOnchange(text, 'name')}
                  onFocus={() => handleError(null, 'name')}
                  iconName="account-outline"
                  label="Nombre"
                  placeholder="Nombre/Razón Social"
                  error={errors.name}
                  password={false}
                />

                <Input
                  keyboardType="numeric"
                  onChangeText={(text) => handleOnchange(text, 'dni')}
                  onFocus={() => handleError(null, 'dni')}
                  iconName="id-card"
                  label="DNI/RUC"
                  placeholder="DNI/RUC"
                  error={errors.dni}
                  password={false}
                />

                <Input
                  keyboardType="numeric"
                  onChangeText={(text) => handleOnchange(text, 'phone')}
                  onFocus={() => handleError(null, 'phone')}
                  iconName="cellphone-basic"
                  label="Teléfono"
                  placeholder="Teléfono"
                  error={errors.phone}
                  password={false}
                />

                <Input
                  onChangeText={(text) => handleOnchange(text, 'direccion')}
                  onFocus={() => handleError(null, 'direccion')}
                  iconName="bus-marker"
                  label="Dirección"
                  placeholder="Dirección"
                  error={errors.direccion}
                  password={false}
                />

                {/* ✅ Selector de Región conectado al registro */}
                <RegionesDropdown 
                  selectedRegion={region}
                  onSelect={(selectedRegion) => setRegion(selectedRegion)} 
                  placeholder="Seleccionar Región"
                  label="Región"
                />
                {errors.region && (
                  <Text style={{ color: 'red', marginLeft: 20, marginTop: 5 }}>
                    {errors.region}
                  </Text>
                )}

                <Input
                  onChangeText={(text) => handleOnchange(text, 'provincia')}
                  onFocus={() => handleError(null, 'provincia')}
                  iconName="city"
                  label="Provincia"
                  placeholder="Provincia"
                  error={errors.provincia}
                  password={false}
                  style={styles.input}
                />

                <Input
                  onChangeText={(text) => handleOnchange(text, 'distrito')}
                  onFocus={() => handleError(null, 'distrito')}
                  iconName="city"
                  label="Distrito"
                  placeholder="Distrito"
                  error={errors.distrito}
                  password={false}
                />

                <Input
                  onChangeText={(text) => handleOnchange(text, 'email')}
                  onFocus={() => handleError(null, 'email')}
                  iconName="email-outline"
                  label="Email"
                  placeholder="Correo electrónico"
                  error={errors.email}
                  password={false}
                />

                <Input
                  onChangeText={(text) => handleOnchange(text, 'password')}
                  onFocus={() => handleError(null, 'password')}
                  iconName="lock-outline"
                  label="Contraseña"
                  placeholder="Contraseña"
                  error={errors.password}
                  password
                />

                <Button title="Realizar Registro" onPress={validate} />

                <Text
                  style={{
                    color: COLORS.marron,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 16,
                    marginTop: 20,
                  }}
                >
                  ¿Ya tienes cuenta?{' '}
                  <Text
                    onPress={() => navigation.navigate('LoginScreen')}
                    style={{
                      color: COLORS.orange,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: 16,
                    }}
                  >
                    Iniciar sesión
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    alignItems: 'center',
  },
  imageBackg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  logoContainer: {
    alignSelf: 'center',
    top: '2%',
  },
  logotext: {
    color: COLORS.orange,
    textAlign: 'center',
    fontSize: 30,
    marginTop: 10,
    fontWeight: 'bold',
  },
  InputContainer: {
    backgroundColor: COLORS.light,
  },
});

export default RegisterScreen;

