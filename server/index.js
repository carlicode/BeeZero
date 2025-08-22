import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { google } from 'googleapis'
import fs from 'fs'

// Cargar variables de entorno desde múltiples ubicaciones
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Intentar cargar desde múltiples ubicaciones
const envPaths = [
  path.join(__dirname, '..', '.env'),  // .env en la raíz
  path.join(__dirname, '.env'),        // .env en server/
  '.env'                               // .env en el directorio actual
]

console.log('🔍 Buscando archivo .env en:')
envPaths.forEach((envPath, index) => {
  console.log(`  ${index + 1}. ${envPath}`)
})

// Cargar el primer archivo .env que exista
let envLoaded = false
for (const envPath of envPaths) {
  try {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath })
      console.log(`✅ Archivo .env cargado desde: ${envPath}`)
      envLoaded = true
      break
    }
  } catch (error) {
    console.warn(`⚠️ Error cargando ${envPath}:`, error.message)
  }
}

if (!envLoaded) {
  console.warn('⚠️ No se encontró ningún archivo .env')
}

const PORT = process.env.PORT || 5055
const SHEET_ID = process.env.SHEET_ID || ''
const SHEET_NAME = process.env.SHEET_NAME || 'Pedidos'
const SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ''
const SERVICE_ACCOUNT_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_FILE || ''

// API Key de Google Maps - intentar desde múltiples fuentes
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDMKgCLNzX2g2SoKvKuChT4XtCct5b7JNs'

// Debug: Mostrar todas las variables de entorno cargadas
console.log('🔍 Variables de entorno cargadas:')
console.log(`  - SHEET_ID: "${process.env.SHEET_ID}"`)
console.log(`  - SHEET_NAME: "${process.env.SHEET_NAME}"`)
console.log(`  - SERVICE_ACCOUNT_FILE: "${process.env.GOOGLE_SERVICE_ACCOUNT_FILE}"`)
console.log(`  - GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY ? 'Configurada' : 'No configurada'}"`)

if (!SHEET_ID) {
  console.warn('WARN: SHEET_ID no definido en .env')
}

console.log('🔧 Configuración cargada:')
console.log(`  - Puerto: ${PORT}`)
console.log(`  - Google Maps API Key: ${GOOGLE_MAPS_API_KEY ? '✅ Configurada' : '❌ No configurada'}`)
console.log(`  - Sheet ID: ${SHEET_ID ? '✅ Configurado' : '❌ No configurado'}`)
console.log(`  - Sheet Name: ${SHEET_NAME}`)
console.log(`  - Service Account File: ${SERVICE_ACCOUNT_FILE ? '✅ Configurado' : '❌ No configurado'}`)

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

function getAuthClient() {
  let creds = null
  
  console.log('🔐 Intentando autenticación con Google Sheets...')
  
  if (SERVICE_ACCOUNT_JSON) {
    console.log('  - Usando SERVICE_ACCOUNT_JSON')
    creds = JSON.parse(SERVICE_ACCOUNT_JSON)
  } else if (SERVICE_ACCOUNT_FILE) {
    console.log(`  - Usando SERVICE_ACCOUNT_FILE: ${SERVICE_ACCOUNT_FILE}`)
    try {
      // Resolver la ruta del archivo de service account
      let serviceAccountPath = SERVICE_ACCOUNT_FILE
      if (SERVICE_ACCOUNT_FILE.startsWith('..')) {
        // Si la ruta es relativa, resolverla desde el directorio del servidor
        serviceAccountPath = path.join(__dirname, '..', SERVICE_ACCOUNT_FILE.replace(/^\.\.\//, ''))
      }
      
      console.log(`  - Ruta resuelta: ${serviceAccountPath}`)
      
      // Verificar si el archivo existe
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(`Archivo de service account no encontrado: ${serviceAccountPath}`)
      }
      const raw = fs.readFileSync(serviceAccountPath, 'utf8')
      creds = JSON.parse(raw)
      console.log('  - ✅ Archivo de service account leído correctamente')
    } catch (error) {
      console.error('  - ❌ Error leyendo archivo de service account:', error.message)
      throw error
    }
  }
  
  if (!creds) {
    console.error('  - ❌ No se encontraron credenciales de service account')
    throw new Error('Falta GOOGLE_SERVICE_ACCOUNT_JSON o GOOGLE_SERVICE_ACCOUNT_FILE en .env')
  }
  
  console.log(`  - ✅ Autenticación configurada para: ${creds.client_email}`)
  
  const jwt = new google.auth.JWT(
    creds.client_email,
    undefined,
    creds.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  )
  return jwt
}

const HEADER_ORDER = [
  'ID','Fecha Registro','Hora Registro','Operador','Cliente','Recojo','Entrega','Direccion Recojo','Direccion Entrega','Detalles de la Carrera','Dist. [Km]','Medio Transporte','Precio [Bs]','Método pago pago','Biker','WhatsApp','Fechas','Hora Ini','Hora Fin','Duracion','Estado','Estado de pago','Observaciones','Pago biker','Contacto biker','Link de contacto biker','Dia de la semana','Cobro o pago','Monto cobro o pago'
]

function quoteSheet(title) {
  return `'${String(title).replace(/'/g, "''")}'`
}

async function ensureSheetExists(sheetsApi, spreadsheetId, title) {
  const meta = await sheetsApi.spreadsheets.get({ spreadsheetId })
  const exists = (meta.data.sheets || []).some(s => s.properties?.title === title)
  if (!exists) {
    await sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] }
    })
  }
}

