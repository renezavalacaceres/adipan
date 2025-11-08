#!/usr/bin/env bash
echo "📦 Creando google-services.json desde variable secreta..."
echo "$GOOGLE_SERVICES_JSON" > android/app/google-services.json
echo "✅ Archivo google-services.json creado correctamente."
