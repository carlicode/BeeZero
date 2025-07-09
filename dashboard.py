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
    page_title="🐝 BeeZero Dashboard",
    page_icon="🐝",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'About': "Dashboard en tiempo real para análisis de imágenes de WhatsApp"
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
@st.cache_data  # Cache hasta actualización manual
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
        
        # Convertir a DataFrames
        try:
            facturas_df = pd.read_excel(
                BytesIO(excel_data), 
                sheet_name=AWS_CONFIG['FACTURAS_SHEET']
            )
        except:
            facturas_df = pd.DataFrame()
            
        try:
            vehiculos_df = pd.read_excel(
                BytesIO(excel_data), 
                sheet_name=AWS_CONFIG['VEHICULOS_SHEET']
            )
        except:
            vehiculos_df = pd.DataFrame()
            
        try:
            turnos_df = pd.read_excel(
                BytesIO(excel_data), 
                sheet_name='Turnos'
            )
        except:
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
    
    # Obtener datos
    with st.spinner("📥 Descargando datos desde S3..."):
        data = download_excel_from_s3()
    
    # Mostrar estado de conexión
    if data['success']:
        st.success(f"✅ Conectado a S3 - Última actualización: {data['last_update'].strftime('%H:%M:%S')}")
    else:
        st.error(f"❌ Error conectando a S3: {data['error']}")
        st.stop()
    
    # Métricas básicas
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("📸 Facturas", len(data['facturas']))
    
    with col2:
        st.metric("🚗 Vehículos", len(data['vehiculos']))
    
    with col3:
        st.metric("👷 Turnos", len(data['turnos']))
    
    # Tabs para las tablas
    tab1, tab2, tab3 = st.tabs(["🚗 Vehículos", "🧾 Facturas", "👷 Turnos"])
    
    with tab1:
        st.subheader("🚗 Datos de Vehículos")
        if not data['vehiculos'].empty:
            st.dataframe(data['vehiculos'], use_container_width=True)
        else:
            st.info("No hay datos de vehículos disponibles")
    
    with tab2:
        st.subheader("🧾 Datos de Facturas")
        if not data['facturas'].empty:
            st.dataframe(data['facturas'], use_container_width=True)
        else:
            st.info("No hay datos de facturas disponibles")
    
    with tab3:
        st.subheader("👷 Datos de Turnos")
        if not data['turnos'].empty:
            st.dataframe(data['turnos'], use_container_width=True)
        else:
            st.info("No hay datos de turnos disponibles")

# 🚀 EJECUTAR APLICACIÓN
if __name__ == "__main__":
    main() 