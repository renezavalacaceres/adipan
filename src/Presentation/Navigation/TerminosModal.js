import React from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import COLORS from "../const/colors"; // usa tus colores definidos

export default function TerminosModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleClose = () => {
    console.log("CERRAR MODAL");
    if (typeof onClose === "function") {
      onClose();
    } else {
      console.warn("onClose no es una función");
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Términos y Condiciones</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.text}>
              1. La aplicación <Text style={styles.bold}>ADIPAN</Text> es
              administrada por{" "}
              <Text style={styles.bold}>ADIPAN E.I.R.L.</Text>, con el objetivo
              de facilitar la gestión de pedidos y operaciones comerciales con
              sus clientes.
            </Text>

            <Text style={styles.text}>
              2. Al usar esta aplicación, el usuario acepta cumplir con estos
              términos y condiciones, así como con las políticas de privacidad
              establecidas.
            </Text>

            <Text style={styles.text}>
              3. El usuario se compromete a proporcionar información veraz,
              completa y actualizada durante el registro y uso de la aplicación.
            </Text>

            <Text style={styles.text}>
              4. Todos los pagos deben realizarse únicamente mediante los métodos
              autorizados por <Text style={styles.bold}>ADIPAN E.I.R.L.</Text>.
              La empresa no se responsabiliza por transacciones realizadas fuera
              de los canales oficiales.
            </Text>

            <Text style={styles.text}>
              5. <Text style={styles.bold}>ADIPAN E.I.R.L.</Text> se reserva el
              derecho de modificar, suspender o actualizar el contenido,
              funcionalidades o términos de uso de la aplicación en cualquier
              momento, notificando a los usuarios a través de los medios
              disponibles.
            </Text>

            <Text style={styles.text}>
              6. La información y los contenidos mostrados en la aplicación son
              propiedad exclusiva de{" "}
              <Text style={styles.bold}>ADIPAN E.I.R.L.</Text> y no podrán ser
              reproducidos ni distribuidos sin autorización previa.
            </Text>

            <Text style={styles.text}>
              7. Los datos personales proporcionados por el usuario serán tratados
              de acuerdo con la Ley de Protección de Datos Personales (Ley N.º
              29733) y solo se usarán para fines operativos y comerciales
              relacionados con ADIPAN.
            </Text>

            <Text style={styles.text}>
              8. <Text style={styles.bold}>ADIPAN E.I.R.L.</Text> no se
              responsabiliza por errores técnicos, interrupciones del servicio o
              problemas derivados del mal uso de la aplicación.
            </Text>

            <Text style={styles.text}>
              9. Para consultas, sugerencias o reclamos, puede comunicarse al
              correo:{" "}
              <Text style={styles.bold}>soporte.grupoadipan@gmail.com</Text>.
            </Text>

            <Text style={[styles.text, { textAlign: "center", marginTop: 10 }]}>
              Última actualización: <Text style={styles.bold}>Noviembre 2025</Text>
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Aceptar y Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "85%",
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.orange,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.guinda,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.orange,
    paddingBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
    color: COLORS.guinda,
  },
  button: {
    marginTop: 15,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
