import streamlit as st
import pandas as pd
import boto3
import json
import time
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go
from io import BytesIO
import openpyxl
import re
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# 🎨 CONFIGURACIÓN DE LA PÁGINA
st.set_page_config(
    page_title="BeeZero Dashboard",
    page_icon="🐝",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'About': "Dashboard en tiempo real para análisis de datos y gestión de turnos"
    }
)

# 🎯 CONFIGURACIÓN AWS (desde variables de entorno)
AWS_CONFIG = {
    'ACCESS_KEY': os.getenv('AWS_ACCESS_KEY_ID'),
    'SECRET_KEY': os.getenv('AWS_SECRET_ACCESS_KEY'),
    'REGION': os.getenv('AWS_DEFAULT_REGION', 'us-east-1'),
    'BUCKET_NAME': os.getenv('S3_BUCKET_NAME', 'beezero-images-bucket'),
    'EXCEL_FOLDER': os.getenv('S3_EXCEL_FOLDER', 'reportes/'),
    'EXCEL_FILENAME': os.getenv('S3_EXCEL_FILENAME', 'analisis-imagenes.xlsx'),
    'FACTURAS_SHEET': os.getenv('FACTURAS_SHEET', 'Facturas'),
    'VEHICULOS_SHEET': os.getenv('VEHICULOS_SHEET', 'Vehículos')
}

# ⚠️ VALIDACIÓN DE VARIABLES DE ENTORNO
if not AWS_CONFIG['ACCESS_KEY'] or not AWS_CONFIG['SECRET_KEY']:
    st.error("❌ Error: Variables de entorno AWS no configuradas")
    st.info("💡 Asegúrate de tener un archivo .env con AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY")
    st.stop()

# 🔧 CONFIGURACIÓN S3
@st.cache_resource
def get_s3_client():
    """Obtener cliente S3 configurado"""
    return boto3.client(
        's3',
        aws_access_key_id=AWS_CONFIG['ACCESS_KEY'],
        aws_secret_access_key=AWS_CONFIG['SECRET_KEY'],
        region_name=AWS_CONFIG['REGION']
    )

# 📱 FUNCIÓN PARA FORMATEAR NÚMEROS DE TELÉFONO
def format_phone_number(phone_number):
    """Formatear número de teléfono boliviano"""
    if pd.isna(phone_number):
        return "N/A"
    
    # Convertir a string y limpiar
    phone_str = str(phone_number)
    clean_number = re.sub(r'\D', '', phone_str)
    
    # Si empieza con 591, es un número boliviano
    if clean_number.startswith('591'):
        national_number = clean_number[3:]  # Remover 591
        return f"+591-{national_number}"
    
    # Si no tiene código de país, asumir que es boliviano
    if len(clean_number) == 8:
        return f"+591-{clean_number}"
    
    # Para otros casos, devolver con formato
    return f"+{clean_number}"