const KEY_TO_COL = {
  id: 'ID',
  fecha_registro: 'Fecha Registro',
  hora_registro: 'Hora Registro',
  operador: 'Operador',
  cliente: 'Cliente',
  recojo: 'Recojo',
  entrega: 'Entrega',
  direccion_recojo: 'Direccion Recojo',
  direccion_entrega: 'Direccion Entrega',
  detalles_carrera: 'Detalles de la Carrera',
  distancia_km: 'Dist. [Km]',
  medio_transporte: 'Medio Transporte',
  precio_bs: 'Precio [Bs]',
  metodo_pago: 'Método pago pago',
  biker: 'Biker',
  whatsapp: 'WhatsApp',
  fecha: 'Fechas',
  hora_ini: 'Hora Ini',
  hora_fin: 'Hora Fin',
  duracion: 'Duracion',
  estado: 'Estado',
  estado_pago: 'Estado de pago',
  observaciones: 'Observaciones',
  pago_biker: 'Pago biker',
  contacto_biker: 'Contacto biker',
  link_contacto_biker: 'Link de contacto biker',
  dia_semana: 'Dia de la semana',
  cobro_pago: 'Cobro o pago',
  monto_cobro_pago: 'Monto cobro o pago'
}

function buildRow(order) {
  const row = HEADER_ORDER.map(() => '')
  console.log('🔍 Mapeando campos del pedido:')
  for (const [k, v] of Object.entries(KEY_TO_COL)) {
    const idx = HEADER_ORDER.indexOf(v)
    if (idx >= 0) {
      // Usar valores directamente ya que el frontend los envía en el formato correcto
      row[idx] = order[k] ?? ''
      console.log(`  ${k} -> ${v} (posición ${idx}): "${order[k] ?? ''}"`)
    } else {
      console.log(`  ⚠️ Campo ${k} -> ${v} no encontrado en HEADER_ORDER`)
    }
  }
  return row
}

// Función para expandir URLs acortadas y extraer coordenadas
const expandUrlAndExtractCoords = async (shortUrl) => {
  try {
    console.log('🔍 Expandiendo URL:', shortUrl)
    
    // Si ya contiene coordenadas directamente, extraerlas
    const coordPatterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      /\/place\/[^\/]*\/@(-?\d+\.\d+),(-?\d+\.\d+)/
    ]
    
    for (const pattern of coordPatterns) {
      const match = shortUrl.match(pattern)
      if (match) {
        const coords = `${match[1]},${match[2]}`
        console.log('✅ Coordenadas encontradas directamente:', coords)
        return coords
      }
    }
    
    // Si es una URL acortada, seguir redirecciones
    if (shortUrl.includes('goo.gl') || shortUrl.includes('maps.app.goo.gl')) {
      console.log('🔄 Siguiendo redirecciones...')
      
      const response = await fetch(shortUrl, { 
        method: 'HEAD',
        redirect: 'follow'
      })
      
      const expandedUrl = response.url
      console.log('📍 URL expandida:', expandedUrl)
      
      // Extraer coordenadas de la URL expandida
      for (const pattern of coordPatterns) {
        const match = expandedUrl.match(pattern)
        if (match) {
          const coords = `${match[1]},${match[2]}`
          console.log('✅ Coordenadas extraídas:', coords)
          return coords
        }
      }
    }
    
    // Si no encontramos coordenadas, usar la URL original
    console.log('⚠️ No se encontraron coordenadas, usando URL original')
    return shortUrl
  } catch (error) {
    console.error('❌ Error expandiendo URL:', error)
    return shortUrl
  }
}

