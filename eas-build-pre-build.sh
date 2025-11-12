#!/usr/bin/env bash
set -e

echo "🏗️ Ejecutando hook pre-build"
echo "🛠️ Verificando GOOGLE_SERVICES_JSON..."

if [ -z "$GOOGLE_SERVICES_JSON" ]; then
  echo "❌ ERROR: No se encontró la variable GOOGLE_SERVICES_JSON en el entorno."
  exit 1
fi

# Crear el archivo dentro de android/app
echo "📄 Generando archivo google-services.json..."
echo "$GOOGLE_SERVICES_JSON" > android/app/google-services.json

if [ -f android/app/google-services.json ]; then
  echo "✅ Archivo google-services.json creado correctamente en android/app/"
else
  echo "⚠️ No se pudo crear el archivo google-services.json"
  exit 1
fi
