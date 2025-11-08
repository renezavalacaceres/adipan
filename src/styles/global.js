import { StyleSheet } from 'react-native';
import COLORS from '../Presentation/const/colors';

const globalStyles = StyleSheet.create({
    contenedor: {
        flex: 1,
        marginBottom:40,
        backgroundColor: COLORS.light
    },
    contenido: {
        marginHorizontal: '2.5%',
        flex: 1,
    },
    boton: {
        backgroundColor: '#FF8000'
    },
    botonTexto: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: '#fff',
        
    },
    titulo: {
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 20,
        fontSize: 30,
        fontStyle: 'italic',
        color: '#ca8a04'
    },
    imagen: {
        height: 300,
        width: '100%'
    },
    cantidad: {
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ca8a04'
    }
})

export default globalStyles;