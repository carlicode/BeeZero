# 🚚 Sistema de Gestión de Pedidos BeeZero

Aplicación web completa para gestionar pedidos de delivery con integración avanzada a Google Sheets, cálculos automáticos de distancia y precio, y funcionalidades de WhatsApp.

## ✨ Características Principales

### 📋 **Gestión Completa de Pedidos**
- ✅ **Formulario inteligente** con validaciones automáticas
- ✅ **Campos obligatorios** con indicadores visuales
- ✅ **Cálculo automático** de distancia y precio
- ✅ **Integración WhatsApp** con mensajes pre-formateados
- ✅ **Programación de pedidos** con fecha, hora y biker

### 🔄 **Integración Avanzada**
- ✅ **Google Sheets** como base de datos principal
- ✅ **Sincronización automática** bidireccional
- ✅ **Exportar/Importar** CSV y Excel
- ✅ **API REST** para operaciones CRUD

### 🎨 **Experiencia de Usuario**
- ✅ **Modo claro/oscuro** automático
- ✅ **Navegación por pestañas** intuitiva
- ✅ **Notificaciones** en tiempo real
- ✅ **Validaciones visuales** con bordes rojos
- ✅ **Auto-completado** de direcciones

## 📊 Estructura del Formulario

### **SECCIÓN 1: Información General**
- **Operador** - Selección automática por usuario
- **Cliente** ⭐ - Dropdown sincronizado con Google Sheets
- **Fecha del Pedido** ⭐ - Campo obligatorio para programación

### **SECCIÓN 2: Recojo y Entrega**
- **Punto de Recojo** ⭐ - Con botón Maps integrado
- **Punto de Entrega** ⭐ - Con botón Maps integrado
- **Detalles de la Carrera** - Descripción adicional

### **SECCIÓN 3: Transporte y Método de Pago**
- **Medio de Transporte** ⭐ - Bicicleta, Cargo, Scooter, Beezero
- **Método de Pago** ⭐ - Efectivo, Cuenta, QR, Cortesía

### **SECCIÓN 4: Distancia y Precio**
- **Distancia (Km)** - Cálculo automático con Google Maps API
- **Precio Total (Bs)** - Cálculo automático basado en distancia y transporte
- **Botón Recalcular** - Para actualizar distancias

### **SECCIÓN 5: Cobros y Pagos**
- **Tipo de Operación** - Cobro, Pago, o sin operación
- **Monto (Bs)** ⭐ - Obligatorio si hay operación

### **SECCIÓN 6: Biker y Horarios**
- **Biker Asignado** ⭐ - Dropdown sincronizado
- **WhatsApp** - Número de contacto
- **Fecha del Pedido** ⭐ - Para programación
- **Hora Programada** ⭐ - Hora de inicio
- **Hora Estimada Fin** - Hora de finalización
- **Duración Estimada** - Tiempo aproximado
- **Día de la Semana** - Auto-calculado por fecha

### **SECCIÓN 7: Estado y Seguimiento**
- **Estado del Pedido** - Pendiente, Entregado, Cancelado
- **Estado de Pago** - Debe Cliente, Pagado, QR Verificado, etc.
- **Pago al Biker** - Monto a pagar al biker
- **Contacto Biker** - Información de contacto
- **Link de Contacto** - WhatsApp, Telegram, etc.

## 🚀 Funcionalidades Avanzadas

### **📱 Integración WhatsApp**
- **Botón WhatsApp** en cada pedido
- **Mensaje pre-formateado** con toda la información
- **Vista previa** del mensaje antes de enviar
- **URL automática** con `api.whatsapp.com/send`

### **🗺️ Cálculo Automático de Distancia**
- **Google Maps API** para rutas precisas
- **Múltiples rutas** (bicicleta, automóvil, caminando)
- **Ruta más larga** seleccionada automáticamente
- **Cache de resultados** para optimización