# 📊 FUNCIÓN PARA DESCARGAR EXCEL DESDE S3
@st.cache_data(ttl=60)  # Cache por 60 segundos para modo manual
def download_excel_from_s3():
    """Descargar Excel desde S3 y devolverlo como DataFrames"""
    try:
        s3 = get_s3_client()
        
        # Descargar archivo
        excel_key = f"{AWS_CONFIG['EXCEL_FOLDER']}{AWS_CONFIG['EXCEL_FILENAME']}"
        response = s3.get_object(
            Bucket=AWS_CONFIG['BUCKET_NAME'],
            Key=excel_key
        )
        
        # Leer Excel
        excel_data = response['Body'].read()
        
        # Verificar qué hojas existen
        try:
            excel_file = pd.ExcelFile(BytesIO(excel_data))
            sheet_names = excel_file.sheet_names
            print(f"📊 Hojas disponibles: {sheet_names}")
        except Exception as e:
            print(f"❌ Error leyendo Excel: {e}")
            sheet_names = []
        
        # Función para encontrar hoja por nombre aproximado
        def find_sheet(target_names):
            for target in target_names:
                if target in sheet_names:
                    return target
            return None
        
        # Convertir a DataFrames con búsqueda inteligente
        # Facturas
        facturas_sheet = find_sheet(['Facturas', 'facturas', 'FACTURAS'])
        if facturas_sheet:
        try:
                facturas_df = pd.read_excel(BytesIO(excel_data), sheet_name=facturas_sheet)
                print(f"✅ Facturas cargadas: {len(facturas_df)} registros")
                print(f"📋 Columnas Facturas: {list(facturas_df.columns)}")
            except Exception as e:
                print(f"❌ Error cargando facturas: {e}")
                facturas_df = pd.DataFrame()
        else:
            facturas_df = pd.DataFrame()
            
        # Vehículos
        vehiculos_sheet = find_sheet(['Vehículos', 'Vehiculos', 'vehiculos', 'VEHICULOS'])
        if vehiculos_sheet:
        try:
                vehiculos_df = pd.read_excel(BytesIO(excel_data), sheet_name=vehiculos_sheet)
                print(f"✅ Vehículos cargados: {len(vehiculos_df)} registros")
                print(f"📋 Columnas Vehículos: {list(vehiculos_df.columns)}")
            except Exception as e:
                print(f"❌ Error cargando vehículos: {e}")
                vehiculos_df = pd.DataFrame()
        else:
            vehiculos_df = pd.DataFrame()
            
        # Turnos
        turnos_sheet = find_sheet(['Turnos', 'turnos', 'TURNOS'])
        if turnos_sheet:
        try:
                turnos_df = pd.read_excel(BytesIO(excel_data), sheet_name=turnos_sheet)
                print(f"✅ Turnos cargados: {len(turnos_df)} registros")
                print(f"📋 Columnas Turnos: {list(turnos_df.columns)}")
            except Exception as e:
                print(f"❌ Error cargando turnos: {e}")
                turnos_df = pd.DataFrame()
        else:
            turnos_df = pd.DataFrame()
        
        return {
            'success': True,
            'facturas': facturas_df,
            'vehiculos': vehiculos_df,
            'turnos': turnos_df,
            'last_update': datetime.now()
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'facturas': pd.DataFrame(),
            'vehiculos': pd.DataFrame(),
            'turnos': pd.DataFrame(),
            'last_update': None
        }

