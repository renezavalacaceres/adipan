#!/usr/bin/env bash
set -e

echo "🏗️ Ejecutando hook pre-install"
echo "🛠️ Verificando GOOGLE_SERVICES_JSON..."

# Verifica que la variable exista
if [ -z "$GOOGLE_SERVICES_JSON" ]; then
  echo "❌ ERROR: No se encontró la variable GOOGLE_SERVICES_JSON en el entorno."
  exit 1
fi

# Crea el archivo google-services.json en la carpeta android/app/
echo "📄 Generando archivo google-services.json..."
echo "$GOOGLE_SERVICES_JSON" > android/app/google-services.json

echo "✅ Archivo google-services.json creado correctamente en android/app/"