### **💰 Cálculo Automático de Precio**
- **Tarifas por transporte**:
  - Bicicleta: 4 Bs/km
  - Cargo: 6 Bs/km
  - Scooter: 5 Bs/km
  - Beezero: 7 Bs/km
- **Método "Cuenta"** - Sin cálculo automático
- **Actualización en tiempo real**

### **✅ Validaciones Inteligentes**
- **Campos obligatorios** marcados con ⭐
- **Bordes rojos** en campos vacíos
- **Mensajes de error** descriptivos
- **Validación de fechas** (no fechas pasadas)
- **Validación de montos** (números positivos)

## 🛠️ Instalación

### **Requisitos Previos**
- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)
- **Cuenta de Google** con acceso a Google Sheets y Google Maps

### **1. Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd Pedidos
```

### **2. Instalar dependencias**
```bash
# Dependencias del frontend (React + Vite)
npm install

# Dependencias del backend (Express + Google APIs)
cd server && npm install && cd ..
```

### **3. Configurar variables de entorno**

#### **Crear archivo `.env` en la raíz del proyecto:**
```env
# Google Sheets Configuration
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Pedidos
VITE_EMPRESAS_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Empresas
VITE_CLIENTES_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Clientes
VITE_BIKERS_CSV_URL=https://docs.google.com/spreadsheets/d/TU_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Bikers

# Backend API URLs
VITE_SHEET_WRITE_URL=http://localhost:5055/api/orders
VITE_SHEET_API_KEY=tu_api_key_opcional

# Google Maps API (para cálculos de distancia)
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

#### **Crear archivo `.env` en la carpeta `server/`:**
```env
# Google Service Account (para autenticación con Google Sheets)
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"tu_proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"tu-service@tu-proyecto.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/tu-service%40tu-proyecto.iam.gserviceaccount.com"}

# Google Maps API
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Server Configuration
PORT=5055
NODE_ENV=development
```

### **4. Configurar Google Sheets**

#### **Crear Google Sheet con las siguientes hojas:**
1. **Pedidos** - Para los pedidos principales
2. **Empresas** - Para puntos de recojo/entrega
3. **Clientes** - Para lista de clientes
4. **Bikers** - Para lista de bikers

#### **Estructura de la hoja "Pedidos":**
```
ID | Fecha Registro | Hora Registro | Fechas | Operador | Cliente | Recojo | Entrega | 
Direccion Recojo | Direccion Entrega | Detalles de la Carrera | Dist. [Km] | 
Medio Transporte | Precio [Bs] | Método pago pago | Biker | WhatsApp | 
Hora Ini | Hora Fin | Duracion | Estado | Estado de pago | Observaciones | 
Pago biker | Contacto biker | Link de contacto biker | Dia de la semana | 
Cobro o pago | Monto cobro o pago
```

#### **Configurar permisos:**
1. Ir a **Compartir** en Google Sheets
2. Agregar el email del Service Account con permisos de **Editor**
3. Copiar el ID del sheet de la URL

### **5. Configurar Google Cloud Console**

#### **Crear proyecto en Google Cloud:**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto o seleccionar existente
3. Habilitar las siguientes APIs:
   - **Google Sheets API**
   - **Google Maps Distance Matrix API**

#### **Crear Service Account:**
1. Ir a **IAM & Admin** > **Service Accounts**
2. Crear nueva cuenta de servicio
3. Descargar el archivo JSON
4. Copiar el contenido al archivo `.env` del server

#### **Crear API Key para Google Maps:**
1. Ir a **APIs & Services** > **Credentials**
2. Crear nueva API Key
3. Restringir la key a las APIs necesarias
4. Copiar la key a ambos archivos `.env`

### **6. Verificar instalación**
```bash
# Verificar que Node.js esté instalado
node --version
npm --version

# Verificar que las dependencias estén instaladas
ls node_modules
ls server/node_modules
```

## 🚀 Ejecución

