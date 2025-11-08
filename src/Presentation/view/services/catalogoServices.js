// services/catalogoService.js
import { db } from "../../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const obtenerCatalogoPorRegion = async (region) => {
  try {
    // 👇 armar nombre de colección en base a la región
    const nombreColeccion = `catalogo_${region.toLowerCase()}`;

    const productosRef = collection(db, nombreColeccion);
    const querySnapshot = await getDocs(productosRef);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error obteniendo catálogo:", error);
    return [];
  }
};
