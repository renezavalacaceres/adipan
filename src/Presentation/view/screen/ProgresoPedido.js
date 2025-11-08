import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Container, Text, H1, H3, Button, Center, Box } from 'native-base';
import globalStyles from '../../../styles/global';
import PedidoContext from '../../../context/pedidos/pedidosContext';
import FirebaseService from "../../../firebase";
import { RemoveUserUseCase } from '../../../Domain/useCases/userLocal/RemoveUserLocal';
import Countdown from 'react-countdown';
import COLORS from '../../const/colors';

const ProgresoPedido = ({ navigation }) => {
  const { idpedido, limpiarPedido } = useContext(PedidoContext); // ✅ agregamos limpiarPedido del contexto

  const [pedidoActual, setPedidoActual] = useState(null);
  const [tiempo, guardarTiempo] = useState(0);
  const [completado, guardarCompletado] = useState(false);
  const [pagoTarjetaSeleccionado, setPagoTarjetaSeleccionado] = useState(false);

  useEffect(() => {
    if (!idpedido) return;

    const unsubscribe = FirebaseService.db
      .collection('ordenes')
      .doc(idpedido)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setPedidoActual(data);
          guardarTiempo(data.tiempoentrega || 0);
          guardarCompletado(data.completado || false);
        } else {
          Alert.alert('Error', 'No se encontró el pedido');
        }
      });

    return () => unsubscribe();
  }, [idpedido]);

  const renderer = ({ minutes, seconds }) => (
    <Text style={styles.tiempo}>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Text>
  );

  const handlePagoTarjeta = () => {
    if (!pedidoActual) {
      Alert.alert('Aviso', 'Primero debes esperar que el pedido se registre.');
      return;
    }

    setPagoTarjetaSeleccionado(true);

    if (pedidoActual.tipoCompra === 'Contado') {
      navigation.navigate('MercadoPago', { total: pedidoActual.total });
    } else if (pedidoActual.tipoCompra === 'Crédito') {
      navigation.navigate('PagoEnLinea', { pedidoId: idpedido });
    }
  };

  const logout = async () => {
    try {
      limpiarPedido(); // ✅ limpia el contexto de pedidos antes de salir
      await RemoveUserUseCase();
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Box style={globalStyles.contenedor}>
      <View style={[globalStyles.contenido, { marginTop: 50 }]}>
        {tiempo === 0 && !completado && (
          <Center flex={1}>
            <Text color="gray.500" italic bold style={styles.textoCompletado}>
              ¡gracias por confiar en nosotros!
            </Text>
            <Text color="gray.500" italic bold style={styles.textoCompletado}>
              Hemos recibido tu pedido...
            </Text>
            <Text color="gray.500" italic bold style={styles.textoCompletado}>
              Estamos calculando el tiempo de entrega
            </Text>
            <Text
              onPress={logout}
              color={COLORS.orange}
              italic
              bold
              style={styles.textoCompletado}
            >
              volver al inicio
            </Text>
          </Center>
        )}

        {!completado && tiempo > 0 && (
          <>
            <Text style={{ textAlign: 'center' }}>Su orden estará lista en:</Text>
            <Text>
              <Countdown date={Date.now() + tiempo * 60000} renderer={renderer} />
            </Text>

            {!pagoTarjetaSeleccionado ? (
              <Text
                onPress={handlePagoTarjeta}
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#F59E0B',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                ¿Desea realizar pago con tarjeta?
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                Pago con tarjeta seleccionado
              </Text>
            )}
          </>
        )}

        {completado && (
          <>
            <H1 style={styles.textoCompletado}>Pedido Listo</H1>
            <H3 style={styles.textoCompletado}>
              Por favor, espéranos, estamos en camino
            </H3>

            <Button
              style={[globalStyles.boton, { marginTop: 100 }]}
              rounded
              block
              onPress={() => navigation.navigate('NuevoPedido')}
            >
              <Text style={globalStyles.botonTexto}>Comenzar un nuevo Pedido</Text>
            </Button>

            <Button
              style={[globalStyles.boton, { marginTop: 20 }]}
              rounded
              block
              onPress={logout} // ✅ usa el mismo logout que limpia el contexto
            >
              <Text style={globalStyles.botonTexto}>Cerrar sesión</Text>
            </Button>
          </>
        )}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  tiempo: {
    marginBottom: 20,
    fontSize: 60,
    textAlign: 'center',
    marginTop: 80,
  },
  textoCompletado: {
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
});

export default ProgresoPedido;
