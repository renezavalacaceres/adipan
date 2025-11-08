import React,{useContext} from 'react'
import { Button, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import PedidoContext from '../../context/pedidos/pedidosContext'
import COLORS from '../const/colors'
const BotonResumen = () => {
     
    const navigation = useNavigation();
  
    const {pedido} = useContext(PedidoContext)

    if(pedido.length ==0) return null;

    return (
    <Button style={{backgroundColor:'#2a3e4b',borderRadius:10}}
        onPress={() => navigation.navigate('ResumenPedido')}
        >
        <Text style={{color:COLORS.orangeLight}}>Ir a Pedido</Text>
    </Button>
  )
}

export default BotonResumen