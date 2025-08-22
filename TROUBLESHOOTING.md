# 🔧 Guía de Solución de Problemas - Cálculo de Distancia

## 🚨 Problema: "No corre la parte de calcular distancia"

### **Diagnóstico Rápido:**

#### **1. Verificar si el backend está corriendo:**
```bash
# Verificar si el puerto 5055 está en uso
lsof -i :5055

# O en Windows:
netstat -an | findstr :5055
```

#### **2. Verificar logs del backend:**
```bash
# En la terminal donde corre el backend, deberías ver:
# ✅ "🚚 Servidor corriendo en puerto 5055"
# ✅ "🔍 Distance proxy llamado con: { origins: ..., destinations: ... }"
```

#### **3. Verificar configuración del frontend:**
```bash
# En la consola del navegador (F12), deberías ver:
# ✅ "📡 Llamando a proxy de distancia: http://localhost:5055/api/distance-proxy"
# ❌ Si ves errores de CORS o conexión rechazada
```

## 🔍 **Pasos de Solución:**

### **Paso 1: Verificar que el backend esté corriendo**

#### **Opción A: Usar el script automático**
```bash
./start.sh
```

#### **Opción B: Ejecutar manualmente**
```bash
# Terminal 1: Frontend
npm run client

# Terminal 2: Backend
npm run server
```

#### **Opción C: Verificar procesos**
```bash
# Ver todos los procesos de Node.js
ps aux | grep node

# Matar procesos si es necesario
pkill -f "node.*server"
pkill -f "vite"
```

### **Paso 2: Verificar archivos .env**

#### **Archivo .env en la raíz:**
```env
# Debe tener:
VITE_SHEET_WRITE_URL=http://localhost:5055/api/orders
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

#### **Archivo server/.env:**
```env
# Debe tener:
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
PORT=5055
NODE_ENV=development
```

### **Paso 3: Verificar Google Maps API**

#### **A. Verificar que la API key sea válida:**
```bash
# Probar la API key directamente
curl "https://maps.googleapis.com/maps/api/distancematrix/json?origins=La%20Paz&destinations=Cochabamba&key=TU_API_KEY"
```

#### **B. Verificar que Distance Matrix API esté habilitada:**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Seleccionar tu proyecto
3. Ir a "APIs & Services" > "Library"
4. Buscar "Distance Matrix API"
5. Verificar que esté habilitada

### **Paso 4: Verificar dependencias del backend**

```bash
# Reinstalar dependencias del backend
cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

### **Paso 5: Verificar logs detallados**

#### **En el navegador (F12 > Console):**
```javascript
// Probar manualmente
fetch('http://localhost:5055/api/distance-proxy?origins=La%20Paz&destinations=Cochabamba')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

#### **En la terminal del backend:**
```bash
# Deberías ver logs como:
# 🔍 Distance proxy llamado con: { origins: 'La Paz', destinations: 'Cochabamba' }
# 📍 URLs procesadas: { original: {...}, processed: {...} }
# 🛣️ Probando múltiples rutas...
# ✅ Ruta más larga seleccionada: ...
```

## 🚨 **Errores Comunes y Soluciones:**

### **Error 1: "Connection refused"**
```bash
# Solución: El backend no está corriendo
npm run server
```

### **Error 2: "CORS error"**
```bash
# Solución: Verificar que el backend tenga CORS habilitado
# El archivo server/index.js debe tener: app.use(cors())
```

### **Error 3: "Google Maps API key not configured"**
```bash
# Solución: Verificar archivo server/.env
echo $GOOGLE_MAPS_API_KEY
```

### **Error 4: "Distance Matrix API not enabled"**
```bash
# Solución: Habilitar la API en Google Cloud Console
# APIs & Services > Library > Distance Matrix API > Enable
```

### **Error 5: "Quota exceeded"**
```bash
# Solución: Verificar límites de cuota en Google Cloud Console
# APIs & Services > Quotas
```

## 🔧 **Script de Diagnóstico Automático:**

```bash
#!/bin/bash
echo "🔍 Diagnóstico de Cálculo de Distancia"
echo "======================================"

# Verificar si el backend está corriendo
if lsof -i :5055 > /dev/null 2>&1; then
    echo "✅ Backend corriendo en puerto 5055"
else
    echo "❌ Backend NO está corriendo en puerto 5055"
    echo "   Ejecuta: npm run server"
fi

# Verificar archivos .env
if [ -f ".env" ]; then
    echo "✅ Archivo .env existe en la raíz"
else
    echo "❌ Archivo .env NO existe en la raíz"
fi

if [ -f "server/.env" ]; then
    echo "✅ Archivo .env existe en server"
else
    echo "❌ Archivo .env NO existe en server"
fi

# Verificar API key
if grep -q "GOOGLE_MAPS_API_KEY" server/.env; then
    echo "✅ GOOGLE_MAPS_API_KEY configurada en server/.env"
else
    echo "❌ GOOGLE_MAPS_API_KEY NO configurada en server/.env"
fi

# Verificar dependencias
if [ -d "server/node_modules" ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "❌ Dependencias del backend NO instaladas"
    echo "   Ejecuta: cd server && npm install"
fi

echo ""
echo "📋 Próximos pasos si hay errores:"
echo "1. Ejecutar: ./start.sh"
echo "2. Verificar logs en la terminal"
echo "3. Verificar consola del navegador (F12)"
echo "4. Probar API key en Google Cloud Console"
```

## 📞 **Si el problema persiste:**

1. **Revisar logs completos** del backend y frontend
2. **Verificar configuración** de Google Cloud Console
3. **Probar con una API key nueva** si es necesario
4. **Verificar que no haya firewalls** bloqueando el puerto 5055

---

**Desarrollado con ❤️ por el equipo BeeZero**
