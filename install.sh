#!/bin/bash

# 🚚 Sistema de Gestión de Pedidos BeeZero - Script de Instalación
# Este script automatiza la instalación del proyecto en una nueva computadora

echo "🚚 Instalando Sistema de Gestión de Pedidos BeeZero..."
echo "=================================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js versión 18 o superior:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión $NODE_VERSION detectada. Se requiere versión 18 o superior."
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi

echo "✅ npm $(npm -v) detectado"

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instala Git:"
    echo "   https://git-scm.com/"
    exit 1
fi

echo "✅ Git $(git --version) detectado"

# Instalar dependencias del frontend
echo ""
echo "📦 Instalando dependencias del frontend..."
if npm install; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi

# Instalar dependencias del backend
echo ""
echo "📦 Instalando dependencias del backend..."
if cd server && npm install && cd ..; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "❌ Error instalando dependencias del backend"
    exit 1
fi

# Crear archivos .env si no existen
echo ""
echo "⚙️ Configurando archivos de entorno..."

# Archivo .env en la raíz
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env en la raíz..."
    cat > .env << 'EOF'
# Google Sheets Configuration
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Pedidos
VITE_EMPRESAS_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Empresas
VITE_CLIENTES_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Clientes
VITE_BIKERS_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Bikers

# Backend API URLs
VITE_SHEET_WRITE_URL=http://localhost:5055/api/orders
VITE_SHEET_API_KEY=tu_api_key_opcional

# Google Maps API
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
EOF
    echo "✅ Archivo .env creado en la raíz"
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus configuraciones de Google"
else
    echo "ℹ️  Archivo .env ya existe en la raíz"
fi

# Archivo .env en server
if [ ! -f server/.env ]; then
    echo "📝 Creando archivo .env en server..."
    cat > server/.env << 'EOF'
# Google Service Account (reemplaza con tu configuración)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"tu_proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"tu-service@tu-proyecto.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/tu-service%40tu-proyecto.iam.gserviceaccount.com"}

# Google Maps API
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Server Configuration
PORT=5055
NODE_ENV=development
EOF
    echo "✅ Archivo .env creado en server"
    echo "⚠️  IMPORTANTE: Edita el archivo server/.env con tu Service Account de Google"
else
    echo "ℹ️  Archivo .env ya existe en server"
fi

# Dar permisos de ejecución al script start.sh
if [ -f start.sh ]; then
    chmod +x start.sh
    echo "✅ Permisos de ejecución otorgados a start.sh"
fi

echo ""
echo "🎉 ¡Instalación completada!"
echo "=================================================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Configura Google Cloud Console:"
echo "   - Crea un proyecto en https://console.cloud.google.com/"
echo "   - Habilita Google Sheets API y Google Maps Distance Matrix API"
echo "   - Crea un Service Account y descarga el archivo JSON"
echo "   - Crea una API Key para Google Maps"
echo ""
echo "2. Configura Google Sheets:"
echo "   - Crea un Google Sheet con hojas: Pedidos, Empresas, Clientes, Bikers"
echo "   - Comparte el sheet con el email del Service Account"
echo "   - Copia el ID del sheet de la URL"
echo ""
echo "3. Edita los archivos .env:"
echo "   - Reemplaza TU_SHEET_ID con el ID de tu Google Sheet"
echo "   - Reemplaza tu_google_maps_api_key con tu API Key"
echo "   - Reemplaza el GOOGLE_SERVICE_ACCOUNT_JSON con tu configuración"
echo ""
echo "4. Ejecuta la aplicación:"
echo "   ./start.sh"
echo "   o"
echo "   npm run dev:all"
echo ""
echo "5. Accede a la aplicación:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5055"
echo "   Login: beezeroadmin / ThisPasswordIsBeeZero0000"
echo ""
echo "📖 Para más detalles, consulta el archivo config.example.txt"
echo ""
echo "🔧 Si tienes problemas, revisa la sección 'Solución de Problemas' en el README.md"
