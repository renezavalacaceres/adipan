import { useEffect, useState } from "react";
import FirebaseService from "../../firebase"; // Ajusta la ruta según tu proyecto

export const useConfigPagos = () => {
  const [numeros, setNumeros] = useState({
    yape: "",
    plin: "",
    banca: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = FirebaseService.db.doc("config/configPagos");
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          setNumeros({
            yape: data.yape || "",
            plin: data.plin || "",
            banca: data.banca || "",
          });
        } else {
          console.warn("No existe la configuración de pagos en Firestore");
        }
      } catch (error) {
        console.error("Error al obtener configuración de pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { numeros, loading };
};