// Endpoint proxy para Distance Matrix API (evitar CORS)
app.get('/api/distance-proxy', async (req, res) => {
  try {
    const { origins, destinations } = req.query
    
    console.log('🔍 Distance proxy llamado con:', { origins, destinations })
    
    const apiKey = GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      console.error('❌ Google Maps API key no configurada en el backend')
      return res.status(400).json({ error: 'Google Maps API key no configurada en el backend' })
    }
    
    if (!origins || !destinations) {
      console.error('❌ Parámetros origins o destinations faltantes')
      return res.status(400).json({ error: 'Parámetros origins y destinations son requeridos' })
    }
    
    // Expandir URLs y extraer coordenadas
    const processedOrigins = await expandUrlAndExtractCoords(origins)
    const processedDestinations = await expandUrlAndExtractCoords(destinations)
    
    console.log('📍 URLs procesadas:', { 
      original: { origins, destinations },
      processed: { origins: processedOrigins, destinations: processedDestinations }
    })
    
    // Opciones para obtener rutas más largas
    const routeOptions = [
      // Ruta 1: Evitar autopistas (generalmente más larga)
      `origins=${encodeURIComponent(processedOrigins)}&destinations=${encodeURIComponent(processedDestinations)}&mode=driving&units=metric&avoid=highways&key=${apiKey}`,
      // Ruta 2: Evitar peajes (puede ser más larga)
      `origins=${encodeURIComponent(processedOrigins)}&destinations=${encodeURIComponent(processedDestinations)}&mode=driving&units=metric&avoid=tolls&key=${apiKey}`,
      // Ruta 3: Evitar autopistas Y peajes
      `origins=${encodeURIComponent(processedOrigins)}&destinations=${encodeURIComponent(processedDestinations)}&mode=driving&units=metric&avoid=highways,tolls&key=${apiKey}`,
      // Ruta 4: Ruta normal (como referencia)
      `origins=${encodeURIComponent(processedOrigins)}&destinations=${encodeURIComponent(processedDestinations)}&mode=driving&units=metric&key=${apiKey}`
    ]
    
    console.log('🛣️ Probando múltiples rutas para encontrar la más larga...')
    
    const allRoutes = []
    
    // Probar todas las opciones de ruta
    for (let i = 0; i < routeOptions.length; i++) {
      try {
        const routeUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?${routeOptions[i]}`
        const routeResponse = await fetch(routeUrl)
        const routeData = await routeResponse.json()
        
        if (routeData.status === 'OK' && routeData.rows[0]?.elements[0]?.status === 'OK') {
          const element = routeData.rows[0].elements[0]
          allRoutes.push({
            type: ['Sin autopistas', 'Sin peajes', 'Sin autopistas ni peajes', 'Ruta normal'][i],
            distance: element.distance.value,
            distanceText: element.distance.text,
            duration: element.duration.value,
            durationText: element.duration.text,
            data: routeData
          })
          
          console.log(`🛣️ Ruta ${i + 1} (${allRoutes[allRoutes.length - 1].type}): ${element.distance.text} - ${element.duration.text}`)
        }
      } catch (error) {
        console.warn(`⚠️ Error probando ruta ${i + 1}:`, error.message)
      }
    }
    
    if (allRoutes.length === 0) {
      return res.status(400).json({ error: 'No se pudieron calcular rutas' })
    }
    
    // Encontrar la ruta MÁS LARGA
    const longestRoute = allRoutes.reduce((longest, current) => 
      current.distance > longest.distance ? current : longest
    )
    
    console.log(`✅ Ruta más larga seleccionada: ${longestRoute.type} - ${longestRoute.distanceText}`)
    
    const data = longestRoute.data
    
    console.log('📊 Respuesta final (ruta más larga):', JSON.stringify(data, null, 2))
    
    res.json(data)
  } catch (error) {
    console.error('❌ Error en distance proxy:', error)
    res.status(500).json({ error: 'Error calculando distancia: ' + error.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body || {}
    console.log('📥 Datos recibidos del frontend:', JSON.stringify(order, null, 2))
    console.log('🔧 Configuración:', { SHEET_ID: SHEET_ID ? 'Configurado' : 'No configurado', SHEET_NAME })
    const auth = await getAuthClient()
    await auth.authorize()
    const sheets = google.sheets({ version: 'v4', auth })
    const quoted = quoteSheet(SHEET_NAME)
    await ensureSheetExists(sheets, SHEET_ID, SHEET_NAME)

    // Asegurar encabezado (opcional: comentar si ya existe)
    const rangeHeader = `${quoted}!A1:AC1`
    const get = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: rangeHeader })
    const hasHeader = (get.data.values || []).length > 0
    if (!hasHeader) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: rangeHeader,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADER_ORDER] }
      })
    }

    // Verificar si el pedido ya existe (buscar por ID)
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${quoted}!A:A`
    })

    const ids = existingData.data.values || []
    let existingRowIndex = -1
    
    for (let i = 1; i < ids.length; i++) { // Saltar header (i=0)
      if (ids[i] && ids[i][0] === order.id) {
        existingRowIndex = i + 1 // +1 porque las filas de Google Sheets empiezan en 1
        break
      }
    }

    const row = buildRow(order)
    console.log('📊 Fila construida para el sheet:', row)
    console.log(`📏 Número de columnas: ${row.length} (HEADER_ORDER: ${HEADER_ORDER.length})`)
    console.log(`📋 Columnas en HEADER_ORDER: ${HEADER_ORDER.join(', ')}`)

    if (existingRowIndex > 0) {
      // Actualizar fila existente
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${quoted}!A${existingRowIndex}:AC${existingRowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] }
      })
      console.log(`Updated existing order #${order.id} at row ${existingRowIndex}`)
    } else {
      // Agregar nueva fila
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${quoted}!A:AC`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] }
      })
      console.log(`Added new order #${order.id}`)
    }

    res.json({ ok: true, updated: existingRowIndex > 0 })
  } catch (err) {
    console.error('❌ Error en /api/orders:', err)
    console.error('❌ Stack trace:', err.stack)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))


