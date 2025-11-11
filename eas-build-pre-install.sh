#!/usr/bin/env bash
set -e

echo "🛠️ Generando archivo google-services.json desde variable de entorno..."

if [ -z "$GOOGLE_SERVICES_JSON" ]; then
  echo "❌ ERROR: No se encontró GOOGLE_SERVICES_JSON en las variables de entorno."
  exit 1
fi

mkdir -p android/app

echo "$GOOGLE_SERVICES_JSON" > android/app/google-services.json

echo "✅ Archivo google-services.json creado correctamente en android/app/"
