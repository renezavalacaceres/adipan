#!/bin/bash
set -e

echo "🛠️ Generando archivo google-services.json desde variable de entorno..."

# Verifica si la variable existe
if [ -z "$GOOGLE_SERVICES_JSON" ]; then
  echo "❌ Error: la variable GOOGLE_SERVICES_JSON no está definida."
  exit 1
fi

# Crea la ruta donde debe ir el archivo
mkdir -p android/app

# Escribe el contenido base64 decodificado en el archivo google-services.json
echo "$GOOGLE_SERVICES_JSON" | base64 --decode > android/app/google-services.json

# Confirma que el archivo fue creado
if [ -f "android/app/google-services.json" ]; then
  echo "✅ Archivo google-services.json creado correctamente en android/app/"
else
  echo "❌ No se pudo crear google-services.json"
  exit 1
fi
echo "🛠️ Archivo google-services.json generado con éxito."