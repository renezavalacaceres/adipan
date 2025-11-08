// context/firebase/firebaseState.js
import React, { useReducer } from "react";
import { db } from "../../firebase/firebase";  // 🔥 Asegúrate que db esté inicializado en firebase.js
import { collection, getDocs } from "firebase/firestore";
import FirebaseContext from "./firebaseContext";
import firebaseReducer from "./firebaseReducer";

const FirebaseState = (props) => {
  const initialState = {
    catalogo: [],
  };

  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  // ✅ Función segura para obtener productos por región
  const obtenerProductosRegion = async (coleccion) => {
    try {
      // 🧩 Validar si db está listo
      if (!db) {
        console.error("❌ Firestore no inicializado.");
        return;
      }

      // 🧩 Validar si el nombre de colección es correcto
      if (!coleccion || typeof coleccion !== "string" || coleccion.trim() === "") {
        console.warn("⚠️ Colección no definida o inválida. Se cancela la consulta.");
        return;
      }

      console.log("🔥 DB lista");
      console.log("📂 Colección solicitada:", coleccion);

      const coleccionRef = collection(db, coleccion);
      const querySnapshot = await getDocs(coleccionRef);

      const productos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ Productos obtenidos de ${coleccion}:`, productos.length);

      dispatch({
        type: "OBTENER_PRODUCTOS_REGION",
        payload: productos,
      });
    } catch (error) {
      // 🔥 Si Firestore lanza error, mostrará más detalle
      console.error("❌ Error al obtener productos de Firestore:", error.message || error);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        catalogo: state.catalogo,
        obtenerProductosRegion,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;

