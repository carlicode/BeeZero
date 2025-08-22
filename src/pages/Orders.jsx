import React, { useMemo, useState, useEffect } from 'react'
import Papa from 'papaparse'

// Componente para el formulario de edición completa
const EditForm = ({ order, onComplete, onCancel }) => {
  const [editData, setEditData] = useState({
    operador: order.operador || '',
    cliente: order.cliente || '',
    recojo: order.recojo || '',
    entrega: order.entrega || '',
    direccion_recojo: order.direccion_recojo || '',
    direccion_entrega: order.direccion_entrega || '',
    detalles_carrera: order.detalles_carrera || '',
    distancia_km: order.distancia_km || '',
    medio_transporte: order.medio_transporte || '',
    precio_bs: order.precio_bs || '',
    metodo_pago: order.metodo_pago || '',
    estado_pago: order.estado_pago || '',
    biker: order.biker || '',
    whatsapp: order.whatsapp || '',
    fecha: order.fecha || '',
    hora_ini: order.hora_ini || '',
    hora_fin: order.hora_fin || '',
    duracion: order.duracion || '',
    estado: order.estado || '',
    observaciones: order.observaciones || '',
    pago_biker: order.pago_biker || '',
    contacto_biker: order.contacto_biker || '',
    link_contacto_biker: order.link_contacto_biker || '',
    dia_semana: order.dia_semana || '',
    cobro_pago: order.cobro_pago || '',
    monto_cobro_pago: order.monto_cobro_pago || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete(editData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-sections">
        {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
        <div className="edit-section">
          <h4>📋 Información General</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Operador</label>
              <select name="operador" value={editData.operador} onChange={handleChange}>
                <option value="">Seleccionar Operador</option>
                <option value="Alejandra">Alejandra</option>
                <option value="Anna">Anna</option>
                <option value="Miguel">Miguel</option>
                <option value="Fabiola">Fabiola</option>
                <option value="Anais">Anais</option>
              </select>
            </div>
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                name="cliente"
                value={editData.cliente}
                onChange={handleChange}
                placeholder="Nombre del cliente"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: RUTA Y DIRECCIONES */}
        <div className="edit-section">
          <h4>🛣️ Ruta y Direcciones</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Punto de Recojo</label>
              <input
                type="text"
                name="recojo"
                value={editData.recojo}
                onChange={handleChange}
                placeholder="Punto de recojo"
              />
            </div>
            <div className="form-group">
              <label>Punto de Entrega</label>
              <input
                type="text"
                name="entrega"
                value={editData.entrega}
                onChange={handleChange}
                placeholder="Punto de entrega"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Dirección Recojo (URL)</label>
              <input
                type="url"
                name="direccion_recojo"
                value={editData.direccion_recojo}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div className="form-group">
              <label>Dirección Entrega (URL)</label>
              <input
                type="url"
                name="direccion_entrega"
                value={editData.direccion_entrega}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DETALLES Y PRECIO */}
        <div className="edit-section">
          <h4>💰 Detalles y Precio</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Detalles de la Carrera</label>
              <textarea
                name="detalles_carrera"
                value={editData.detalles_carrera}
                onChange={handleChange}
                placeholder="Detalles adicionales..."
                rows="2"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Distancia (Km)</label>
              <input
                type="number"
                step="0.01"
                name="distancia_km"
                value={editData.distancia_km}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Medio de Transporte</label>
              <select name="medio_transporte" value={editData.medio_transporte} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Bicicleta">Bicicleta</option>
                <option value="Cargo">Cargo</option>
                <option value="Scooter">Scooter</option>
                <option value="Beezero">Beezero</option>
              </select>
            </div>
            <div className="form-group">
              <label>Precio (Bs)</label>
              <input
                type="number"
                step="0.01"
                name="precio_bs"
                value={editData.precio_bs}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: PAGO Y BIKER */}
        <div className="edit-section">
          <h4>💳 Pago y Biker</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Método de Pago</label>
              <select name="metodo_pago" value={editData.metodo_pago} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Cuenta">Cuenta</option>
                <option value="QR">QR</option>
                <option value="Cortesía">Cortesía</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado de Pago</label>
              <select name="estado_pago" value={editData.estado_pago} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Debe Cliente">Debe Cliente</option>
                <option value="Pagado">Pagado</option>
                <option value="QR Verificado">QR Verificado</option>
                <option value="Debe Biker">Debe Biker</option>
                <option value="Error Admin">Error Admin</option>
                <option value="Error Biker">Error Biker</option>
                <option value="Espera">Espera</option>
                <option value="Sin Biker">Sin Biker</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Biker</label>
              <input
                type="text"
                name="biker"
                value={editData.biker}
                onChange={handleChange}
                placeholder="Nombre del biker"
              />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="text"
                name="whatsapp"
                value={editData.whatsapp}
                onChange={handleChange}
                placeholder="Número de WhatsApp"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 5: FECHAS Y HORARIOS */}
        <div className="edit-section">
          <h4>📅 Fechas y Horarios</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha del Pedido</label>
              <input
                type="date"
                name="fecha"
                value={editData.fecha}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Hora de Inicio</label>
              <input
                type="time"
                name="hora_ini"
                value={editData.hora_ini}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Hora de Fin</label>
              <input
                type="time"
                name="hora_fin"
                value={editData.hora_fin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 6: ESTADO Y OBSERVACIONES */}
        <div className="edit-section">
          <h4>📊 Estado y Observaciones</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={editData.estado} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                value={editData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones adicionales..."
                rows="2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          ❌ Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          ✅ Guardar Cambios
        </button>
      </div>
    </form>
  )
}

