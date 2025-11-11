Write-Host "🚀 INICIANDO LIMPIEZA COMPLETA DEL PROYECTO ADIPAN..." -ForegroundColor Cyan

# 1️⃣ Cerrar procesos que puedan bloquear archivos
Write-Host "🧹 Cerrando procesos Node y Java..." -ForegroundColor Yellow
taskkill /f /im node.exe > $null 2>&1
taskkill /f /im java.exe > $null 2>&1

# 2️⃣ Borrar carpetas problemáticas
Write-Host "🧹 Eliminando carpetas .gradle y node_modules..." -ForegroundColor Yellow
if (Test-Path "android\.gradle") { Remove-Item -Recurse -Force "android\.gradle" }
npm install -g rimraf > $null 2>&1
rimraf node_modules

# 3️⃣ Eliminar archivo de bloqueo
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "🗑️ Eliminado package-lock.json"
}

# 4️⃣ Reinstalar dependencias
Write-Host "📦 Reinstalando dependencias NPM..." -ForegroundColor Green
npm install

# 5️⃣ Limpiar y regenerar prebuild
Write-Host "🔧 Ejecutando npx expo prebuild --clean..." -ForegroundColor Yellow
npx expo prebuild --clean

# 6️⃣ Iniciar el build de EAS
Write-Host "🏗️ Iniciando build de EAS (perfil preview)..." -ForegroundColor Cyan
eas build -p android --profile preview
