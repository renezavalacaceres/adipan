// TerminosScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TerminosScreen() {
   const navigation = useNavigation();
  const currentYear = new Date().getFullYear();

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Términos y Condiciones</Text>

        <Text style={styles.paragraph}>
          1. La aplicación <Text style={styles.bold}>ADIPAN</Text> es administrada por{" "}
          <Text style={styles.bold}>ADIPAN E.I.R.L.</Text>.
        </Text>

        <Text style={styles.paragraph}>
          2. Al utilizar esta aplicación, usted acepta cumplir con estos términos
          y condiciones.
        </Text>

        <Text style={styles.paragraph}>
          3. El usuario se compromete a proporcionar información veraz, completa
          y actualizada durante su registro y uso del sistema.
        </Text>

        <Text style={styles.paragraph}>
          4. Todos los pagos y transacciones deben realizarse únicamente a través
          de los métodos de pago autorizados por ADIPAN E.I.R.L.
        </Text>

        <Text style={styles.paragraph}>
          5. ADIPAN E.I.R.L. no se responsabiliza por errores o inconvenientes
          derivados del uso indebido de la aplicación o de datos incorrectos
          proporcionados por el usuario.
        </Text>

        <Text style={styles.paragraph}>
          6. El acceso a ciertas funcionalidades puede requerir conexión a
          Internet. ADIPAN E.I.R.L. no garantiza la disponibilidad continua del
          servicio.
        </Text>

        <Text style={styles.paragraph}>
          7. El contenido, logotipos e información dentro de la aplicación son
          propiedad exclusiva de ADIPAN E.I.R.L. y están protegidos por derechos
          de autor.
        </Text>

        <Text style={styles.paragraph}>
          8. ADIPAN E.I.R.L. se reserva el derecho de actualizar estos términos
          sin previo aviso, notificando los cambios relevantes a los usuarios.
        </Text>

        <Text style={styles.paragraph}>
          9. Para consultas o soporte técnico puede comunicarse al correo:{" "}
          <Text style={styles.bold}>soporte.grupoadipan@gmail.com</Text>
        </Text>

        {/* ---------- POLÍTICA DE PRIVACIDAD ---------- */}
        <Text style={[styles.heading, { marginTop: 20 }]}>Política de Privacidad</Text>

        <Text style={styles.paragraph}>
          1. <Text style={styles.bold}>Responsable del tratamiento:</Text> Los
          datos personales proporcionados por el usuario serán tratados por{" "}
          <Text style={styles.bold}>ADIPAN E.I.R.L.</Text>, con el fin de gestionar los
          servicios ofrecidos a través de la aplicación móvil.
        </Text>

        <Text style={styles.paragraph}>
          2. <Text style={styles.bold}>Datos que recopilamos:</Text> Podremos recopilar
          información como nombre completo, número de documento, dirección,
          teléfono, correo electrónico, historial de pedidos y datos de pago
          asociados a operaciones dentro de la app.
        </Text>

        <Text style={styles.paragraph}>
          3. <Text style={styles.bold}>Finalidad del tratamiento:</Text> Los datos serán
          utilizados exclusivamente para:
        </Text>

        <Text style={[styles.paragraph, styles.list]}>
          • Registrar y administrar su cuenta de usuario.{"\n"}
          • Procesar pedidos y pagos.{"\n"}
          • Enviar notificaciones sobre el estado de sus pedidos.{"\n"}
          • Brindar soporte técnico y atención al cliente.{"\n"}
          • Mejorar la experiencia de uso de la aplicación.
        </Text>

        <Text style={styles.paragraph}>
          4. <Text style={styles.bold}>Conservación de datos:</Text> Los datos
          personales serán conservados mientras el usuario mantenga una relación
          activa con la aplicación o mientras sea necesario para cumplir con
          obligaciones legales o contables.
        </Text>

        <Text style={styles.paragraph}>
          5. <Text style={styles.bold}>Transferencia de datos:</Text> ADIPAN E.I.R.L. no
          comparte ni transfiere datos personales a terceros, salvo cuando sea
          requerido por ley o por una autoridad competente.
        </Text>

        <Text style={styles.paragraph}>
          6. <Text style={styles.bold}>Seguridad:</Text> ADIPAN E.I.R.L. aplica medidas
          técnicas y organizativas para proteger los datos personales contra
          pérdida, acceso no autorizado o divulgación indebida.
        </Text>

        <Text style={styles.paragraph}>
          7. <Text style={styles.bold}>Derechos del usuario:</Text> El usuario puede
          solicitar en cualquier momento el acceso, corrección, actualización o
          eliminación de sus datos personales enviando un correo a{" "}
          <Text style={styles.bold}>soporte.grupoadipan@gmail.com</Text>.
        </Text>

        <Text style={styles.paragraph}>
          8. <Text style={styles.bold}>Uso de cookies o tecnologías similares:</Text> La
          aplicación puede recopilar información técnica (como tipo de dispositivo
          o sistema operativo) para mejorar su rendimiento, sin identificar
          personalmente al usuario.
        </Text>

        <Text style={styles.paragraph}>
          9. <Text style={styles.bold}>Cambios en la Política de Privacidad:</Text> ADIPAN
          E.I.R.L. podrá modificar esta política para adaptarla a nuevas
          disposiciones legales o cambios tecnológicos. La versión actualizada se
          publicará dentro de la aplicación.
        </Text>

        <Text style={styles.paragraph}>
          10. <Text style={styles.bold}>Aceptación:</Text> Al utilizar la aplicación, el
          usuario acepta expresamente esta política de privacidad y autoriza el
          tratamiento de sus datos personales según lo descrito.
        </Text>

        <Text style={styles.footerText}>
          Última actualización: 2 de noviembre de 2025
        </Text>
        <Text style={styles.footerText}>
          © {currentYear} ADIPAN E.I.R.L. - Todos los derechos reservados.
        </Text>
        
        {/* ---------- BOTÓN DE CIERRE ---------- */}
        <TouchableOpacity style={styles.button} onPress={handleClose}>
          <Text style={styles.buttonText}>Aceptar y Cerrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12, color: "#333" },
  paragraph: { fontSize: 15, color: "#444", marginBottom: 10, lineHeight: 22 },
  bold: { fontWeight: "bold" },
  list: { marginLeft: 10 },
  footerText: { fontSize: 12, color: "gray", textAlign: "center", marginTop: 8 },
  button: {
    backgroundColor: "#FF7F00",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 24,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});