### **Opción 1: Script automático (Recomendado)**
```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x start.sh

# Ejecutar
./start.sh
```

### **Opción 2: Comando npm**
```bash
# Ejecutar frontend y backend simultáneamente
npm run dev:all
```

### **Opción 3: Por separado**
```bash
# Terminal 1: Frontend
npm run client

# Terminal 2: Backend
npm run server
```

### **Opción 4: Desarrollo individual**
```bash
# Solo frontend
npm run dev

# Solo backend
cd server && npm run dev
```

## 🌐 URLs de Acceso
- **Aplicación Frontend**: http://localhost:5173
- **API Backend**: http://localhost:5055
- **Documentación API**: http://localhost:5055/api/docs

## 🔐 Autenticación
- **Usuario**: beezeroadmin
- **Contraseña**: ThisPasswordIsBeeZero0000
- **Almacenamiento**: localStorage (sesión persistente)

## 📋 Checklist de Instalación

- [ ] Node.js instalado (versión 18+)
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install` en raíz y server)
- [ ] Archivo `.env` creado en raíz
- [ ] Archivo `.env` creado en carpeta server
- [ ] Google Sheets configurado con permisos
- [ ] Google Cloud APIs habilitadas
- [ ] Service Account creado y configurado
- [ ] API Key de Google Maps creada
- [ ] URLs de Google Sheets actualizadas en `.env`
- [ ] Aplicación ejecutándose en http://localhost:5173
- [ ] Backend ejecutándose en http://localhost:5055
- [ ] Login funcionando correctamente

## 📊 Integración Google Sheets

### **Estructura de Datos**
```
ID | Fecha Registro | Hora Registro | Fechas | Operador | Cliente | Recojo | Entrega | 
Direccion Recojo | Direccion Entrega | Detalles de la Carrera | Dist. [Km] | 
Medio Transporte | Precio [Bs] | Método pago pago | Biker | WhatsApp | 
Hora Ini | Hora Fin | Duracion | Estado | Estado de pago | Observaciones | 
Pago biker | Contacto biker | Link de contacto biker | Dia de la semana | 
Cobro o pago | Monto cobro o pago
```

### **Configuración**
- **Service Account**: Autenticación automática
- **Permisos**: Lectura y escritura en hojas específicas
- **Sincronización**: Bidireccional en tiempo real

## 🔧 Tecnologías Utilizadas

### **Frontend**
- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **CSS Variables** - Sistema de temas
- **LocalStorage** - Persistencia local

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Google APIs** - Sheets y Maps
- **CORS** - Cross-origin requests

### **APIs Externas**
- **Google Sheets API** - Base de datos
- **Google Maps Distance Matrix API** - Cálculo de rutas
- **WhatsApp Business API** - Integración de mensajes

## 🐛 Solución de Problemas

### **Puertos Ocupados**
```bash
# Limpiar procesos automáticamente
./start.sh

# O manualmente
lsof -ti:5173 | xargs kill -9
lsof -ti:5055 | xargs kill -9
```

### **Errores de Google Sheets**
- Verificar permisos del Service Account
- Confirmar que el SHEET_ID es correcto
- Revisar que las columnas coincidan con HEADER_ORDER

### **Errores de Google Maps**
- Verificar que la API key sea válida
- Confirmar que Distance Matrix API esté habilitada
- Revisar límites de cuota de la API

## 📈 Próximas Mejoras

- [ ] **Dashboard con estadísticas** en tiempo real
- [ ] **Notificaciones push** para nuevos pedidos
- [ ] **Sistema de usuarios** con roles
- [ ] **Reportes automáticos** por email
- [ ] **Integración con GPS** en tiempo real
- [ ] **App móvil** para bikers

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades:
- **Email**: soporte@beezero.com
- **WhatsApp**: +591 69499202
- **GitHub Issues**: [Crear issue](https://github.com/beezero/pedidos/issues)

---

**Desarrollado con ❤️ por el equipo BeeZero**
