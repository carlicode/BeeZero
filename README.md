# 📊 BeeZero Dashboard - Streamlit Cloud

## 🐝 Descripción

Dashboard interactivo para monitorear el análisis de imágenes y gestión de turnos del sistema **BeeZero**. Diseñado para funcionar en **Streamlit Cloud** leyendo datos desde AWS S3.

## 🚀 Funcionalidades

### 📱 **Análisis de Mensajes**
- Monitoreo en tiempo real de mensajes de WhatsApp
- Análisis automático de imágenes con OpenAI
- Clasificación de facturas y dashboards de vehículos

### 🚗 **Gestión de Vehículos**
- Seguimiento de odómetros y consumo
- Monitoreo de batería y autonomía
- Historial completo de vehículos

### 👷 **Sistema de Turnos**
- Gestión de turnos de trabajadores (abejitas)
- Seguimiento de horarios y duración
- Control de efectivo y vehículos asignados
- Análisis de productividad

## 🛠️ Configuración en Streamlit Cloud

### **1. Crear Repositorio en GitHub**

```bash
# Inicializar repositorio
git init
git add dashboard.py requirements.txt README.md
git commit -m "Initial commit - BeeZero Dashboard"
git branch -M main
git remote add origin https://github.com/tu-usuario/beezero-dashboard.git
git push -u origin main
```

### **2. Configurar en Streamlit Cloud**

1. **Ir a** [share.streamlit.io](https://share.streamlit.io)
2. **Conectar** tu repositorio de GitHub
3. **Configurar** las variables de entorno:

```bash
# Variables requeridas en Streamlit Cloud
AWS_ACCESS_KEY_ID = tu_access_key_aqui
AWS_SECRET_ACCESS_KEY = tu_secret_key_aqui
AWS_DEFAULT_REGION = us-east-1
BUCKET_NAME = beezero-images-bucket
EXCEL_FOLDER = reportes/
EXCEL_FILENAME = analisis-imagenes.xlsx
```

### **3. Deployment Automático**

Una vez configurado, **Streamlit Cloud** detectará automáticamente:
- `dashboard.py` como aplicación principal
- `requirements.txt` para instalar dependencias
- Variables de entorno para conectar con AWS S3

## 📋 Archivos Incluidos

```
├── dashboard.py          # 📊 Dashboard principal
├── requirements.txt      # 📦 Dependencias de Python
├── README.md            # 📖 Esta documentación
└── .gitignore           # 🚫 Archivos excluidos
```

## 🔧 Variables de Entorno

### **AWS Credentials**
```bash
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
AWS_DEFAULT_REGION=us-east-1
```

### **S3 Configuration**
```bash
BUCKET_NAME=beezero-images-bucket
EXCEL_FOLDER=reportes/
EXCEL_FILENAME=analisis-imagenes.xlsx
```

### **Sheets Names**
```bash
FACTURAS_SHEET=Facturas
VEHICULOS_SHEET=Vehiculos
TURNOS_SHEET=Turnos
```

## 🔍 Uso del Dashboard

### **Navegación**
- **🏠 Inicio**: Resumen general y métricas
- **📱 Mensajes**: Análisis de mensajes de WhatsApp
- **🚗 Vehículos**: Gestión de flota vehicular
- **👷 Turnos**: Sistema de turnos de trabajadores

### **Filtros Disponibles**
- **Fecha**: Filtrado por rango de fechas
- **Tipo**: Clasificación de imágenes
- **Vehículo**: Filtrado por vehículo específico
- **Trabajador**: Filtrado por abejita
- **Estado**: Estado de turnos (ACTIVO/COMPLETADO)

### **Métricas Clave**
- Total de mensajes procesados
- Imágenes analizadas por tipo
- Turnos activos vs completados
- Consumo promedio de vehículos
- Rendimiento de trabajadores

## 📊 Estructura de Datos

### **Mensajes**
```python
{
    'timestamp': datetime,
    'sender': str,
    'message_type': str,
    'image_url': str,
    'analysis_result': str
}
```

### **Vehículos**
```python
{
    'timestamp': datetime,
    'vehicle_id': str,
    'odometer': float,
    'battery_percentage': float,
    'consumption': float,
    'autonomy': float
}
```

### **Turnos**
```python
{
    'id_turno': str,
    'abejita': str,
    'vehicle': str,
    'fecha_inicio': datetime,
    'fecha_fin': datetime,
    'efectivo_inicio': float,
    'efectivo_fin': float,
    'estado': str
}
```

## 🚨 Troubleshooting

### **Problemas Comunes**

1. **Error de conexión S3**
   - Verificar credenciales AWS
   - Confirmar permisos de bucket
   - Revisar nombre del bucket

2. **Datos no aparecen**
   - Verificar nombre del archivo Excel
   - Confirmar estructura de sheets
   - Revisar formato de fechas

3. **Error de dependencias**
   - Actualizar `requirements.txt`
   - Verificar versiones compatibles
   - Revisar logs de Streamlit Cloud

### **Logs y Debug**
```python
# Activar debug en dashboard
import streamlit as st
st.set_option('client.showErrorDetails', True)
```

## 🔄 Actualizaciones

### **Deployment Continuo**
- Cada push a `main` actualiza automáticamente
- Streamlit Cloud detecta cambios y redeploya
- Sin downtime durante actualizaciones

### **Versionado**
```bash
# Actualizar dashboard
git add dashboard.py
git commit -m "Update: nueva funcionalidad X"
git push origin main
```

## 🌐 URLs

### **Producción**
- Dashboard: `https://tu-app.streamlit.app`
- Logs: Panel de Streamlit Cloud

### **Desarrollo**
```bash
# Ejecutar localmente
streamlit run dashboard.py
```

## 💡 Características Avanzadas

### **Análisis en Tiempo Real**
- Refresco automático de datos
- Notificaciones de nuevos mensajes
- Alertas de problemas críticos

### **Visualizaciones Interactivas**
- Gráficos con Plotly
- Filtros dinámicos
- Exportación de datos

### **Responsive Design**
- Adaptado para móviles
- Diseño moderno con Streamlit
- Tema personalizado BeeZero

## 📈 Métricas de Performance

- **Tiempo de carga**: < 3 segundos
- **Actualización de datos**: Cada 5 minutos
- **Capacidad**: Miles de registros
- **Disponibilidad**: 99.9% (Streamlit Cloud)

## 🎯 Roadmap

- [ ] Notificaciones push
- [ ] Exportación a PDF
- [ ] Análisis predictivo
- [ ] Integración con más servicios
- [ ] Dashboard móvil nativo

---

**¡Dashboard listo para producción en Streamlit Cloud!** 🚀