// Componente para el formulario de cancelación
const CancelForm = ({ order, onComplete, onCancel }) => {
  const [cancelData, setCancelData] = useState({
    motivo: order.detalles_carrera || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cancelData.motivo.trim()) {
      alert('Por favor ingresa el motivo de la cancelación')
      return
    }
    onComplete(cancelData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCancelData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="cancel-form">
      {/* Información del pedido */}
      <div className="order-info">
        <h4>📋 Información del Pedido</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Cliente:</label>
            <span>{order.cliente}</span>
          </div>
          <div className="info-item">
            <label>Ruta:</label>
            <span>{order.recojo} → {order.entrega}</span>
          </div>
          <div className="info-item">
            <label>Biker:</label>
            <span>{order.biker}</span>
          </div>
          <div className="info-item">
            <label>Precio:</label>
            <span>{order.precio_bs} Bs</span>
          </div>
          <div className="info-item">
            <label>Estado Actual:</label>
            <span>{order.estado}</span>
          </div>
        </div>
      </div>

      {/* Motivo de cancelación */}
      <div className="cancel-fields">
        <h4>❌ Motivo de Cancelación</h4>
        <div className="form-group">
          <label>Motivo <span className="required">*</span></label>
          <textarea
            name="motivo"
            value={cancelData.motivo}
            onChange={handleChange}
            placeholder="Especifica el motivo de la cancelación..."
            rows="4"
            required
            className="field-required"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          ❌ Cancelar
        </button>
        <button type="submit" className="btn btn-danger">
          🚫 Confirmar Cancelación
        </button>
      </div>
    </form>
  )
}

// Componente para el formulario de entrega
const DeliveryForm = ({ order, onComplete, onCancel }) => {
  const [deliveryData, setDeliveryData] = useState({
    cliente: order.cliente || '',
    recojo: order.recojo || '',
    entrega: order.entrega || '',
    biker: order.biker || '',
    precio_bs: order.precio_bs || '',
    distancia_km: order.distancia_km || '',
    medio_transporte: order.medio_transporte || '',
    hora_ini: order.hora_ini || '',
    hora_fin: '',
    observaciones: order.observaciones || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!deliveryData.hora_fin) {
      alert('Por favor ingresa la hora de finalización')
      return
    }
    onComplete(deliveryData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDeliveryData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="delivery-form">
      {/* Información del pedido */}
      <div className="order-info">
        <h4>📋 Información del Pedido (Editable)</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Cliente:</label>
            <input
              type="text"
              name="cliente"
              value={deliveryData.cliente}
              onChange={handleChange}
              placeholder="Nombre del cliente"
            />
          </div>
          <div className="info-item">
            <label>Punto de Recojo:</label>
            <input
              type="text"
              name="recojo"
              value={deliveryData.recojo}
              onChange={handleChange}
              placeholder="Punto de recojo"
            />
          </div>
          <div className="info-item">
            <label>Punto de Entrega:</label>
            <input
              type="text"
              name="entrega"
              value={deliveryData.entrega}
              onChange={handleChange}
              placeholder="Punto de entrega"
            />
          </div>
          <div className="info-item">
            <label>Biker:</label>
            <input
              type="text"
              name="biker"
              value={deliveryData.biker}
              onChange={handleChange}
              placeholder="Nombre del biker"
            />
          </div>
          <div className="info-item">
            <label>Precio (Bs):</label>
            <input
              type="number"
              step="0.01"
              name="precio_bs"
              value={deliveryData.precio_bs}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className="info-item">
            <label>Distancia (Km):</label>
            <input
              type="number"
              step="0.01"
              name="distancia_km"
              value={deliveryData.distancia_km}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className="info-item">
            <label>Medio de Transporte:</label>
            <select
              name="medio_transporte"
              value={deliveryData.medio_transporte}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="Bicicleta">Bicicleta</option>
              <option value="Cargo">Cargo</option>
              <option value="Scooter">Scooter</option>
              <option value="Beezero">Beezero</option>
            </select>
          </div>
          <div className="info-item">
            <label>Hora de Inicio:</label>
            <input
              type="time"
              name="hora_ini"
              value={deliveryData.hora_ini}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Campos de entrega */}
      <div className="delivery-fields">
        <h4>✅ Completar Entrega</h4>
        <div className="form-group">
          <label>Hora de Finalización <span className="required">*</span></label>
          <input
            type="time"
            name="hora_fin"
            value={deliveryData.hora_fin}
            onChange={handleChange}
            required
            className="field-required"
          />
        </div>
        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={deliveryData.observaciones}
            onChange={handleChange}
            placeholder="Detalles de la entrega, problemas, etc..."
            rows="3"
          />
        </div>
      </div>

      {/* Vista previa de la ruta */}
      <div className="route-preview">
        <h4>🛣️ Ruta Completa</h4>
        <div className="route-display">
          <span className="route-from">{deliveryData.recojo || 'Sin recojo'}</span>
          <span className="route-arrow">→</span>
          <span className="route-to">{deliveryData.entrega || 'Sin entrega'}</span>
        </div>
      </div>

      {/* Botones */}
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          ❌ Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          ✅ Completar Entrega
        </button>
      </div>
    </form>
  )
}

const initialOrder = {
  fecha: '',
  fecha_registro: '',
  hora_registro: '',
  operador: '',
  cliente: '',
  recojo: '',
  entrega: '',
  direccion_recojo: '',
  direccion_entrega: '',
  detalles_carrera: '',
  distancia_km: '',
  medio_transporte: '',
  precio_bs: '',
  metodo_pago: '',
  estado_pago: '',
  biker: '',
  whatsapp: '',
  hora_ini: '',
  hora_fin: '',
  duracion: '',
  estado: '',

  observaciones: '',
  pago_biker: '',
  contacto_biker: '',
  link_contacto_biker: '',
  dia_semana: '',
  cobro_pago: '',
  monto_cobro_pago: ''
}

export default function Orders() {
  const OPERADORES = ['Alejandra', 'Anna', 'Miguel', 'Fabiola', 'Anais']
  const METODOS_PAGO = ['Efectivo', 'Cuenta', 'QR', 'Cortesía']
  const ESTADOS_PAGO = ['Debe Cliente', 'Pagado', 'QR Verificado', 'Debe Biker', 'Error Admin', 'Error Biker', 'Espera', 'Sin Biker']
  const MEDIOS_TRANSPORTE = ['Bicicleta', 'Cargo', 'Scooter', 'Beezero']
  const ESTADOS = ['Pendiente', 'Entregado', 'Cancelado']
  const TIPOS_COBRO_PAGO = ['', 'Cobro', 'Pago']
  const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  // No necesitamos cargar Google Maps JS, solo usamos la API HTTP

  const [form, setForm] = useState(initialOrder)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]) // Fecha de hoy por defecto
  const [sortBy, setSortBy] = useState('hora_ini') // Ordenar por hora por defecto
  const [activeTab, setActiveTab] = useState('agregar')
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [bikers, setBikers] = useState([])
  const [bikersData, setBikersData] = useState([])
  const [notification, setNotification] = useState(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
  const [precioEditadoManualmente, setPrecioEditadoManualmente] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [deliveryModal, setDeliveryModal] = useState({ show: false, order: null })
  const [cancelModal, setCancelModal] = useState({ show: false, order: null })
  const [editModal, setEditModal] = useState({ show: false, order: null })
  // Nuevos estados para manejar entrada manual de direcciones
  const [recojoManual, setRecojoManual] = useState(false)
  const [entregaManual, setEntregaManual] = useState(false)
  const SHEET_URL = import.meta.env.VITE_SHEET_WRITE_URL || ''
  const SHEET_TOKEN = import.meta.env.VITE_SHEET_API_KEY || ''

  const operadorDefault = useMemo(() => {
    const u = localStorage.getItem('auth.user') || ''
    return OPERADORES.includes(u) ? u : OPERADORES[0]
  }, [])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('orders.list') || '[]')
      setOrders(stored)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('orders.list', JSON.stringify(orders))
    } catch {}
  }, [orders])

  useEffect(() => {
    setForm((f) => ({ ...f, operador: operadorDefault }))
  }, [operadorDefault])

  // Función para detectar automáticamente el modo de entrada basado en el valor actual
  const detectInputMode = (value) => {
    if (!value) return false
    // Si el valor no está en la lista de empresas, asumir que es entrada manual
    return !empresas.some(emp => emp.empresa === value)
  }

  // Detectar modo automáticamente cuando cambian los valores
  useEffect(() => {
    if (form.recojo) {
      const shouldBeManual = detectInputMode(form.recojo)
      if (shouldBeManual !== recojoManual) {
        setRecojoManual(shouldBeManual)
      }
    }
  }, [form.recojo, empresas])

  useEffect(() => {
    if (form.entrega) {
      const shouldBeManual = detectInputMode(form.entrega)
      if (shouldBeManual !== entregaManual) {
        setEntregaManual(shouldBeManual)
      }
    }
  }, [form.entrega, empresas])

  // Auto-ocultar notificaciones después de 3 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Limpiar estados de modo manual cuando se cambie de pestaña
  useEffect(() => {
    if (activeTab !== 'agregar') {
      setRecojoManual(false)
      setEntregaManual(false)
    }
  }, [activeTab])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const handleDeliveryComplete = async (deliveryData) => {
    try {
      const { order } = deliveryModal
      
      // Preservar todos los campos originales y actualizar solo los modificados
      const updatedOrder = { 
        ...order, // Mantener todos los campos originales
        estado: 'Entregado',
        // Actualizar solo los campos que se pueden editar en el modal
        cliente: deliveryData.cliente || order.cliente,
        recojo: deliveryData.recojo || order.recojo,
        entrega: deliveryData.entrega || order.entrega,
        biker: deliveryData.biker || order.biker,
        precio_bs: deliveryData.precio_bs || order.precio_bs,
        distancia_km: deliveryData.distancia_km || order.distancia_km,
        medio_transporte: deliveryData.medio_transporte || order.medio_transporte,
        hora_ini: deliveryData.hora_ini || order.hora_ini,
        hora_fin: deliveryData.hora_fin, // Este es nuevo, no tiene fallback
        observaciones: deliveryData.observaciones || order.observaciones
      }
      
      showNotification(`🔄 Completando entrega del pedido #${order.id}...`, 'success')
      
      console.log('📤 Datos del pedido que se enviarán al sheet:', updatedOrder)
      
      // Actualizar localmente
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === order.id ? updatedOrder : o
        )
      )
      
      // Actualizar en Google Sheet
      try {
        const response = await fetch(import.meta.env.VITE_SHEET_WRITE_URL || '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Respuesta del servidor:', result)
          showNotification(`✅ Pedido #${order.id} entregado exitosamente`, 'success')
        } else {
          throw new Error('Response not ok')
        }
      } catch (err) {
        console.error('Error updating sheet:', err)
        showNotification('⚠️ Entrega completada localmente (error en Google Sheet)', 'warning')
      }
      
      // Cerrar modal
      setDeliveryModal({ show: false, order: null })
      
    } catch (err) {
      console.error('Error completing delivery:', err)
      showNotification('❌ Error al completar entrega', 'error')
    }
  }

  const handleDeliveryCancel = () => {
    setDeliveryModal({ show: false, order: null })
    showNotification('❌ Entrega cancelada', 'info')
  }

  const handleOrderCancel = async (cancelData) => {
    try {
      const { order } = cancelModal
      
      // Preservar todos los campos originales y actualizar solo los modificados
      const updatedOrder = { 
        ...order, // Mantener todos los campos originales
        estado: 'Cancelado',
        detalles_carrera: cancelData.motivo || order.detalles_carrera
      }
      
      showNotification(`🔄 Cancelando pedido #${order.id}...`, 'success')
      
      console.log('📤 Datos del pedido cancelado que se enviarán al sheet:', updatedOrder)
      
      // Actualizar localmente
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === order.id ? updatedOrder : o
        )
      )
      
      // Actualizar en Google Sheet
      try {
        console.log('📤 Enviando pedido cancelado al sheet:', updatedOrder)
        const response = await fetch(import.meta.env.VITE_SHEET_WRITE_URL || '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Respuesta del servidor:', result)
          showNotification(`✅ Pedido #${order.id} cancelado exitosamente`, 'success')
        } else {
          throw new Error('Response not ok')
        }
      } catch (err) {
        console.error('Error updating sheet:', err)
        showNotification('⚠️ Cancelación completada localmente (error en Google Sheet)', 'warning')
      }
      
      // Cerrar modal
      setCancelModal({ show: false, order: null })
      
    } catch (err) {
      console.error('Error canceling order:', err)
      showNotification('❌ Error al cancelar pedido', 'error')
    }
  }

  const handleCancelModalClose = () => {
    setCancelModal({ show: false, order: null })
    showNotification('❌ Cancelación cancelada', 'info')
  }

  const handleOrderEdit = async (editData) => {
    try {
      const { order } = editModal
      
      // Actualizar el pedido con todos los datos editados
      const updatedOrder = { 
        ...order, // Mantener campos que no se editan
        ...editData // Sobrescribir con los datos editados
      }
      
      showNotification(`🔄 Actualizando pedido #${order.id}...`, 'success')
      
      console.log('📤 Datos del pedido editado que se enviarán al sheet:', updatedOrder)
      
      // Actualizar localmente
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === order.id ? updatedOrder : o
        )
      )
      
      // Actualizar en Google Sheet
      try {
        console.log('📤 Enviando pedido editado al sheet:', updatedOrder)
        const response = await fetch(import.meta.env.VITE_SHEET_WRITE_URL || '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder)
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Respuesta del servidor:', result)
          showNotification(`✅ Pedido #${order.id} actualizado exitosamente`, 'success')
        } else {
          throw new Error('Response not ok')
        }
      } catch (err) {
        console.error('Error updating sheet:', err)
        showNotification('⚠️ Actualización completada localmente (error en Google Sheet)', 'warning')
      }
      
      // Cerrar modal
      setEditModal({ show: false, order: null })
      
    } catch (err) {
      console.error('Error editing order:', err)
      showNotification('❌ Error al actualizar pedido', 'error')
    }
  }

  const handleEditModalClose = () => {
    setEditModal({ show: false, order: null })
    showNotification('❌ Edición cancelada', 'info')
  }

  // Drag & Drop functions
  const handleDragStart = (e, order) => {
    e.dataTransfer.setData('application/json', JSON.stringify(order))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newEstado) => {
    e.preventDefault()
    
    try {
      const orderData = JSON.parse(e.dataTransfer.getData('application/json'))
      
      if (orderData.estado === newEstado) return // No cambiar si es el mismo estado
      
      // Si se mueve a "Entregado", abrir modal para completar información
      if (newEstado === 'Entregado') {
        setDeliveryModal({ show: true, order: orderData })
        return
      }
      
      // Si se mueve a "Cancelado", abrir modal para especificar motivo
      if (newEstado === 'Cancelado') {
        setCancelModal({ show: true, order: orderData })
        return
      }
      
      showNotification(`🔄 Actualizando estado a ${newEstado}...`, 'success')
      
      // Actualizar localmente
      const updatedOrder = { ...orderData, estado: newEstado }
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderData.id ? updatedOrder : order
        )
      )
      
      // Actualizar en Google Sheet
      try {
        const response = await fetch(import.meta.env.VITE_SHEET_WRITE_URL || '', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder)
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.updated) {
            showNotification(`✅ Pedido #${orderData.id} actualizado a ${newEstado}`, 'success')
          } else {
            showNotification(`✅ Pedido #${orderData.id} movido a ${newEstado}`, 'success')
          }
        } else {
          throw new Error('Response not ok')
        }
      } catch (err) {
        console.error('Error updating sheet:', err)
        showNotification('⚠️ Estado actualizado localmente (error en Google Sheet)', 'warning')
      }
      
    } catch (err) {
      console.error('Error in drop:', err)
      showNotification('❌ Error al actualizar estado', 'error')
    }
  }

  // Auto-sync cuando se cambie a la pestaña "Ver pedidos" (solo si no hay datos)
  useEffect(() => {
    if (activeTab === 'ver' && !dataLoaded) {
      handleSyncFromSheet()
    }
  }, [activeTab, dataLoaded])

  // Cargar clientes y bikers al montar el componente
  useEffect(() => {
    loadClientes()
    loadBikers()
  }, [])

  const loadClientes = async () => {
    try {
      const csvUrl = import.meta.env.VITE_EMPRESAS_CSV_URL || import.meta.env.VITE_CLIENTES_CSV_URL
      if (!csvUrl) return
      
      showNotification('🔄 Cargando clientes...', 'success')
      
      const res = await fetch(csvUrl, { cache: 'no-store' })
      if (!res.ok) return
      
      const csvText = await res.text()
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true })
      
      // Cargar empresas con sus mapas para Recojo/Entrega
      const empresasData = parsed.data
        .filter(row => row.Empresa?.trim() && row.Mapa?.trim())
        .map(row => ({
          empresa: row.Empresa.trim(),
          mapa: row.Mapa.trim(),
          descripcion: row.Descripción?.trim() || ''
        }))
      
      setEmpresas(empresasData)
      
      // Cargar solo nombres de empresas para Cliente
      const empresasNombres = parsed.data
        .map(row => row.Empresa?.trim())
        .filter(empresa => empresa && empresa.length > 0)
        .sort()
      
      setClientes([...new Set(empresasNombres)]) // Remover duplicados
      showNotification(`👥 ${empresasNombres.length} clientes cargados`, 'success')
    } catch (error) {
      console.error('Error cargando clientes:', error)
    }
  }

  const loadBikers = async () => {
    try {
      // Intentar cargar desde CSV si existe la variable de entorno
      const csvUrl = import.meta.env.VITE_BIKERS_CSV_URL
      if (csvUrl) {
        showNotification('🔄 Cargando bikers desde CSV...', 'success')
        
        const res = await fetch(csvUrl, { cache: 'no-store' })
        if (res.ok) {
          const csvText = await res.text()
          const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true })
          
          // Guardar datos completos de bikers (nombre + WhatsApp)
          const bikersCompleteData = parsed.data
            .filter(row => row.Biker?.trim() && row.Whatsapp?.trim())
            .map(row => ({
              name: row.Biker.trim(),
              whatsapp: row.Whatsapp.trim()
            }))
          
          setBikersData(bikersCompleteData)
          
          // Extraer solo nombres para el dropdown
          const bikersList = bikersCompleteData.map(biker => biker.name).sort()
          
          setBikers(bikersList)
          showNotification(`🚴‍♂️ ${bikersList.length} bikers cargados desde CSV`, 'success')
          return
        }
      }
      
      // Si no hay CSV, usar lista por defecto
      const defaultBikers = [
        'Juan Pérez',
        'María García', 
        'Carlos López',
        'Ana Rodríguez',
        'Luis Martínez',
        'Carmen Sánchez',
        'Roberto Torres',
        'Elena Morales',
        'Diego Jiménez',
        'Sofia Herrera'
      ]
      
      setBikers(defaultBikers)
      setBikersData([]) // Sin datos de WhatsApp para lista por defecto
      showNotification(`🚴‍♂️ ${defaultBikers.length} bikers cargados (lista por defecto)`, 'success')
      
    } catch (error) {
      console.error('Error cargando bikers:', error)
      
      // En caso de error, usar lista por defecto
      const defaultBikers = [
        'Juan Pérez',
        'María García',
        'Carlos López', 
        'Ana Rodríguez',
        'Luis Martínez',
        'Carmen Sánchez',
        'Roberto Torres',
        'Elena Morales',
        'Diego Jiménez',
        'Sofia Herrera'
      ]
      
      setBikers(defaultBikers)
      setBikersData([]) // Sin datos de WhatsApp para lista por defecto
      showNotification(`🚴‍♂️ ${defaultBikers.length} bikers cargados (lista por defecto)`, 'success')
    }
  }

  const getEmpresaMapa = (nombreEmpresa) => {
    const empresa = empresas.find(e => e.empresa === nombreEmpresa)
    return empresa ? empresa.mapa : ''
  }

  const getClienteInfo = (nombreCliente) => {
    if (!nombreCliente) return 'Otros - Sin teléfono'
    
    const empresaInfo = empresas.find(emp => emp.empresa === nombreCliente)
    if (empresaInfo && empresaInfo.descripcion) {
      return empresaInfo.descripcion
    }
    
    // Fallback si no se encuentra la empresa
    return `${nombreCliente} - Sin teléfono`
  }

  // Función para generar enlace de Google Maps desde una dirección
  const generateGoogleMapsLink = (address) => {
    if (!address || address.trim() === '') return ''
    
    // Si ya es un enlace de Google Maps, devolverlo tal como está
    if (address.includes('maps.google.com') || address.includes('goo.gl/maps')) {
      return address
    }
    
    // Generar enlace de Google Maps desde la dirección
    const encodedAddress = encodeURIComponent(address.trim())
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
  }

  // Función para manejar cambio entre modo dropdown y manual
  const handleRecojoModeChange = (isManual) => {
    setRecojoManual(isManual)
    if (isManual) {
      // Cambiar a modo manual: limpiar selección y permitir entrada libre
      setForm(prev => ({ 
        ...prev, 
        recojo: '',
        direccion_recojo: ''
      }))
    } else {
      // Cambiar a modo dropdown: limpiar entrada manual
      setForm(prev => ({ 
        ...prev, 
        recojo: '',
        direccion_recojo: ''
      }))
    }
  }

  const handleEntregaModeChange = (isManual) => {
    setEntregaManual(isManual)
    if (isManual) {
      // Cambiar a modo manual: limpiar selección y permitir entrada libre
      setForm(prev => ({ 
        ...prev, 
        entrega: '',
        direccion_entrega: ''
      }))
    } else {
      // Cambiar a modo dropdown: limpiar entrada manual
      setForm(prev => ({ 
        ...prev, 
        entrega: '',
        direccion_entrega: ''
      }))
    }
  }

  // Función para manejar cambio de dirección manual
  const handleManualAddressChange = (type, value) => {
    if (type === 'recojo') {
      setForm(prev => ({ 
        ...prev, 
        recojo: value,
        direccion_recojo: generateGoogleMapsLink(value)
      }))
    } else if (type === 'entrega') {
      setForm(prev => ({ 
        ...prev, 
        entrega: value,
        direccion_entrega: generateGoogleMapsLink(value)
      }))
    }
  }

  // Función para detectar si el valor actual es un enlace de Google Maps
  const isGoogleMapsLink = (value) => {
    return value && (value.includes('maps.google.com') || value.includes('goo.gl/maps'))
  }

  // Función para generar enlace automáticamente cuando se escribe una dirección
  const handleAddressChange = (type, value) => {
    if (type === 'recojo') {
      setForm(prev => ({ 
        ...prev, 
        recojo: value
      }))
      // Generar enlace automáticamente si no es un enlace y no hay uno ya
      if (!isGoogleMapsLink(value) && value.trim() !== '') {
        const mapsLink = generateGoogleMapsLink(value)
        setForm(prev => ({ 
          ...prev, 
          direccion_recojo: mapsLink
        }))
        console.log(`📍 Recojo manual (dirección): ${value}`)
        console.log(`📍 Dirección recojo generada: ${mapsLink}`)
      }
    } else if (type === 'entrega') {
      setForm(prev => ({ 
        ...prev, 
        entrega: value
      }))
      // Generar enlace automáticamente si no es un enlace y no hay uno ya
      if (!isGoogleMapsLink(value) && value.trim() !== '') {
        const mapsLink = generateGoogleMapsLink(value)
        setForm(prev => ({ 
          ...prev, 
          direccion_entrega: mapsLink
        }))
        console.log(`📍 Entrega manual (dirección): ${value}`)
        console.log(`📍 Dirección entrega generada: ${mapsLink}`)
      }
    }
  }

  // Función para calcular distancia usando el proxy del backend
  // Función para calcular el precio basado en distancia y medio de transporte
  const calculatePrice = (distance, medioTransporte) => {
    if (!distance || distance === '' || isNaN(parseFloat(distance))) {
      return 0
    }
    
    const dist = parseFloat(distance)
    let basePrice = 0
    
    // Esquema de precios para Bicicleta (COSTOS TRANSPARENTES)
    if (medioTransporte === 'Bicicleta') {
      if (dist <= 1) {
        basePrice = 8
      } else if (dist <= 2) {
        basePrice = 10
      } else if (dist <= 3) {
        basePrice = 12
      } else if (dist <= 4) {
        basePrice = 14
      } else if (dist <= 5) {
        basePrice = 16
      } else if (dist <= 6) {
        basePrice = 18
      } else if (dist <= 7) {
        basePrice = 20
      } else if (dist <= 8) {
        basePrice = 22
      } else if (dist <= 9) {
        basePrice = 24
      } else if (dist <= 10) {
        basePrice = 26
      } else {
        // Para distancias mayores a 10km: 26 Bs + 2 Bs por km adicional
        const kmAdicionales = Math.ceil(dist - 10)
        basePrice = 26 + (kmAdicionales * 2)
      }
    } 
    // Esquema de precios para BeeZero (inicia en 10 Bs)
    else if (medioTransporte === 'Beezero') {
      if (dist <= 1) {
        basePrice = 10
      } else if (dist <= 2) {
        basePrice = 12
      } else if (dist <= 3) {
        basePrice = 14
      } else if (dist <= 4) {
        basePrice = 16
      } else if (dist <= 5) {
        basePrice = 18
      } else if (dist <= 6) {
        basePrice = 20
      } else if (dist <= 7) {
        basePrice = 22
      } else if (dist <= 8) {
        basePrice = 24
      } else if (dist <= 9) {
        basePrice = 26
      } else if (dist <= 10) {
        basePrice = 28
      } else {
        // Para distancias mayores a 10km: 28 Bs + 2 Bs por km adicional
        const kmAdicionales = Math.ceil(dist - 10)
        basePrice = 28 + (kmAdicionales * 2)
      }
    } else {
      // Esquema anterior para otros medios de transporte (Cargo, Scooter)
      if (dist <= 1) {
        basePrice = 6
      } else {
        const floorDist = Math.floor(dist)
        const remainder = dist % 1
        
        if (remainder === 0) {
          // Distancia exacta (sin decimales)
          basePrice = floorDist * 2 + 4
        } else {
          // Distancia con decimales
          basePrice = floorDist * 2 + 6
        }
      }
      
      // Agregar costo adicional para Cargo
      let additionalCost = 0
      if (dist > 0 && medioTransporte === 'Cargo') {
        additionalCost = 6
      }
      basePrice += additionalCost
    }
    
    console.log(`💰 Precio calculado: Distancia=${dist}km, Medio=${medioTransporte}, Precio=${basePrice} Bs`)
    
    return basePrice
  }

  const calculateDistance = async (origin, destination) => {
    if (!origin || !destination) {
      console.log('⚠️ Origen o destino faltante')
      return null
    }
    
    try {
      console.log('🔍 Calculando distancia entre:', { origin, destination })
      
      // Usar el proxy del backend
      const baseUrl = import.meta.env.VITE_SHEET_WRITE_URL?.replace('/api/orders', '') || 'http://localhost:5055'
      const proxyUrl = `${baseUrl}/api/distance-proxy?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}`
      
      console.log('📡 Llamando a proxy de distancia:', proxyUrl)
      
      const response = await fetch(proxyUrl)
      
      if (!response.ok) {
        console.error('❌ Error HTTP:', response.status, response.statusText)
        return null
      }
      
      const data = await response.json()
      console.log('📊 Respuesta completa:', data)
      
      // Verificar errores en la respuesta
      if (data.error) {
        console.error('❌ Error del backend:', data.error)
        return null
      }
      
      if (data.status === 'OK' && data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0]) {
        const element = data.rows[0].elements[0]
        
        if (element.status === 'OK' && element.distance) {
          const distanceKm = (element.distance.value / 1000).toFixed(2)
          const duration = element.duration ? element.duration.text : ''
          console.log(`✅ Distancia calculada: ${distanceKm} km (${duration})`)
          return distanceKm
        } else {
          console.warn('⚠️ Element status:', element.status)
          return null
        }
      } else {
        console.warn('⚠️ API status:', data.status)
        if (data.error_message) {
          console.warn('⚠️ Error message:', data.error_message)
        }
        return null
      }
    } catch (error) {
      console.error('❌ Error calculando distancia:', error)
      return null
    }
  }

  // Función separada para calcular distancia y precio
  const calculateDistanceAndPrice = async (direccionRecojo, direccionEntrega, medioTransporte) => {
    if (!direccionRecojo || !direccionEntrega) {
      console.log('⏳ Esperando ambas direcciones...', {
        recojo: !!direccionRecojo,
        entrega: !!direccionEntrega
      })
      return
    }

    // Evitar cálculos múltiples simultáneos
    if (isCalculatingDistance) {
      console.log('⏸️ Ya hay un cálculo en progreso, ignorando...')
      return
    }

    setIsCalculatingDistance(true)
    console.log('🚀 Iniciando cálculo de distancia...')
    console.log('📍 Direcciones:', {
      recojo: direccionRecojo,
      entrega: direccionEntrega
    })
    
    showNotification('🔄 Calculando distancia...', 'success')
    try {
      const distance = await calculateDistance(direccionRecojo, direccionEntrega)
      console.log('📏 Resultado del cálculo:', distance)
      
      if (distance) {
        // Calcular precio solo si tenemos medio de transporte y no es Cuenta
        if (medioTransporte && medioTransporte.trim() !== '') {
          // Verificar si el método de pago actual es Cuenta
          const metodoPagoActual = form.metodo_pago || 'Efectivo'
          
          // Siempre calcular el precio para guardarlo en el sheet
          const precio = calculatePrice(distance, medioTransporte)
          
          if (metodoPagoActual === 'Cuenta') {
            // Para "Cuenta", guardar el precio calculado pero mostrar "Cuenta del cliente"
            setForm((prev) => ({ 
              ...prev, 
              distancia_km: distance,
              precio_bs: precio // Guardar el precio real en el sheet
            }))
            showNotification(`📏 Distancia: ${distance} km • 💳 Precio calculado: ${precio} Bs (Cuenta del cliente)`, 'success')
          } else {
            setForm((prev) => ({ 
              ...prev, 
              distancia_km: distance,
              precio_bs: precio 
            }))
            showNotification(`📏 Distancia: ${distance} km • 💰 Precio: ${precio} Bs`, 'success')
          }
        } else {
          // Solo actualizar distancia
          setForm((prev) => ({ 
            ...prev, 
            distancia_km: distance
          }))
          showNotification(`📏 Distancia calculada: ${distance} km`, 'success')
        }
      } else {
        console.warn('⚠️ calculateDistance retornó null')
        showNotification('⚠️ No se pudo calcular la distancia. Revisa la consola para más detalles.', 'warning')
      }
    } catch (error) {
      console.error('❌ Error calculando distancia:', error)
      showNotification(`❌ Error al calcular distancia: ${error.message}`, 'error')
    } finally {
      setIsCalculatingDistance(false)
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target
    let updatedForm = { [name]: value }
    
    // Auto-llenar direcciones con URLs de Maps (solo para modo dropdown)
    if (name === 'recojo' && !recojoManual) {
      const empresaMapa = getEmpresaMapa(value) || ''
      updatedForm.direccion_recojo = empresaMapa
      console.log(`🏢 Recojo empresa: ${value}`)
      console.log(`📍 Dirección recojo empresa: ${empresaMapa}`)
    } else if (name === 'entrega' && !entregaManual) {
      const empresaMapa = getEmpresaMapa(value) || ''
      updatedForm.direccion_entrega = empresaMapa
      console.log(`🏢 Entrega empresa: ${value}`)
      console.log(`📍 Dirección entrega empresa: ${empresaMapa}`)
    }
    
    // Auto-calcular día de la semana cuando cambie la fecha
    if (name === 'fecha' && value) {
      const fecha = new Date(value)
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const diaSemana = diasSemana[fecha.getDay()]
      updatedForm.dia_semana = diaSemana
    }
    
    // Auto-completar WhatsApp cuando se seleccione un biker
    if (name === 'biker') {
      if (value) {
        const selectedBiker = bikersData.find(biker => biker.name === value)
        if (selectedBiker && selectedBiker.whatsapp) {
          updatedForm.whatsapp = selectedBiker.whatsapp
          console.log(`📱 WhatsApp auto-completado para ${value}: ${selectedBiker.whatsapp}`)
        }
      } else {
        // Limpiar WhatsApp si se deselecciona el biker
        updatedForm.whatsapp = ''
        console.log('🧹 WhatsApp limpiado al deseleccionar biker')
      }
    }
    
    // Detectar cuando el usuario edita manualmente el precio
    if (name === 'precio_bs') {
      setPrecioEditadoManualmente(true)
      console.log('✏️ Precio editado manualmente por el usuario')
      
      // Si es modo "Cuenta", mostrar notificación especial
      if (form.metodo_pago === 'Cuenta') {
        showNotification('✏️ Precio editado manualmente (Cuenta del cliente)', 'info')
      }
    }
    
    // Actualizar el formulario primero
    setForm((prev) => ({ ...prev, ...updatedForm }))
    
    // Remover clase de error si el campo ahora tiene valor
    if (value && value.trim() !== '') {
      e.target.classList.remove('field-required')
    }
    
    // Limpiar monto si se deselecciona cobro/pago
    if (name === 'cobro_pago' && (!value || value.trim() === '')) {
      updatedForm.monto_cobro_pago = ''
    }
    
    const newForm = { ...form, ...updatedForm }
    
    // Solo recalcular distancia y precio si cambió algo relevante
    const shouldRecalculate = name === 'recojo' || name === 'entrega' || name === 'medio_transporte' || name === 'metodo_pago'
    
    if (shouldRecalculate) {
      // Verificar condiciones para cálculos
      const tieneRecojo = newForm.direccion_recojo && newForm.direccion_recojo.trim() !== ''
      const tieneEntrega = newForm.direccion_entrega && newForm.direccion_entrega.trim() !== ''
      const tieneMedioTransporte = newForm.medio_transporte && newForm.medio_transporte.trim() !== ''
      
      console.log('🔍 Verificando condiciones para cálculo:', {
        tieneRecojo,
        tieneEntrega, 
        tieneMedioTransporte,
        direccionRecojo: newForm.direccion_recojo,
        direccionEntrega: newForm.direccion_entrega,
        medioTransporte: newForm.medio_transporte
      })
      
      // CALCULAR DISTANCIA: Solo necesita recojo y entrega
      if (tieneRecojo && tieneEntrega && (name === 'recojo' || name === 'entrega')) {
        console.log('📏 Calculando distancia automáticamente...')
        await calculateDistanceAndPrice(newForm.direccion_recojo, newForm.direccion_entrega, newForm.medio_transporte)
      }
      
      // MANEJAR CAMBIO DE MÉTODO DE PAGO
      else if (name === 'metodo_pago') {
        if (value === 'Cuenta') {
          console.log('💳 Método cambiado a Cuenta: Calculando precio para el sheet')
          if (form.distancia_km && form.medio_transporte) {
            const precio = calculatePrice(form.distancia_km, form.medio_transporte)
            setForm((prev) => ({ ...prev, precio_bs: precio }))
            setPrecioEditadoManualmente(false) // Resetear flag
            showNotification(`💳 Precio calculado: ${precio} Bs (Cuenta del cliente)`, 'success')
          } else {
            setForm((prev) => ({ ...prev, precio_bs: 0 }))
            setPrecioEditadoManualmente(false) // Resetear flag
            showNotification('💳 Método: Cuenta del cliente (precio: 0 Bs)', 'success')
          }
        } else if (form.distancia_km && form.medio_transporte && !precioEditadoManualmente) {
          console.log('💰 Método cambiado: Recalculando precio')
          const precio = calculatePrice(form.distancia_km, form.medio_transporte)
          setForm((prev) => ({ ...prev, precio_bs: precio }))
          showNotification(`💰 Precio actualizado: ${precio} Bs`, 'success')
        } else if (precioEditadoManualmente) {
          console.log('✏️ Precio editado manualmente: No se recalcula automáticamente')
          showNotification('✏️ Precio editado manualmente: No se recalcula automáticamente', 'info')
        }
      }
      
      // CALCULAR PRECIO: Necesita distancia + medio de transporte (excepto si es Cuenta)
      else if (name === 'medio_transporte' && form.distancia_km && tieneMedioTransporte) {
        if (newForm.metodo_pago === 'Cuenta') {
          console.log('💳 Método Cuenta: Calculando precio para el sheet')
          const precio = calculatePrice(form.distancia_km, value)
          setForm((prev) => ({ ...prev, precio_bs: precio }))
          setPrecioEditadoManualmente(false) // Resetear flag
          showNotification(`💳 Precio calculado: ${precio} Bs (Cuenta del cliente)`, 'success')
        } else if (!precioEditadoManualmente) {
          console.log('💰 Recalculando solo el precio...')
          const precio = calculatePrice(form.distancia_km, value)
          setForm((prev) => ({ ...prev, precio_bs: precio }))
          showNotification(`💰 Precio actualizado: ${precio} Bs`, 'success')
        } else {
          console.log('✏️ Precio editado manualmente: No se recalcula automáticamente')
          showNotification('✏️ Precio editado manualmente: No se recalcula automáticamente', 'info')
        }
      }
      
      // LIMPIAR si se quitan datos necesarios
      else if (name === 'recojo' || name === 'entrega') {
        if (!tieneRecojo || !tieneEntrega) {
          console.log('🧹 Limpiando distancia y precio por falta de ubicaciones')
          setForm((prev) => ({ 
            ...prev, 
            distancia_km: '',
            precio_bs: '' 
          }))
          setPrecioEditadoManualmente(false) // Resetear flag
        }
      }
      else if (name === 'medio_transporte' && !tieneMedioTransporte) {
        console.log('🧹 Limpiando precio por falta de medio de transporte')
        setForm((prev) => ({ 
          ...prev, 
          precio_bs: '' 
        }))
        setPrecioEditadoManualmente(false) // Resetear flag
      }
    }
  }

  const saveToSheet = async (order) => {
    if (!SHEET_URL) return
    const res = await fetch(SHEET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SHEET_TOKEN ? { 'X-API-KEY': SHEET_TOKEN } : {})
      },
      body: JSON.stringify(order)
    })
    if (!res.ok) throw new Error('Fallo al guardar en Google Sheet')
  }

  const getNextId = async () => {
    try {
      // Primero intentar obtener IDs desde Google Sheet
      const csvUrl = import.meta.env.VITE_SHEET_CSV_URL
      if (csvUrl) {
        console.log('🔍 Obteniendo IDs desde Google Sheet...')
        const res = await fetch(csvUrl, { cache: 'no-store' })
        if (res.ok) {
          const csvText = await res.text()
          const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true })
          
          // Buscar la columna ID de forma flexible
          const sheetIds = []
          parsed.data.forEach((row, idx) => {
            // Buscar por diferentes nombres de columna ID
            const idValue = row.id || row.Id || row.ID || row['id'] || 
                           Object.keys(row).find(key => key.toLowerCase().trim() === 'id')
            
            if (idValue !== undefined && idValue !== null && idValue !== '') {
              const numId = parseInt(String(idValue).trim())
              if (!isNaN(numId)) {
                sheetIds.push(numId)
              }
            }
          })
          
          console.log('📊 IDs encontrados en sheet:', sheetIds)
          
          if (sheetIds.length > 0) {
            const maxId = Math.max(...sheetIds)
            const nextId = maxId + 1
            console.log(`➡️ Próximo ID: ${nextId} (basado en máximo: ${maxId})`)
            return nextId
          }
        }
      }
      
      // Fallback: usar IDs locales
      console.log('⚠️ Usando IDs locales como fallback')
      const localIds = orders.map(o => parseInt(o.id) || 0).filter(id => !isNaN(id))
      const nextId = localIds.length > 0 ? Math.max(...localIds) + 1 : 1
      console.log('📍 Próximo ID local:', nextId)
      return nextId
    } catch (error) {
      console.error('❌ Error en getNextId:', error)
      // En caso de error, usar IDs locales
      const localIds = orders.map(o => parseInt(o.id) || 0).filter(id => !isNaN(id))
      return localIds.length > 0 ? Math.max(...localIds) + 1 : 1
    }
  }

  // Validar campos obligatorios
  const validateForm = () => {
    const errors = []
    const requiredFields = {
      cliente: 'Cliente',
      recojo: 'Punto de Recojo',
      entrega: 'Punto de Entrega',
      medio_transporte: 'Medio de Transporte',
      metodo_pago: 'Método de Pago',
      biker: 'Biker Asignado',
      fecha: 'Fecha del Pedido',
      estado: 'Estado del Pedido',
      estado_pago: 'Estado de Pago'
    }

    // Validar que si hay recojo/entrega, también debe haber dirección
    if (form.recojo && !form.direccion_recojo) {
      errors.push('El punto de recojo debe tener una dirección asociada')
    }
    if (form.entrega && !form.direccion_entrega) {
      errors.push('El punto de entrega debe tener una dirección asociada')
    }

    // Validar campos obligatorios básicos
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!form[field] || form[field].trim() === '') {
        errors.push(`${label} es obligatorio`)
      }
    }

    // Validaciones específicas
    // Removida la validación de fecha futura - ahora se permiten fechas futuras

    if (form.precio_bs && (isNaN(form.precio_bs) || parseFloat(form.precio_bs) < 0)) {
      errors.push('El precio debe ser un número mayor o igual a 0')
    }

    if (form.whatsapp && form.whatsapp.length > 0 && form.whatsapp.length < 8) {
      errors.push('El número de WhatsApp debe tener al menos 8 dígitos')
    }

    // Validar cobro/pago
    if (form.cobro_pago && form.cobro_pago.trim() !== '') {
      if (!form.monto_cobro_pago || form.monto_cobro_pago.trim() === '') {
        errors.push('Si seleccionas Cobro o Pago, debes especificar el monto')
      } else if (isNaN(parseFloat(form.monto_cobro_pago)) || parseFloat(form.monto_cobro_pago) <= 0) {
        errors.push('El monto de cobro/pago debe ser un número mayor a 0')
      }
    }

    return errors
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    
    // Validar formulario
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      // Mostrar errores de validación
      const errorMessage = `Por favor, corrija los siguientes errores:\n\n${validationErrors.map(error => `• ${error}`).join('\n')}`
      showNotification(errorMessage, 'error')
      
      // Hacer scroll al primer campo con error
      const firstErrorField = document.querySelector('.field-required')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstErrorField.focus()
      }
      return
    }
    
    // Mostrar notificación inmediatamente
    showNotification('🔄 Agregando pedido...', 'success')
    
    const now = new Date()
    
    // Formatear fecha directamente como DD/MM/YYYY para evitar problemas de conversión
    const dia = String(now.getDate()).padStart(2, '0')
    const mes = String(now.getMonth() + 1).padStart(2, '0')
    const año = now.getFullYear()
    const fechaRegistro = `${dia}/${mes}/${año}`
    
    // Formatear hora como HH:MM:SS (Google Sheets lo reconoce automáticamente)
    const horas = String(now.getHours()).padStart(2, '0')
    const minutos = String(now.getMinutes()).padStart(2, '0')
    const segundos = String(now.getSeconds()).padStart(2, '0')
    const horaRegistro = `${horas}:${minutos}:${segundos}`
    
    // Generar ID consecutivo basado en Google Sheet
    const nextId = await getNextId()
    
    const newOrder = { 
      id: nextId.toString(), 
      ...form,
      fecha_registro: fechaRegistro,
      hora_registro: horaRegistro
    }
    
    // Log de debug para verificar que ambos campos se envíen correctamente
    console.log('📤 Enviando pedido con datos de ubicación:')
    console.log('📍 Recojo:', newOrder.recojo)
    console.log('📍 Dirección Recojo:', newOrder.direccion_recojo)
    console.log('📍 Entrega:', newOrder.entrega)
    console.log('📍 Dirección Entrega:', newOrder.direccion_entrega)
    setOrders([newOrder, ...orders])
    setForm({ ...initialOrder, operador: operadorDefault })
    setPrecioEditadoManualmente(false)
    // Resetear modos manuales
    setRecojoManual(false)
    setEntregaManual(false)
    
    try {
      await saveToSheet(newOrder)
      showNotification('✅ Pedido agregado exitosamente', 'success')
      
      // Cambiar automáticamente a la pestaña "Ver pedidos" después de agregar
      setTimeout(() => {
        setActiveTab('ver')
        // Asegurar que el filtro de fecha esté en la fecha del pedido agregado
        if (form.fecha) {
          const orderDate = new Date(form.fecha).toISOString().split('T')[0]
          setDateFilter(orderDate)
        }
      }, 1000) // Pequeño delay para que se vea la notificación
      
    } catch (err) {
      console.error(err)
      showNotification('⚠️ Pedido guardado localmente (error en Google Sheet)', 'warning')
    }
  }

  // Función para generar URL de WhatsApp
  const generateWhatsAppURL = (order) => {
    // Obtener el número de WhatsApp del biker asignado
    let phoneNumber = '59169499202' // Número por defecto si no hay biker
    
    if (order.biker) {
      const selectedBiker = bikersData.find(biker => biker.name === order.biker)
      if (selectedBiker && selectedBiker.whatsapp) {
        // Limpiar el número de WhatsApp (remover espacios, guiones, etc.)
        phoneNumber = selectedBiker.whatsapp.replace(/[\s\-\(\)]/g, '')
        console.log(`📱 Enviando WhatsApp al biker ${order.biker}: ${phoneNumber}`)
      } else {
        console.warn(`⚠️ Biker ${order.biker} no tiene WhatsApp configurado`)
      }
    } else {
      console.warn('⚠️ No hay biker asignado para enviar WhatsApp')
    }
    
    // Construir el mensaje siguiendo el formato de tu spreadsheet
    // Obtener información completa del cliente desde empresas
    const clienteConDetalle = getClienteInfo(order.cliente)
    console.log(`📋 Información completa del cliente: ${clienteConDetalle}`)
    
    const recojo = order.recojo || 'Sin especificar'
    const direccionRecojo = order.direccion_recojo || 'Sin dirección'
    
    // Formatear el recojo correctamente
    let recojoCompleto = recojo
    if (direccionRecojo && direccionRecojo !== 'Sin dirección') {
      if (direccionRecojo.includes('http')) {
        // Si la dirección incluye un link, usar el formato: NOMBRE: DESCRIPCIÓN link
        recojoCompleto = `${recojo}: ${direccionRecojo}`
      } else {
        recojoCompleto = `${recojo}: ${direccionRecojo}`
      }
    }
    
    const entrega = order.entrega || 'Sin especificar'
    const direccionEntrega = order.direccion_entrega || ''
    
    // Formatear la entrega
    let entregaCompleta = entrega
    if (direccionEntrega && direccionEntrega.includes('http')) {
      entregaCompleta = `${entrega}: ${direccionEntrega}`
    }
    
    const infoExtra = order.detalles_carrera || ''
    const metodoPago = order.metodo_pago || 'Efectivo'
    
    // Construir el mensaje base
    let mensaje = `*CLIENTE:* ${clienteConDetalle}

*Recoger:* ${recojoCompleto}

*Entrega:* ${entregaCompleta}

*Info Extra:* ${infoExtra}

*Carrera:* `
    
    // Agregar precio y método de pago según el tipo
    console.log('🔍 Debug WhatsApp - Método de pago:', metodoPago)
    console.log('🔍 Debug WhatsApp - Precio:', order.precio_bs)
    
    if (metodoPago === 'Cuenta' || metodoPago === 'cuenta' || metodoPago.toLowerCase() === 'cuenta') {
      // Para "Cuenta", solo mostrar el método sin precio
      mensaje += `${metodoPago}`
      console.log('💳 WhatsApp: Solo método de pago (Cuenta)')
    } else if (order.precio_bs) {
      // Para otros métodos, mostrar precio y método
      mensaje += `${order.precio_bs}Bs    *${metodoPago}*`
      console.log('💰 WhatsApp: Precio + método de pago')
    } else {
      // Si no hay precio, solo mostrar método
      mensaje += `${metodoPago}`
      console.log('📝 WhatsApp: Solo método de pago')
    }
    
    // Codificar el mensaje para URL
    console.log('📱 Mensaje WhatsApp final:', mensaje)
    const mensajeCodificado = encodeURIComponent(mensaje)
    
    // Generar la URL completa
    const whatsappURL = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${mensajeCodificado}`
    
    return whatsappURL
  }

  const normalize = (s) => String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '')

  const headerMap = {
    fecha: 'fecha', fechas: 'fecha',
    fecharegistro: 'fecha_registro',
    horaregistro: 'hora_registro',
    operador: 'operador',
    cliente: 'cliente',
    recojo: 'recojo',
    entrega: 'entrega',
    direccionrecojo: 'direccion_recojo', direcciondelrecojo: 'direccion_recojo', direccionderecojo: 'direccion_recojo',
    direccionentrega: 'direccion_entrega', direcciondeentrega: 'direccion_entrega',
    detallescarrera: 'detalles_carrera', detallesdelacarrera: 'detalles_carrera',
    distanciakm: 'distancia_km', distkm: 'distancia_km', distancia: 'distancia_km',
    mediotransporte: 'medio_transporte', transporte: 'medio_transporte',
    preciobs: 'precio_bs', precio: 'precio_bs',
    estadopago: 'estado_pago',
    bikers: 'biker', biker: 'biker',
    whatsapp: 'whatsapp',
    horaini: 'hora_ini', horainicio: 'hora_ini',
    horafin: 'hora_fin',
    duracion: 'duracion',
    estado: 'estado',
    estadodepago: 'estado_pago_detalle',
    observaciones: 'observaciones',
    pagobiker: 'pago_biker',
    contactobiker: 'contacto_biker',
    linkcontactobiker: 'link_contacto_biker', linkdecontactobiker: 'link_contacto_biker',
    diadelasem: 'dia_semana', diadelasemana: 'dia_semana',
    cobropago: 'cobro_pago', cobroopago: 'cobro_pago',
    montocobropago: 'monto_cobro_pago', montocobroopago: 'monto_cobro_pago'
  }

  const mapRowToOrder = (rowObj, index = 0) => {
    const mapped = { id: index.toString(), ...initialOrder }
    const entries = Object.entries(rowObj || {})
    for (const [k, v] of entries) {
      if (k.toLowerCase() === 'id') {
        // Si viene un ID del sheet, usarlo, sino usar el índice
        const sheetId = String(v ?? '').trim()
        mapped.id = sheetId && !isNaN(parseInt(sheetId)) ? sheetId : index.toString()
      } else {
        const key = headerMap[normalize(k)]
        if (key) mapped[key] = String(v ?? '').trim()
      }
    }
    if (!mapped.operador) mapped.operador = operadorDefault
    return mapped
  }



  const csvEscape = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }

  const handleExportCsv = () => {
    showNotification('📤 Exportando CSV...', 'success')
    const cols = ['id', ...Object.keys(initialOrder)]
    const header = cols.join(',')
    const lines = orders.map((o) => cols.map((c) => csvEscape(o[c])).join(','))
    const csv = '\ufeff' + [header, ...lines].join('\n') + '\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pedidos.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showNotification('📤 CSV exportado exitosamente', 'success')
  }

  const handleSyncFromSheet = async (forceRefresh = false) => {
    if (loading) return // Evitar múltiples llamadas simultáneas
    
    // Si ya hay datos cargados y no es un refresh forzado, no hacer nada
    if (dataLoaded && !forceRefresh && orders.length > 0) {
      showNotification('📊 Datos ya cargados. Usa "Actualizar" para refrescar.', 'info')
      return
    }
    
    showNotification('🔄 Sincronizando con Google Sheet...', 'success')
    
    try {
      setLoading(true)
      
      const url = import.meta.env.VITE_SHEET_CSV_URL || ''
      if (!url) {
        showNotification('❌ No hay URL de Google Sheet configurada', 'error')
        return
      }
      
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('No se pudo descargar el CSV')
      const text = await res.text()
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: 'greedy' })
      const rows = (parsed.data || []).filter(Boolean)
      const imported = rows.map((row, index) => mapRowToOrder(row, index))
      
      // Reemplazar completamente los pedidos
      setOrders(imported)
      setDataLoaded(true)
      showNotification(`📊 ${imported.length} pedidos sincronizados desde Google Sheet`, 'success')
    } catch (err) {
      console.error(err)
      showNotification('❌ Error al sincronizar con Google Sheet', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    let filtered = orders
    
    // Filtrar por fecha primero
    if (dateFilter) {
      filtered = filtered.filter((o) => {
        // Comparar la fecha del pedido con el filtro de fecha
        if (o.fecha) {
          // Convertir la fecha del pedido al formato YYYY-MM-DD para comparar
          const orderDate = new Date(o.fecha).toISOString().split('T')[0]
          return orderDate === dateFilter
        }
        return false
      })
    }
    
    // Luego filtrar por texto de búsqueda
    if (filter) {
      const q = filter.toLowerCase()
      filtered = filtered.filter((o) =>
        Object.values(o).some((v) => String(v || '').toLowerCase().includes(q))
      )
    }
    
    // Ordenar según el criterio seleccionado
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'hora_ini':
          // Ordenar por hora de inicio (más tempranos primero)
          if (a.hora_ini && b.hora_ini) {
            const timeA = a.hora_ini.split(':').map(Number)
            const timeB = b.hora_ini.split(':').map(Number)
            const minutesA = timeA[0] * 60 + timeA[1]
            const minutesB = timeB[0] * 60 + timeB[1]
            return minutesA - minutesB // Más temprano primero
          }
          if (a.hora_ini && !b.hora_ini) return -1
          if (!a.hora_ini && b.hora_ini) return 1
          return 0
          
        case 'hora':
          // Ordenar por hora de registro (más recientes primero)
          if (a.hora_registro && b.hora_registro) {
            const timeA = a.hora_registro.split(':').map(Number)
            const timeB = b.hora_registro.split(':').map(Number)
            const minutesA = timeA[0] * 60 + timeA[1] + timeA[2] / 60
            const minutesB = timeB[0] * 60 + timeB[1] + timeB[2] / 60
            return minutesB - minutesA // Más reciente primero
          }
          if (a.hora_registro && !b.hora_registro) return -1
          if (!a.hora_registro && b.hora_registro) return 1
          return 0
          
        case 'id':
          // Ordenar por ID (más reciente primero)
          const idA = parseInt(a.id) || 0
          const idB = parseInt(b.id) || 0
          return idB - idA
          
        case 'cliente':
          // Ordenar alfabéticamente por cliente
          const clienteA = (a.cliente || '').toLowerCase()
          const clienteB = (b.cliente || '').toLowerCase()
          return clienteA.localeCompare(clienteB)
          
        case 'biker':
          // Ordenar alfabéticamente por biker
          const bikerA = (a.biker || '').toLowerCase()
          const bikerB = (b.biker || '').toLowerCase()
          return bikerA.localeCompare(bikerB)
          
        default:
          return 0
      }
    })
    
    return filtered
  }, [orders, filter, dateFilter, sortBy])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'agregar':
        return (
          <section className="card">
            <h2>Nuevo Pedido</h2>
            
            {/* INFORMACIÓN SOBRE CAMPOS OBLIGATORIOS */}
            <div className="info-panel">
              <h4>📝 Campos Obligatorios</h4>
              <p>Los campos marcados con <span className="required">*</span> son obligatorios para crear el pedido.</p>
              <p><strong>Campos requeridos:</strong> Cliente, Punto de Recojo, Punto de Entrega, Medio de Transporte, Método de Pago, Biker Asignado, Fecha del Pedido y Hora Programada.</p>
              <p><strong>Nota:</strong> Si seleccionas "Cobro" o "Pago", el monto es obligatorio.</p>
            </div>
            
            <form className="form-organized" onSubmit={handleAdd}>
              
              {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
              <div className="form-section">
                <h3 className="section-title">📋 Información General</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Operador</label>
                    <select name="operador" value={form.operador} onChange={handleChange}>
                      <option value="">Seleccionar Operador</option>
                      {OPERADORES.map(op => (<option key={op} value={op}>{op}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cliente <span className="required">*</span></label>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <select 
                        name="cliente" 
                        value={form.cliente} 
                        onChange={handleChange} 
                        style={{flex: 1}}
                        className={!form.cliente ? 'field-required' : ''}
                        required
                      >
                        <option value="">Seleccionar cliente</option>
                        {clientes.map(cliente => (
                          <option key={cliente} value={cliente}>{cliente}</option>
                        ))}
                      </select>
                      <button type="button" className="btn-icon" onClick={loadClientes}>🔄</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: UBICACIONES */}
              <div className="form-section">
                <h3 className="section-title">
                  📍 Recojo y Entrega
                  {(recojoManual || entregaManual) && (
                    <span style={{fontSize: '14px', color: '#28a745', marginLeft: '8px'}}>
                      ✏️ Modo manual activo
                    </span>
                  )}
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Punto de Recojo <span className="required">*</span></label>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px'}}>
                      <button 
                        type="button" 
                        className={`btn-mode ${!recojoManual ? 'active' : ''}`}
                        onClick={() => handleRecojoModeChange(false)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: !recojoManual ? '#007bff' : '#f8f9fa',
                          color: !recojoManual ? 'white' : '#6c757d',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Empresas
                      </button>
                      <button 
                        type="button" 
                        className={`btn-mode ${recojoManual ? 'active' : ''}`}
                        onClick={() => handleRecojoModeChange(true)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: recojoManual ? '#28a745' : '#f8f9fa',
                          color: recojoManual ? 'white' : '#6c757d',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Manual
                      </button>
                    </div>
                    
                    {!recojoManual ? (
                      // Modo dropdown - selección de empresas
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        <select 
                          name="recojo" 
                          value={form.recojo} 
                          onChange={handleChange} 
                          style={{flex: 1}}
                          className={!form.recojo ? 'field-required' : ''}
                          required
                        >
                          <option value="">Seleccionar empresa</option>
                          {empresas.map((empresa, index) => (
                            <option key={`recojo-${index}-${empresa.empresa}`} value={empresa.empresa}>{empresa.empresa}</option>
                          ))}
                        </select>
                        {form.recojo && getEmpresaMapa(form.recojo) && (
                          <a href={getEmpresaMapa(form.recojo)} target="_blank" rel="noopener noreferrer" className="btn-maps" title={`Ver en Maps: ${form.recojo}`}>
                            📍 Maps
                          </a>
                        )}
                        {form.recojo && form.direccion_recojo && (
                          <span style={{fontSize: '12px', color: '#28a745', marginLeft: '4px'}} title="Dirección completa configurada">
                            ✅
                          </span>
                        )}
                      </div>
                    ) : (
                      // Modo manual - campos separados
                      <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}}>
                          <label style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block'}}>
                            📍 Dirección
                          </label>
                          <input 
                            type="text" 
                            value={form.recojo} 
                            onChange={(e) => handleAddressChange('recojo', e.target.value)}
                            placeholder="Ingresa la dirección de recojo..."
                            className={!form.recojo ? 'field-required' : ''}
                            required
                            style={{width: '100%'}}
                          />
                        </div>
                        <div style={{flex: 1}}>
                          <label style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block'}}>
                            🔗 Enlace Google Maps
                          </label>
                          <div style={{position: 'relative'}}>
                            <input 
                              type="url" 
                              value={form.direccion_recojo} 
                              onChange={(e) => setForm(prev => ({ ...prev, direccion_recojo: e.target.value }))}
                              placeholder="Pega aquí el enlace de Google Maps..."
                              className={!form.direccion_recojo ? 'field-required' : ''}
                              required
                              style={{width: '100%', paddingRight: '80px'}}
                            />
                            {form.direccion_recojo && (
                              <a href={form.direccion_recojo} target="_blank" rel="noopener noreferrer" className="btn-maps" title="Ver en Maps" style={{position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)'}}>
                                📍 Maps
                              </a>
                            )}
                            {form.recojo && !form.direccion_recojo && (
                              <button 
                                type="button" 
                                className="btn-maps" 
                                onClick={() => {
                                  const mapsLink = generateGoogleMapsLink(form.recojo)
                                  setForm(prev => ({ ...prev, direccion_recojo: mapsLink }))
                                  showNotification('📍 Enlace de Google Maps generado automáticamente', 'success')
                                }}
                                title="Generar enlace automáticamente"
                                style={{position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: '#28a745'}}
                              >
                                🔗 Generar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Punto de Entrega <span className="required">*</span></label>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px'}}>
                      <button 
                        type="button" 
                        className={`btn-mode ${!entregaManual ? 'active' : ''}`}
                        onClick={() => handleEntregaModeChange(false)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: !entregaManual ? '#007bff' : '#f8f9fa',
                          color: !entregaManual ? 'white' : '#6c757d',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        📋 Empresas
                      </button>
                      <button 
                        type="button" 
                        className={`btn-mode ${entregaManual ? 'active' : ''}`}
                        onClick={() => handleEntregaModeChange(true)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          backgroundColor: entregaManual ? '#28a745' : '#f8f9fa',
                          color: entregaManual ? 'white' : '#6c757d',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Manual
                      </button>
                    </div>
                    
                    {!entregaManual ? (
                      // Modo dropdown - selección de empresas
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        <select 
                          name="entrega" 
                          value={form.entrega} 
                          onChange={handleChange} 
                          style={{flex: 1}}
                          className={!form.entrega ? 'field-required' : ''}
                          required
                        >
                          <option value="">Seleccionar empresa</option>
                          {empresas.map((empresa, index) => (
                            <option key={`entrega-${index}-${empresa.empresa}`} value={empresa.empresa}>{empresa.empresa}</option>
                          ))}
                        </select>
                        {form.entrega && getEmpresaMapa(form.entrega) && (
                          <a href={getEmpresaMapa(form.entrega)} target="_blank" rel="noopener noreferrer" className="btn-maps" title={`Ver en Maps: ${form.entrega}`}>
                            📍 Maps
                          </a>
                        )}
                        {form.entrega && form.direccion_entrega && (
                          <span style={{fontSize: '12px', color: '#28a745', marginLeft: '4px'}} title="Dirección completa configurada">
                            ✅
                          </span>
                        )}
                      </div>
                    ) : (
                      // Modo manual - campos separados
                      <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}}>
                          <label style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block'}}>
                            📍 Dirección
                          </label>
                          <input 
                            type="text" 
                            value={form.entrega} 
                            onChange={(e) => handleAddressChange('entrega', e.target.value)}
                            placeholder="Ingresa la dirección de entrega..."
                            className={!form.entrega ? 'field-required' : ''}
                            required
                            style={{width: '100%'}}
                          />
                        </div>
                        <div style={{flex: 1}}>
                          <label style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block'}}>
                            🔗 Enlace Google Maps
                          </label>
                          <div style={{position: 'relative'}}>
                            <input 
                              type="url" 
                              value={form.direccion_entrega} 
                              onChange={(e) => setForm(prev => ({ ...prev, direccion_entrega: e.target.value }))}
                              placeholder="Pega aquí el enlace de Google Maps..."
                              className={!form.direccion_entrega ? 'field-required' : ''}
                              required
                              style={{width: '100%', paddingRight: '80px'}}
                            />
                            {form.direccion_entrega && (
                              <a href={form.direccion_entrega} target="_blank" rel="noopener noreferrer" className="btn-maps" title="Ver en Maps" style={{position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)'}}>
                                📍 Maps
                              </a>
                            )}
                            {form.entrega && !form.direccion_entrega && (
                              <button 
                                type="button" 
                                className="btn-maps" 
                                onClick={() => {
                                  const mapsLink = generateGoogleMapsLink(form.entrega)
                                  setForm(prev => ({ ...prev, direccion_entrega: mapsLink }))
                                  showNotification('📍 Enlace de Google Maps generado automáticamente', 'success')
                                }}
                                title="Generar enlace automáticamente"
                                style={{position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: '#28a745'}}
                              >
                                🔗 Generar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-full">
                    <label>Detalles de la Carrera</label>
                    <input name="detalles_carrera" value={form.detalles_carrera} onChange={handleChange} placeholder="Descripción adicional del pedido" />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: TRANSPORTE Y MÉTODO DE PAGO */}
              <div className="form-section">
                <h3 className="section-title">🚚 Transporte y Método de Pago</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Medio de Transporte <span className="required">*</span></label>
                    <select 
                      name="medio_transporte" 
                      value={form.medio_transporte} 
                      onChange={handleChange}
                      className={!form.medio_transporte ? 'field-required' : ''}
                      required
                    >
                      <option value="">Seleccionar Medio de Transporte</option>
                      {MEDIOS_TRANSPORTE.map(m => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Método de Pago <span className="required">*</span></label>
                    <select 
                      name="metodo_pago" 
                      value={form.metodo_pago} 
                      onChange={handleChange}
                      className={!form.metodo_pago ? 'field-required' : ''}
                      required
                    >
                      <option value="">Seleccionar Método de Pago</option>
                      {METODOS_PAGO.map(m => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: DISTANCIA Y PRECIO */}
              <div className="form-section">
                <h3 className="section-title">📏 Distancia y Precio</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Distancia (Km)</label>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      <input 
                        name="distancia_km" 
                        value={
                          isCalculatingDistance ? 'Calculando...' : 
                          form.distancia_km || 
                          (form.direccion_recojo && form.direccion_entrega ? 
                            'Haz clic en 🔄 para calcular' : 
                            'Selecciona puntos de recojo y entrega')
                        } 
                        readOnly 
                        className="auto-calculated"
                        placeholder="Auto-calculado"
                        style={{flex: 1}}
                      />
                      {form.direccion_recojo && form.direccion_entrega && (
                        <button 
                          type="button" 
                          className="btn-icon" 
                          onClick={() => calculateDistanceAndPrice(form.direccion_recojo, form.direccion_entrega, form.medio_transporte)}
                          title="Calcular distancia"
                          disabled={isCalculatingDistance}
                        >
                          {isCalculatingDistance ? '⏳' : '🔄'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Precio Total (Bs)</label>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      <input 
                        name="precio_bs" 
                        value={form.precio_bs || ''} 
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className={`precio-destacado ${form.metodo_pago === 'Cuenta' ? 'cuenta-mode' : ''}`}
                        style={{flex: 1}}
                        placeholder="0.00"
                      />
                      {precioEditadoManualmente && form.metodo_pago !== 'Cuenta' && (
                        <button 
                          type="button" 
                          className="btn-icon" 
                          onClick={() => {
                            setPrecioEditadoManualmente(false)
                            if (form.distancia_km && form.medio_transporte) {
                              const precio = calculatePrice(form.distancia_km, form.medio_transporte)
                              setForm((prev) => ({ ...prev, precio_bs: precio }))
                              showNotification(`💰 Precio recalculado: ${precio} Bs`, 'success')
                            }
                          }}
                          title="Recalcular precio automáticamente"
                        >
                          🔄
                        </button>
                      )}
                    </div>
                    {form.metodo_pago === 'Cuenta' && (
                      <small style={{color: '#28a745', fontSize: '0.8em'}}>
                        💳 Precio calculado para el sheet (no se muestra en WhatsApp) - Puedes editarlo manualmente
                      </small>
                    )}
                    {form.precio_bs && form.metodo_pago !== 'Cuenta' && (
                      <small style={{color: precioEditadoManualmente ? '#ffc107' : '#007bff', fontSize: '0.8em'}}>
                        {precioEditadoManualmente ? '✏️ Precio editado manualmente' : '💰 Precio calculado automáticamente (puedes editarlo)'}
                      </small>
                    )}
                    {form.medio_transporte === 'Bicicleta' && (
                      <small style={{color: '#28a745', fontSize: '0.8em', display: 'block', marginTop: '4px'}}>
                        🚴‍♂️ Esquema Bicicleta: 0-1km: 8 Bs, 1-2km: 10 Bs, 2-3km: 12 Bs... (+2 Bs/km adicional)
                      </small>
                    )}
                    {form.medio_transporte === 'Beezero' && (
                      <small style={{color: '#007bff', fontSize: '0.8em', display: 'block', marginTop: '4px'}}>
                        🚚 Esquema BeeZero: 0-1km: 10 Bs, 1-2km: 12 Bs, 2-3km: 14 Bs... (+2 Bs/km adicional)
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 5: COBROS Y PAGOS */}
              <div className="form-section">
                <h3 className="section-title">💳 Cobros y Pagos</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Operación</label>
                    <select 
                      name="cobro_pago" 
                      value={form.cobro_pago} 
                      onChange={handleChange}
                    >
                      {TIPOS_COBRO_PAGO.map(tipo => (
                        <option key={tipo} value={tipo}>
                          {tipo || 'Sin operación'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Monto (Bs) <span className="required">*</span></label>
                    <input 
                      name="monto_cobro_pago" 
                      value={form.monto_cobro_pago} 
                      onChange={handleChange} 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      className={form.cobro_pago && !form.monto_cobro_pago ? 'field-required' : ''}
                      disabled={!form.cobro_pago}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 6: BIKER Y HORARIOS */}
              <div className="form-section">
                <h3 className="section-title">🚴‍♂️ Biker y Horarios</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Biker Asignado <span className="required">*</span></label>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <select 
                        name="biker" 
                        value={form.biker} 
                        onChange={handleChange} 
                        style={{flex: 1}}
                        className={!form.biker ? 'field-required' : ''}
                        required
                      >
                        <option value="">Seleccionar biker</option>
                        {bikers.map(biker => (
                          <option key={biker} value={biker}>{biker}</option>
                        ))}
                      </select>
                      <button type="button" className="btn-icon" onClick={loadBikers}>🔄</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>WhatsApp</label>
                    <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="70123456" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha del Pedido <span className="required">*</span></label>
                    <input 
                      name="fecha" 
                      value={form.fecha} 
                      onChange={handleChange} 
                      type="date" 
                      className={!form.fecha ? 'field-required' : ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora Programada</label>
                    <input 
                      name="hora_ini" 
                      value={form.hora_ini} 
                      onChange={handleChange} 
                      type="time" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora Estimada Fin</label>
                    <input name="hora_fin" value={form.hora_fin} onChange={handleChange} type="time" />
                  </div>
                </div>

              </div>

              {/* SECCIÓN 7: ESTADO Y SEGUIMIENTO */}
              <div className="form-section">
                <h3 className="section-title">📊 Estado y Seguimiento</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Estado del Pedido <span className="required">*</span></label>
                    <select 
                      name="estado" 
                      value={form.estado} 
                      onChange={handleChange}
                      className={!form.estado ? 'field-required' : ''}
                      required
                    >
                      <option value="">Seleccionar Estado del Pedido</option>
                      {ESTADOS.map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Estado de Pago <span className="required">*</span></label>
                    <select 
                      name="estado_pago" 
                      value={form.estado_pago} 
                      onChange={handleChange}
                      className={!form.estado_pago ? 'field-required' : ''}
                      required
                    >
                      <option value="">Seleccionar Estado del Pago</option>
                      {ESTADOS_PAGO.map(e => (<option key={e} value={e}>{e}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pago al Biker (Bs)</label>
                    <input name="pago_biker" value={form.pago_biker} onChange={handleChange} type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contacto Biker</label>
                    <input name="contacto_biker" value={form.contacto_biker} onChange={handleChange} placeholder="Teléfono o nombre" />
                  </div>
                  <div className="form-group">
                    <label>Link de Contacto</label>
                    <input name="link_contacto_biker" value={form.link_contacto_biker} onChange={handleChange} placeholder="WhatsApp, Telegram, etc." />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-full">
                    <label>Observaciones</label>
                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Comentarios adicionales sobre el pedido..." rows="3" />
                  </div>
                </div>
              </div>

              {/* CAMPOS OCULTOS */}
              <input type="hidden" name="direccion_recojo" value={form.direccion_recojo} />
              <input type="hidden" name="direccion_entrega" value={form.direccion_entrega} />

              {/* PREVIEW DE WHATSAPP */}
              {(form.cliente || form.recojo || form.entrega) && (
                <div className="form-section">
                  <h3 className="section-title">📱 Vista Previa de WhatsApp</h3>
                  <div className="whatsapp-preview">
                    <div className="whatsapp-message">
                      <strong>CLIENTE:</strong> {getClienteInfo(form.cliente)}<br/><br/>
                      <strong>Recoger:</strong> {form.recojo || 'Sin especificar'}{form.direccion_recojo ? `: ${form.direccion_recojo}` : ''}<br/><br/>
                      <strong>Entrega:</strong> {form.entrega || 'Sin especificar'}{form.direccion_entrega && form.direccion_entrega.includes('http') ? `: ${form.direccion_entrega}` : ''}<br/><br/>
                      <strong>Info Extra:</strong> {form.detalles_carrera || ''}<br/><br/>
                      <strong>Carrera:</strong> {
                        form.metodo_pago === 'Cuenta' 
                          ? form.metodo_pago 
                          : form.precio_bs 
                            ? `${form.precio_bs}Bs    ${form.metodo_pago || 'Efectivo'}`
                            : form.metodo_pago || 'Efectivo'
                      }
                    </div>
                    <button 
                      type="button"
                      className="btn-whatsapp-large"
                      onClick={() => {
                        const tempOrder = { ...form }
                        const whatsappURL = generateWhatsAppURL(tempOrder)
                        window.open(whatsappURL, '_blank')
                        
                        // Mostrar notificación con información del destinatario
                        if (form.biker) {
                          const selectedBiker = bikersData.find(biker => biker.name === form.biker)
                          if (selectedBiker && selectedBiker.whatsapp) {
                            showNotification(`📱 Enviando WhatsApp a ${form.biker} (${selectedBiker.whatsapp})`, 'success')
                          } else {
                            showNotification(`📱 Enviando WhatsApp a ${form.biker} (número por defecto)`, 'warning')
                          }
                        } else {
                          showNotification('📱 Enviando WhatsApp (sin biker asignado)', 'warning')
                        }
                      }}
                      disabled={!form.biker}
                      title={form.biker ? `Enviar WhatsApp al biker ${form.biker}` : 'Selecciona un biker para enviar WhatsApp'}
                    >
                      📱 Enviar por WhatsApp {form.biker && `a ${form.biker}`}
                    </button>
                  </div>
                </div>
              )}

              {/* BOTÓN DE ENVÍO */}
              <div className="form-actions">
                <button className="btn primary large" type="submit">
                  ➕ Agregar Pedido
                </button>
              </div>
            </form>
          </section>
        )
      case 'ver':
        return (
          <section className="card">
            <div className="toolbar" style={{ gap: 8 }}>
              <h2>Kanban Board {loading && '🔄'}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="date" 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  title="Filtrar por fecha"
                />
                <input 
                  className="search" 
                  placeholder="Buscar..." 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                  title="Ordenar por"
                >
                  <option value="hora_ini">📦 Por Hora de Inicio</option>
                  <option value="hora">🕐 Por Hora de Envío</option>
                  <option value="id">🔢 Por ID</option>
                  <option value="cliente">👤 Por Cliente</option>
                  <option value="biker">🚴‍♂️ Por Biker</option>
                </select>
                {(dateFilter !== new Date().toISOString().split('T')[0] || filter) && (
                  <button 
                    className="btn" 
                    onClick={() => {
                      setDateFilter(new Date().toISOString().split('T')[0])
                      setFilter('')
                      setSortBy('hora_ini')
                    }}
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                    title="Limpiar filtros"
                  >
                    🗑️ Limpiar
                  </button>
                )}
              </div>
              <button className="btn" onClick={() => handleSyncFromSheet(true)} disabled={loading}>
                {loading ? '🔄 Sincronizando...' : '🔄 Actualizar'}
              </button>
              <button className="btn" onClick={handleExportCsv}>Exportar CSV</button>
              {dataLoaded && (
                <span style={{ fontSize: '0.8em', color: '#28a745' }}>
                  ✅ {filteredOrders.length} pedidos de {dateFilter} 
                  {sortBy === 'hora_ini' && ' (ordenados por hora de inicio)'}
                  {sortBy === 'hora' && ' (ordenados por hora de envío)'}
                  {sortBy === 'id' && ' (ordenados por ID)'}
                  {sortBy === 'cliente' && ' (ordenados por cliente)'}
                  {sortBy === 'biker' && ' (ordenados por biker)'}
                </span>
              )}
            </div>
            
            <div className="kanban-board">
              {ESTADOS.map(estado => (
                <div key={estado} className={`kanban-column kanban-${estado.toLowerCase()}`}>
                  <div className="kanban-header">
                    <h3>{estado}</h3>
                    <span className="count">{filteredOrders.filter(o => o.estado === estado).length}</span>
                  </div>
                  <div 
                    className="kanban-content"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, estado)}
                  >
                    {filteredOrders
                      .filter(order => order.estado === estado)
                      .map(order => (
                        <div
                          key={order.id}
                          className="kanban-card"
                          draggable
                          onDragStart={(e) => handleDragStart(e, order)}
                        >
                          <div className="card-header">
                            <span className="pedido-id">#{order.id}</span>
                            <span className="operador">{order.operador}</span>
                            <span className="fecha">{order.fecha}</span>
                          </div>
                          <div className="card-content">
                            <div className="cliente">{order.cliente || 'Sin cliente'}</div>
                            <div className="route">
                              <span className="from">{order.recojo || 'Sin recojo'}</span>
                              <span className="arrow">→</span>
                              <span className="to">{order.entrega || 'Sin entrega'}</span>
                            </div>
                            {order.precio_bs && (
                              <div className="precio">{order.precio_bs} Bs</div>
                            )}
                            {order.biker && (
                              <div className="biker">🚴‍♂️ {order.biker}</div>
                            )}
                          </div>
                          <div className="card-footer">
                            <div className="time-info">
                              {order.hora_ini && (
                                <div className="time-delivery">
                                  <span className="time-label">📦 Inicio:</span>
                                  <span className="time-value">{order.hora_ini}</span>
                                </div>
                              )}
                              {order.hora_fin && (
                                <div className="time-delivery">
                                  <span className="time-label">✅ Fin:</span>
                                  <span className="time-value">{order.hora_fin}</span>
                                </div>
                              )}
                            </div>
                            <div className="card-actions">
                              <button 
                                className="btn-edit"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditModal({ show: true, order: order })
                                }}
                                title="Editar pedido"
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-whatsapp"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const whatsappURL = generateWhatsAppURL(order)
                                  window.open(whatsappURL, '_blank')
                                  
                                  // Mostrar notificación con información del destinatario
                                  if (order.biker) {
                                    const selectedBiker = bikersData.find(biker => biker.name === order.biker)
                                    if (selectedBiker && selectedBiker.whatsapp) {
                                      showNotification(`📱 Enviando WhatsApp a ${order.biker} (${selectedBiker.whatsapp})`, 'success')
                                    } else {
                                      showNotification(`📱 Enviando WhatsApp a ${order.biker} (número por defecto)`, 'warning')
                                    }
                                  } else {
                                    showNotification('📱 Enviando WhatsApp (sin biker asignado)', 'warning')
                                  }
                                }}
                                title={order.biker ? `Enviar WhatsApp al biker ${order.biker}` : 'Enviar por WhatsApp'}
                              >
                                📱 WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    {filteredOrders.filter(o => o.estado === estado).length === 0 && (
                      <div className="empty-column">
                        Arrastra pedidos aquí
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'dashboard':
        return (
          <section className="card">
            <h2>Dashboard</h2>
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              <p>📊 Dashboard en construcción...</p>
              <p>Aquí mostraremos estadísticas y métricas de los pedidos.</p>
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="orders">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button className="notification-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'agregar' ? 'active' : ''}`}
          onClick={() => setActiveTab('agregar')}
        >
          ➕ Agregar Pedido
        </button>
        <button 
          className={`tab ${activeTab === 'ver' ? 'active' : ''}`}
          onClick={() => setActiveTab('ver')}
        >
          📋 Ver Pedidos
        </button>
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
      </nav>
      
      {renderTabContent()}
      
      {/* Modal de Entrega */}
      {deliveryModal.show && deliveryModal.order && (
        <div className="modal-overlay" onClick={handleDeliveryCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Completar Entrega - Pedido #{deliveryModal.order.id}</h3>
              <button className="modal-close" onClick={handleDeliveryCancel}>×</button>
            </div>
            
            <div className="modal-body">
              <DeliveryForm 
                order={deliveryModal.order}
                onComplete={handleDeliveryComplete}
                onCancel={handleDeliveryCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelación */}
      {cancelModal.show && cancelModal.order && (
        <div className="modal-overlay" onClick={handleCancelModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>❌ Cancelar Pedido - #{cancelModal.order.id}</h3>
              <button className="modal-close" onClick={handleCancelModalClose}>×</button>
            </div>
            
            <div className="modal-body">
              <CancelForm 
                order={cancelModal.order}
                onComplete={handleOrderCancel}
                onCancel={handleCancelModalClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {editModal.show && editModal.order && (
        <div className="modal-overlay" onClick={handleEditModalClose}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Editar Pedido - #{editModal.order.id}</h3>
              <button className="modal-close" onClick={handleEditModalClose}>×</button>
            </div>
            
            <div className="modal-body">
              <EditForm 
                order={editModal.order}
                onComplete={handleOrderEdit}
                onCancel={handleEditModalClose}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