# 🎯 FUNCIÓN PRINCIPAL
def main():
    """Función principal del dashboard"""
    
    # Header
    st.title("🐝 BeeZero Dashboard")
    st.markdown("### 📊 Análisis de Imágenes en Tiempo Real")
    
    # 🔄 SIDEBAR: Configuración de Actualización
    with st.sidebar:
        st.header("⚙️ Configuración")
        
        # Manual refresh
        st.markdown("### 🔄 Actualización")
        if st.button("🔄 Actualizar", type="primary", use_container_width=True):
            st.cache_data.clear()
            st.rerun()
        
        # Estado de conexión
        st.markdown("### 📊 Estado")
        current_time = datetime.now().strftime('%H:%M:%S')
        st.caption(f"🕐 Última consulta: {current_time}")
        
        st.markdown("---")
        
        # Información del sistema
        st.markdown("### 📋 Configuración S3")
        st.caption(f"🪣 **Bucket:** {AWS_CONFIG['BUCKET_NAME']}")
        st.caption(f"📁 **Archivo:** {AWS_CONFIG['EXCEL_FILENAME']}")
    
    # Obtener datos
    with st.spinner("📥 Descargando datos desde S3..."):
        data = download_excel_from_s3()
    
    # Mostrar estado de conexión
    if data['success']:
        st.success(f"✅ Conectado a S3 - Última actualización: {data['last_update'].strftime('%H:%M:%S')}")
    else:
        st.error(f"❌ Error conectando a S3: {data['error']}")
        st.stop()
    
    # Métricas básicas con información adicional
    col1, col2, col3 = st.columns(3)
    
    with col1:
        facturas_count = len(data['facturas'])
        st.metric("📸 Facturas", facturas_count)
        
        # Información adicional de facturas
        if not data['facturas'].empty:
            try:
                if 'Estado' in data['facturas'].columns:
                    pendientes = len(data['facturas'][data['facturas']['Estado'] == 'PENDIENTE'])
                    pagadas = len(data['facturas'][data['facturas']['Estado'] == 'PAGADA'])
                    st.caption(f"✅ Pagadas: {pagadas} | ⏳ Pendientes: {pendientes}")
                else:
                    st.caption(f"📅 Actualizadas: {data['last_update'].strftime('%H:%M:%S')}")
            except:
                st.caption(f"📅 Actualizadas: {data['last_update'].strftime('%H:%M:%S')}")
    
    with col2:
        vehiculos_count = len(data['vehiculos'])
        st.metric("🚗 Vehículos", vehiculos_count)
    
        # Información adicional de vehículos
        if not data['vehiculos'].empty:
            try:
                if 'Estado' in data['vehiculos'].columns:
                    activos = len(data['vehiculos'][data['vehiculos']['Estado'] == 'ACTIVO'])
                    inactivos = len(data['vehiculos'][data['vehiculos']['Estado'] == 'INACTIVO'])
                    st.caption(f"✅ Activos: {activos} | ❌ Inactivos: {inactivos}")
                else:
                    st.caption(f"📅 Actualizadas: {data['last_update'].strftime('%H:%M:%S')}")
            except:
                st.caption(f"📅 Actualizadas: {data['last_update'].strftime('%H:%M:%S')}")
    
    with col3:
        turnos_count = len(data['turnos'])
        st.metric("👷 Turnos", turnos_count)
        
        # Información adicional de turnos
        if not data['turnos'].empty:
            try:
                if 'Estado' in data['turnos'].columns:
                    activos = len(data['turnos'][data['turnos']['Estado'] == 'ACTIVO'])
                    sin_inicio = len(data['turnos'][data['turnos']['Estado'] == 'SIN_INICIO'])
                    cerrados = len(data['turnos'][data['turnos']['Estado'] == 'CERRADO'])
                    st.caption(f"🟢 Activos: {activos} | 🔴 Sin inicio: {sin_inicio} | ⚫ Cerrados: {cerrados}")
                else:
                    st.caption(f"📅 Actualizadas: {data['last_update'].strftime('%H:%M:%S')}")
            except:
                st.caption(f"📅 Actualizadas: {data['last_update'].strftime('%H:%M:%S')}")
    
    # Tabs para las tablas
    tab1, tab2, tab3 = st.tabs(["🚗 Vehículos", "🧾 Facturas", "👷 Turnos"])
    
    with tab1:
        st.subheader("🚗 Datos de Vehículos")
        if not data['vehiculos'].empty:
            # Información de actualización
            col1, col2 = st.columns([3, 1])
            with col1:
                st.info(f"📊 {len(data['vehiculos'])} registros encontrados")
            with col2:
                st.caption(f"🕐 {data['last_update'].strftime('%H:%M:%S')}")
            
            # Filtrar solo columnas importantes para vehículos con más información
            columnas_importantes_vehiculos = [
                'Placa', 'Marca', 'Modelo', 'Color', 'Año', 'Tipo_Vehiculo',
                'Propietario', 'Telefono', 'CI_Propietario', 'Direccion',
                'Estado', 'Fecha_Registro', 'Ultima_Inspeccion', 'Seguro',
                'Licencia_Conducir', 'Vencimiento_Licencia', 'Observaciones'
            ]
            
            # Seleccionar solo las columnas que existen
            columnas_disponibles = [col for col in columnas_importantes_vehiculos if col in data['vehiculos'].columns]
            
            if columnas_disponibles:
                vehiculos_filtrados = data['vehiculos'][columnas_disponibles].copy()
                
                # Formatear números de teléfono si existe la columna
                if 'Telefono' in vehiculos_filtrados.columns:
                    vehiculos_filtrados['Telefono'] = vehiculos_filtrados['Telefono'].apply(format_phone_number)
                
                # Calcular antigüedad del vehículo
                if 'Año' in vehiculos_filtrados.columns:
                    def calcular_antiguedad(año):
                        try:
                            if pd.notna(año):
                                año_actual = datetime.now().year
                                antiguedad = año_actual - int(año)
                                return f"{antiguedad} años"
                            return "N/A"
                        except:
                            return "N/A"
                    
                    vehiculos_filtrados['Antigüedad'] = vehiculos_filtrados['Año'].apply(calcular_antiguedad)
                
                # Reordenar columnas para mejor visualización
                columnas_orden = ['Placa', 'Estado', 'Marca', 'Modelo', 'Color', 'Año']
                if 'Antigüedad' in vehiculos_filtrados.columns:
                    columnas_orden.append('Antigüedad')
                columnas_orden.extend(['Tipo_Vehiculo', 'Propietario', 'Telefono', 'CI_Propietario', 'Direccion', 
                                     'Fecha_Registro', 'Ultima_Inspeccion', 'Seguro', 'Licencia_Conducir', 
                                     'Vencimiento_Licencia', 'Observaciones'])
                
                # Filtrar solo las columnas que existen
                columnas_orden_existentes = [col for col in columnas_orden if col in vehiculos_filtrados.columns]
                if columnas_orden_existentes:
                    vehiculos_filtrados = vehiculos_filtrados[columnas_orden_existentes]
                
                st.dataframe(vehiculos_filtrados, use_container_width=True)
            else:
                # Si no hay columnas conocidas, mostrar las primeras 6 columnas
                st.dataframe(data['vehiculos'].iloc[:, :6], use_container_width=True)
        else:
            st.warning("⚠️ No hay datos de vehículos disponibles")
    
    with tab2:
        st.subheader("🧾 Datos de Facturas")
        if not data['facturas'].empty:
            # Información de actualización
            col1, col2 = st.columns([3, 1])
            with col1:
                st.info(f"📊 {len(data['facturas'])} registros encontrados")
            with col2:
                st.caption(f"🕐 {data['last_update'].strftime('%H:%M:%S')}")
            
            # Filtrar solo columnas importantes para facturas con más información
            columnas_importantes_facturas = [
                'Numero_Factura', 'Fecha', 'Cliente', 'Telefono', 'CI_Cliente',
                'Monto', 'Moneda', 'Metodo_Pago', 'Estado', 'Tipo_Servicio',
                'Descripcion', 'Placa_Vehiculo', 'Conductor', 'Telefono_Conductor',
                'Fecha_Registro', 'Fecha_Vencimiento', 'Descuento', 'Impuesto',
                'Observaciones', 'Ubicacion_Servicio'
            ]
            
            # Seleccionar solo las columnas que existen
            columnas_disponibles = [col for col in columnas_importantes_facturas if col in data['facturas'].columns]
            
            if columnas_disponibles:
                facturas_filtradas = data['facturas'][columnas_disponibles].copy()
                
                # Formatear números de teléfono si existe la columna
                if 'Telefono' in facturas_filtradas.columns:
                    facturas_filtradas['Telefono'] = facturas_filtradas['Telefono'].apply(format_phone_number)
                if 'Telefono_Conductor' in facturas_filtradas.columns:
                    facturas_filtradas['Telefono_Conductor'] = facturas_filtradas['Telefono_Conductor'].apply(format_phone_number)
                
                # Formatear monto con símbolo de moneda
                if 'Monto' in facturas_filtradas.columns and 'Moneda' in facturas_filtradas.columns:
                    def formatear_monto(row):
                        try:
                            if pd.notna(row['Monto']):
                                monto = float(row['Monto'])
                                moneda = row['Moneda'] if pd.notna(row['Moneda']) else 'BOB'
                                return f"{monto:.2f} {moneda}"
                            return "N/A"
                        except:
                            return str(row['Monto']) if pd.notna(row['Monto']) else "N/A"
                    
                    facturas_filtradas['Monto_Formateado'] = facturas_filtradas.apply(formatear_monto, axis=1)
                
                # Calcular días hasta vencimiento
                if 'Fecha_Vencimiento' in facturas_filtradas.columns:
                    def calcular_dias_vencimiento(fecha_venc):
                        try:
                            if pd.notna(fecha_venc):
                                fecha_venc = pd.to_datetime(fecha_venc)
                                hoy = datetime.now()
                                dias = (fecha_venc - hoy).days
                                if dias > 0:
                                    return f"{dias} días"
                                elif dias == 0:
                                    return "HOY"
                                else:
                                    return f"Vencida ({abs(dias)} días)"
                            return "N/A"
                        except:
                            return "N/A"
                    
                    facturas_filtradas['Dias_Vencimiento'] = facturas_filtradas['Fecha_Vencimiento'].apply(calcular_dias_vencimiento)
                
                # Reordenar columnas para mejor visualización
                columnas_orden = ['Numero_Factura', 'Estado', 'Fecha', 'Cliente', 'Telefono', 'CI_Cliente']
                if 'Monto_Formateado' in facturas_filtradas.columns:
                    columnas_orden.append('Monto_Formateado')
                else:
                    columnas_orden.extend(['Monto', 'Moneda'])
                columnas_orden.extend(['Metodo_Pago', 'Tipo_Servicio', 'Descripcion', 'Placa_Vehiculo', 'Conductor', 
                                     'Telefono_Conductor', 'Fecha_Registro', 'Fecha_Vencimiento'])
                if 'Dias_Vencimiento' in facturas_filtradas.columns:
                    columnas_orden.append('Dias_Vencimiento')
                columnas_orden.extend(['Descuento', 'Impuesto', 'Observaciones', 'Ubicacion_Servicio'])
                
                # Filtrar solo las columnas que existen
                columnas_orden_existentes = [col for col in columnas_orden if col in facturas_filtradas.columns]
                if columnas_orden_existentes:
                    facturas_filtradas = facturas_filtradas[columnas_orden_existentes]
                
                st.dataframe(facturas_filtradas, use_container_width=True)
            else:
                # Si no hay columnas conocidas, mostrar las primeras 6 columnas
                st.dataframe(data['facturas'].iloc[:, :6], use_container_width=True)
        else:
            st.warning("⚠️ No hay datos de facturas disponibles")
    
    with tab3:
        st.subheader("👷 Datos de Turnos")
        if not data['turnos'].empty:
            # Información de actualización
            col1, col2 = st.columns([3, 1])
            with col1:
                st.info(f"📊 {len(data['turnos'])} registros encontrados")
            with col2:
                st.caption(f"🕐 {data['last_update'].strftime('%H:%M:%S')}")
            
            # Filtrar solo columnas importantes con más información
            columnas_importantes = [
                'ID_Turno', 
                'Fecha_Inicio', 
                'Timestamp_Inicio',
                'Telefono_Inicio',
                'Abejita',
                'Auto',
                'Apertura_Caja',
                'Danos_Auto_Inicio',
                'Estado',
                'Fecha_Fin',
                'Timestamp_Fin',
                'Telefono_Fin',
                'Cierre_Caja',
                'Danos_Auto_Fin'
            ]
            
            # Seleccionar solo las columnas que existen en el DataFrame
            columnas_disponibles = [col for col in columnas_importantes if col in data['turnos'].columns]
            
            if columnas_disponibles:
                turnos_filtrados = data['turnos'][columnas_disponibles].copy()
                
                # Formatear números de teléfono
                if 'Telefono_Inicio' in turnos_filtrados.columns:
                    turnos_filtrados['Telefono_Inicio'] = turnos_filtrados['Telefono_Inicio'].apply(format_phone_number)
                if 'Telefono_Fin' in turnos_filtrados.columns:
                    turnos_filtrados['Telefono_Fin'] = turnos_filtrados['Telefono_Fin'].apply(format_phone_number)
                
                # Calcular duración del turno
                if 'Timestamp_Inicio' in turnos_filtrados.columns and 'Timestamp_Fin' in turnos_filtrados.columns:
                    def calcular_duracion(row):
                        try:
                            if pd.notna(row['Timestamp_Inicio']) and pd.notna(row['Timestamp_Fin']):
                                inicio = pd.to_datetime(row['Timestamp_Inicio'], unit='s')
                                fin = pd.to_datetime(row['Timestamp_Fin'], unit='s')
                                duracion = fin - inicio
                                horas = int(duracion.total_seconds() // 3600)
                                minutos = int((duracion.total_seconds() % 3600) // 60)
                                return f"{horas}h {minutos}m"
                            return "N/A"
                        except:
                            return "N/A"
                    
                    turnos_filtrados['Duracion'] = turnos_filtrados.apply(calcular_duracion, axis=1)
                
                # Reordenar columnas para mejor visualización
                columnas_orden = ['ID_Turno', 'Estado', 'Fecha_Inicio', 'Telefono_Inicio', 'Abejita', 'Auto']
                if 'Duracion' in turnos_filtrados.columns:
                    columnas_orden.append('Duracion')
                columnas_orden.extend(['Apertura_Caja', 'Danos_Auto_Inicio', 'Fecha_Fin', 'Telefono_Fin', 'Cierre_Caja', 'Danos_Auto_Fin'])
                
                # Filtrar solo las columnas que existen
                columnas_orden_existentes = [col for col in columnas_orden if col in turnos_filtrados.columns]
                if columnas_orden_existentes:
                    turnos_filtrados = turnos_filtrados[columnas_orden_existentes]
                
                st.dataframe(turnos_filtrados, use_container_width=True)
            else:
                st.warning("⚠️ No se encontraron las columnas esperadas en los datos de turnos")
        else:
            st.warning("⚠️ No hay datos de turnos disponibles")
    
# 🚀 EJECUTAR APLICACIÓN
if __name__ == "__main__":
    main() 