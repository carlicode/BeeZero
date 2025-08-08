# 🚗 BeeZero - Sistema de Control de Turnos

Sistema integrado para gestión de turnos de vehículos que combina un bot de WhatsApp con un dashboard en tiempo real.

## 📋 Características Principales

- **🤖 Bot de WhatsApp**: Gestión de turnos vía mensajes
- **📊 Dashboard Streamlit**: Visualización de datos en tiempo real
- **☁️ AWS S3**: Almacenamiento seguro de datos
- **🔒 Sistema "Casado"**: Solo quien inicia un turno puede cerrarlo
- **📱 Grupo Específico**: "Reporte y Control Bee Zero"

## 🚀 Inicio Rápido

### 1️⃣ Configuración del Entorno

```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd BeeZero

# Instalar dependencias Python
pip install -r requirements.txt

# Instalar dependencias Node.js
npm install
```

### 2️⃣ Configuración de Variables de Entorno

1. Copiar plantilla de variables de entorno:
```bash
cp env-example.txt .env
```

2. Editar `.env` con tus credenciales:
```env
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=tu_bucket
WHATSAPP_GROUP_NAME=Reporte y Control Bee Zero
```

### 3️⃣ Iniciar el Sistema

1. **Iniciar Dashboard**:
```bash
streamlit run dashboard.py
```
📌 Dashboard disponible en: http://localhost:8501

2. **Iniciar Bot de WhatsApp**:
```bash
npm start
```
📱 Escanear código QR si es la primera vez

## 📊 Estructura de Datos

### Tablas en S3 (`analisis-imagenes.xlsx`)

1. **Turnos**
   - Control de entrada/salida
   - Validación de números
   - Duración calculada

2. **Vehículos**
   - Registro de flota
   - Control de antigüedad
   - Estado actual

3. **Facturas**
   - Control de pagos
   - Fechas de vencimiento
   - Montos formateados

## 🤖 Comandos del Bot

- **Iniciar Turno**: Registra entrada de vehículo
- **Cerrar Turno**: Registra salida (solo mismo número)
- **Actualizar**: Refresca datos manualmente
- **Estado**: Consulta turnos activos

## 📊 Dashboard

- **Actualización**: Manual mediante botón
- **Vistas**: Turnos, Vehículos, Facturas
- **Filtros**: Por estado, fecha, vehículo
- **Cálculos**: Duración, antigüedad, vencimientos

## 🔐 Seguridad

- **Credenciales**: Almacenadas en `.env`
- **Validación**: Números telefónicos bolivianos
- **Permisos**: Sistema "casado" de turnos
- **Grupo**: Filtrado por nombre específico

## 🛠️ Estructura del Proyecto

```
BeeZero/
├── 🤖 app.js               # Bot de WhatsApp
├── ⚙️ config.js            # Configuración del bot
├── 📊 dashboard.py         # Dashboard Streamlit
├── 📝 requirements.txt     # Dependencias Python
├── 📦 package.json         # Dependencias Node.js
├── 📝 env-example.txt      # Plantilla .env
└── 🔧 .streamlit/         # Config Streamlit
```

## ⚠️ Solución de Problemas

### Bot de WhatsApp

1. **No conecta**:
   - Verificar sesión: `rm -rf ./session && npm start`
   - Escanear nuevo código QR

2. **Error S3**:
   - Verificar credenciales en `.env`
   - Confirmar permisos del bucket

3. **Mensajes no procesados**:
   - Confirmar nombre del grupo
   - Verificar que sean mensajes nuevos

### Dashboard

1. **No muestra datos**:
   - Presionar botón "Actualizar"
   - Verificar conexión S3

2. **Error de credenciales**:
   - Reiniciar Streamlit después de modificar `.env`
   - Verificar formato de credenciales

## 📞 Soporte

Para problemas o consultas:
1. Revisar sección de solución de problemas
2. Verificar logs del sistema
3. Contactar al equipo de soporte

## 🔄 Mantenimiento

- **Respaldos**: Automáticos en S3
- **Logs**: Almacenados en `/logs`
- **Sesión WhatsApp**: Persistente en `/session`

## 📄 Licencia

Derechos reservados © BeeZero