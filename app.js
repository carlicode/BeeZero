// 🤖 BeeZero WhatsApp Bot - Sistema de Turnos Casado
// Sistema completo de gestión de turnos con validación de números

const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const ExcelJS = require('exceljs');
const moment = require('moment');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

// 🔧 CONFIGURACIÓN AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION || 'us-east-1'
});

// 📊 CONFIGURACIÓN S3
const S3_CONFIG = {
    bucketName: process.env.S3_BUCKET_NAME || 'beezero-images-bucket',
    excelFolder: process.env.S3_EXCEL_FOLDER || 'reportes/',
    excelFilename: process.env.S3_EXCEL_FILENAME || 'analisis-imagenes.xlsx'
};

// 🎯 CONFIGURACIÓN DEL BOT
const BOT_CONFIG = {
    groupName: process.env.WHATSAPP_GROUP_NAME || 'Prueba bot Bee Zero',
    allowedGroups: process.env.ALLOWED_GROUPS ? process.env.ALLOWED_GROUPS.split(',') : [],
    debugMode: process.env.DEBUG_MODE === 'true',
    timezone: process.env.TIMEZONE || 'America/La_Paz'
};

// 📱 CONFIGURACIÓN DE NÚMEROS BOLIVIANOS
const PHONE_CONFIG = {
    countryCode: '591',
    validPrefixes: ['6', '7'], // Móviles bolivianos
    minLength: 8,
    maxLength: 8
};

// 🔄 CLIENTE WHATSAPP
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'beezero-bot',
        dataPath: './session'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// 🗂️ ESTADO DE TURNOS (En memoria - sincronizado con S3)
let turnosActivos = new Map();
let datosExcel = {
    turnos: [],
    vehiculos: [],
    facturas: []
};

// 🕐 CONTROL DE MENSAJES NUEVOS
let botStartTime = Date.now(); // Timestamp de cuando inició el bot
let botReady = false; // Flag para saber si el bot está listo

// 🔍 FUNCIÓN: Validar número de teléfono boliviano
function validarTelefonoBoliviano(numero) {
    try {
        // Limpiar número
        const numeroLimpio = numero.replace(/\D/g, '');
        
        // Verificar si empieza con 591
        if (numeroLimpio.startsWith('591')) {
            const numeroNacional = numeroLimpio.substring(3);
            
            // Verificar longitud y prefijo
            if (numeroNacional.length === PHONE_CONFIG.minLength) {
                const prefijo = numeroNacional.charAt(0);
                if (PHONE_CONFIG.validPrefixes.includes(prefijo)) {
                    return {
                        valid: true,
                        formatted: `+591-${numeroNacional}`,
                        national: numeroNacional,
                        international: `591${numeroNacional}`
                    };
                }
            }
        }
        
        // Si no tiene código de país, asumir boliviano
        if (numeroLimpio.length === PHONE_CONFIG.minLength) {
            const prefijo = numeroLimpio.charAt(0);
            if (PHONE_CONFIG.validPrefixes.includes(prefijo)) {
                return {
                    valid: true,
                    formatted: `+591-${numeroLimpio}`,
                    national: numeroLimpio,
                    international: `591${numeroLimpio}`
                };
            }
        }
        
        return { valid: false, error: 'Número no válido para Bolivia' };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// 📁 FUNCIÓN: Descargar Excel desde S3
async function descargarExcelDesdeS3() {
    try {
        const params = {
            Bucket: S3_CONFIG.bucketName,
            Key: `${S3_CONFIG.excelFolder}${S3_CONFIG.excelFilename}`
        };
        
        const response = await s3.getObject(params).promise();
        const excelPath = path.join(__dirname, 'temp_excel.xlsx');
        
        // Guardar temporalmente
        fs.writeFileSync(excelPath, response.Body);
        
        // Leer con ExcelJS
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(excelPath);
        
        // Procesar hojas
        const turnos = [];
        const vehiculos = [];
        const facturas = [];
        
        // Procesar hoja de Turnos
        const turnosSheet = workbook.getWorksheet('Turnos');
        if (turnosSheet) {
            const headers = [];
            turnosSheet.getRow(1).eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
            
            turnosSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const turno = {};
                    row.eachCell((cell, colNumber) => {
                        if (headers[colNumber]) {
                            turno[headers[colNumber]] = cell.value;
                        }
                    });
                    turnos.push(turno);
                }
            });
        }
        
        // Procesar hoja de Vehículos
        const vehiculosSheet = workbook.getWorksheet('Vehículos') || workbook.getWorksheet('Vehiculos');
        if (vehiculosSheet) {
            const headers = [];
            vehiculosSheet.getRow(1).eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
            
            vehiculosSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const vehiculo = {};
                    row.eachCell((cell, colNumber) => {
                        if (headers[colNumber]) {
                            vehiculo[headers[colNumber]] = cell.value;
                        }
                    });
                    vehiculos.push(vehiculo);
                }
            });
        }
        
        // Procesar hoja de Facturas
        const facturasSheet = workbook.getWorksheet('Facturas');
        if (facturasSheet) {
            const headers = [];
            facturasSheet.getRow(1).eachCell((cell, colNumber) => {
                headers[colNumber] = cell.value;
            });
            
            facturasSheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const factura = {};
                    row.eachCell((cell, colNumber) => {
                        if (headers[colNumber]) {
                            factura[headers[colNumber]] = cell.value;
                        }
                    });
                    facturas.push(factura);
                }
            });
        }
        
        // Limpiar archivo temporal
        fs.unlinkSync(excelPath);
        
        return { turnos, vehiculos, facturas };
    } catch (error) {
        console.error('❌ Error descargando Excel:', error);
        
        // Manejo específico de errores
        if (error.code === 'NoSuchKey') {
            console.error('');
            console.error('🔧 SOLUCIÓN: El archivo Excel no existe en S3');
            console.error('📍 Archivo esperado: s3://' + S3_CONFIG.bucketName + '/' + S3_CONFIG.excelFolder + S3_CONFIG.excelFilename);
            console.error('');
            console.error('🚀 Para solucionar este problema:');
            console.error('   1. Ejecutar: node initialize-excel.js');
            console.error('   2. Verificar configuración AWS en .env');
            console.error('   3. Revisar guía: setup-aws.md');
            console.error('');
            console.error('⚠️  El bot funcionará con datos vacíos hasta que se configure S3');
        } else if (error.code === 'AccessDenied') {
            console.error('');
            console.error('🔧 SOLUCIÓN: Sin permisos para acceder al bucket S3');
            console.error('📍 Bucket: ' + S3_CONFIG.bucketName);
            console.error('');
            console.error('🚀 Para solucionar este problema:');
            console.error('   1. Verificar credenciales AWS en .env');
            console.error('   2. Verificar permisos del usuario AWS');
            console.error('   3. Revisar política del bucket S3');
            console.error('   4. Revisar guía: setup-aws.md');
        } else if (error.code === 'NoSuchBucket') {
            console.error('');
            console.error('🔧 SOLUCIÓN: El bucket S3 no existe');
            console.error('📍 Bucket: ' + S3_CONFIG.bucketName);
            console.error('');
            console.error('🚀 Para solucionar este problema:');
            console.error('   1. Crear bucket: aws s3 mb s3://' + S3_CONFIG.bucketName);
            console.error('   2. Verificar nombre del bucket en .env');
            console.error('   3. Revisar guía: setup-aws.md');
        } else {
            console.error('');
            console.error('🔧 SOLUCIÓN: Error desconocido de AWS S3');
            console.error('📍 Código de error: ' + error.code);
            console.error('📍 Mensaje: ' + error.message);
            console.error('');
            console.error('🚀 Para solucionar este problema:');
            console.error('   1. Verificar conexión a internet');
            console.error('   2. Verificar credenciales AWS');
            console.error('   3. Revisar guía: setup-aws.md');
        }
        
        return { turnos: [], vehiculos: [], facturas: [] };
    }
}

// 💾 FUNCIÓN: Subir Excel a S3
async function subirExcelAL3(datos) {
    try {
        const workbook = new ExcelJS.Workbook();
        
        // Crear hoja de Turnos
        const turnosSheet = workbook.addWorksheet('Turnos');
        if (datos.turnos.length > 0) {
            const headers = Object.keys(datos.turnos[0]);
            turnosSheet.addRow(headers);
            
            datos.turnos.forEach(turno => {
                const row = headers.map(header => turno[header]);
                turnosSheet.addRow(row);
            });
        }
        
        // Crear hoja de Vehículos
        const vehiculosSheet = workbook.addWorksheet('Vehículos');
        if (datos.vehiculos.length > 0) {
            const headers = Object.keys(datos.vehiculos[0]);
            vehiculosSheet.addRow(headers);
            
            datos.vehiculos.forEach(vehiculo => {
                const row = headers.map(header => vehiculo[header]);
                vehiculosSheet.addRow(row);
            });
        }
        
        // Crear hoja de Facturas
        const facturasSheet = workbook.addWorksheet('Facturas');
        if (datos.facturas.length > 0) {
            const headers = Object.keys(datos.facturas[0]);
            facturasSheet.addRow(headers);
            
            datos.facturas.forEach(factura => {
                const row = headers.map(header => factura[header]);
                facturasSheet.addRow(row);
            });
        }
        
        // Guardar temporalmente
        const excelPath = path.join(__dirname, 'temp_upload.xlsx');
        await workbook.xlsx.writeFile(excelPath);
        
        // Subir a S3
        const fileContent = fs.readFileSync(excelPath);
        const params = {
            Bucket: S3_CONFIG.bucketName,
            Key: `${S3_CONFIG.excelFolder}${S3_CONFIG.excelFilename}`,
            Body: fileContent,
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        
        await s3.upload(params).promise();
        
        // Limpiar archivo temporal
        fs.unlinkSync(excelPath);
        
        console.log('✅ Excel subido exitosamente a S3');
        return true;
    } catch (error) {
        console.error('❌ Error subiendo Excel:', error);
        return false;
    }
}

// 🏁 FUNCIÓN: Iniciar turno
async function iniciarTurno(contacto, mensaje) {
    try {
        const telefono = validarTelefonoBoliviano(contacto.number);
        
        if (!telefono.valid) {
            return `❌ Número de teléfono no válido: ${telefono.error}`;
        }
        
        // Verificar si ya tiene turno activo
        const turnoExistente = Array.from(turnosActivos.values()).find(t => 
            t.telefono_inicio === telefono.formatted && t.estado === 'ACTIVO'
        );
        
        if (turnoExistente) {
            return `⚠️ Ya tienes un turno activo (ID: ${turnoExistente.id_turno})`;
        }
        
        // Crear nuevo turno
        const ahora = moment().tz(BOT_CONFIG.timezone);
        const nuevoTurno = {
            id_turno: `T${ahora.format('YYYYMMDD-HHmmss')}-${telefono.national.substring(0, 4)}`,
            fecha_inicio: ahora.format('YYYY-MM-DD'),
            timestamp_inicio: ahora.unix(),
            telefono_inicio: telefono.formatted,
            abejita: contacto.pushname || 'Desconocido',
            auto: '',
            apertura_caja: '',
            danos_auto_inicio: '',
            estado: 'ACTIVO',
            fecha_fin: null,
            timestamp_fin: null,
            telefono_fin: null,
            cierre_caja: '',
            danos_auto_fin: ''
        };
        
        // Extraer información adicional del mensaje
        const mensajeLimpio = mensaje.toLowerCase();
        
        // Buscar información de auto
        const autoMatch = mensajeLimpio.match(/auto[:\s]+([a-zA-Z0-9\s-]+)/i);
        if (autoMatch) {
            nuevoTurno.auto = autoMatch[1].trim();
        }
        
        // Buscar información de caja
        const cajaMatch = mensajeLimpio.match(/caja[:\s]+([0-9.,]+)/i);
        if (cajaMatch) {
            nuevoTurno.apertura_caja = cajaMatch[1].trim();
        }
        
        // Buscar información de daños
        const danosMatch = mensajeLimpio.match(/daños?[:\s]+([a-zA-Z0-9\s,.-]+)/i);
        if (danosMatch) {
            nuevoTurno.danos_auto_inicio = danosMatch[1].trim();
        }
        
        // Agregar a memoria
        turnosActivos.set(nuevoTurno.id_turno, nuevoTurno);
        
        // Agregar a datos y sincronizar con S3
        datosExcel.turnos.push(nuevoTurno);
        await subirExcelAL3(datosExcel);
        
        return `✅ Turno iniciado correctamente\n\n` +
               `📋 **Detalles del turno:**\n` +
               `• ID: ${nuevoTurno.id_turno}\n` +
               `• Abejita: ${nuevoTurno.abejita}\n` +
               `• Teléfono: ${nuevoTurno.telefono_inicio}\n` +
               `• Fecha: ${nuevoTurno.fecha_inicio}\n` +
               `• Hora: ${ahora.format('HH:mm:ss')}\n` +
               `${nuevoTurno.auto ? `• Auto: ${nuevoTurno.auto}\n` : ''}` +
               `${nuevoTurno.apertura_caja ? `• Caja inicial: ${nuevoTurno.apertura_caja}\n` : ''}` +
               `${nuevoTurno.danos_auto_inicio ? `• Daños: ${nuevoTurno.danos_auto_inicio}\n` : ''}` +
               `\n🔒 **Sistema casado**: Solo este número puede cerrar el turno.`;
        
    } catch (error) {
        console.error('❌ Error iniciando turno:', error);
        return `❌ Error interno del sistema. Contacta al administrador.`;
    }
}

// 🔚 FUNCIÓN: Cerrar turno
async function cerrarTurno(contacto, mensaje) {
    try {
        const telefono = validarTelefonoBoliviano(contacto.number);
        
        if (!telefono.valid) {
            return `❌ Número de teléfono no válido: ${telefono.error}`;
        }
        
        // Buscar turno activo del usuario
        const turnoActivo = Array.from(turnosActivos.values()).find(t => 
            t.telefono_inicio === telefono.formatted && t.estado === 'ACTIVO'
        );
        
        if (!turnoActivo) {
            return `⚠️ No tienes un turno activo que puedas cerrar.\n\n` +
                   `💡 **Recordatorio**: Solo puedes cerrar turnos que tú mismo iniciaste (sistema casado).`;
        }
        
        // Cerrar turno
        const ahora = moment().tz(BOT_CONFIG.timezone);
        turnoActivo.fecha_fin = ahora.format('YYYY-MM-DD');
        turnoActivo.timestamp_fin = ahora.unix();
        turnoActivo.telefono_fin = telefono.formatted;
        turnoActivo.estado = 'CERRADO';
        
        // Extraer información adicional del mensaje
        const mensajeLimpio = mensaje.toLowerCase();
        
        // Buscar información de caja
        const cajaMatch = mensajeLimpio.match(/caja[:\s]+([0-9.,]+)/i);
        if (cajaMatch) {
            turnoActivo.cierre_caja = cajaMatch[1].trim();
        }
        
        // Buscar información de daños
        const danosMatch = mensajeLimpio.match(/daños?[:\s]+([a-zA-Z0-9\s,.-]+)/i);
        if (danosMatch) {
            turnoActivo.danos_auto_fin = danosMatch[1].trim();
        }
        
        // Calcular duración
        const duracionSegundos = turnoActivo.timestamp_fin - turnoActivo.timestamp_inicio;
        const duracionHoras = Math.floor(duracionSegundos / 3600);
        const duracionMinutos = Math.floor((duracionSegundos % 3600) / 60);
        
        // Actualizar en memoria
        turnosActivos.set(turnoActivo.id_turno, turnoActivo);
        
        // Actualizar en datos y sincronizar con S3
        const index = datosExcel.turnos.findIndex(t => t.id_turno === turnoActivo.id_turno);
        if (index !== -1) {
            datosExcel.turnos[index] = turnoActivo;
        }
        await subirExcelAL3(datosExcel);
        
        return `✅ Turno cerrado correctamente\n\n` +
               `📋 **Resumen del turno:**\n` +
               `• ID: ${turnoActivo.id_turno}\n` +
               `• Abejita: ${turnoActivo.abejita}\n` +
               `• Duración: ${duracionHoras}h ${duracionMinutos}m\n` +
               `• Inicio: ${moment.unix(turnoActivo.timestamp_inicio).tz(BOT_CONFIG.timezone).format('HH:mm:ss')}\n` +
               `• Fin: ${moment.unix(turnoActivo.timestamp_fin).tz(BOT_CONFIG.timezone).format('HH:mm:ss')}\n` +
               `${turnoActivo.cierre_caja ? `• Caja final: ${turnoActivo.cierre_caja}\n` : ''}` +
               `${turnoActivo.danos_auto_fin ? `• Daños: ${turnoActivo.danos_auto_fin}\n` : ''}` +
               `\n🎉 ¡Gracias por tu trabajo!`;
        
    } catch (error) {
        console.error('❌ Error cerrando turno:', error);
        return `❌ Error interno del sistema. Contacta al administrador.`;
    }
}

// 📊 FUNCIÓN: Consultar estado de turnos
async function consultarEstadoTurnos(contacto) {
    try {
        const telefono = validarTelefonoBoliviano(contacto.number);
        
        if (!telefono.valid) {
            return `❌ Número de teléfono no válido: ${telefono.error}`;
        }
        
        // Buscar turnos del usuario
        const turnosUsuario = Array.from(turnosActivos.values()).filter(t => 
            t.telefono_inicio === telefono.formatted
        );
        
        if (turnosUsuario.length === 0) {
            return `📋 No tienes turnos registrados.`;
        }
        
        let respuesta = `📊 **Tus turnos:**\n\n`;
        
        turnosUsuario.forEach((turno, index) => {
            const estado = turno.estado === 'ACTIVO' ? '🟢 ACTIVO' : '⚫ CERRADO';
            const inicio = moment.unix(turno.timestamp_inicio).tz(BOT_CONFIG.timezone).format('DD/MM HH:mm');
            
            respuesta += `${index + 1}. ${turno.id_turno}\n`;
            respuesta += `   Estado: ${estado}\n`;
            respuesta += `   Inicio: ${inicio}\n`;
            
            if (turno.estado === 'CERRADO') {
                const fin = moment.unix(turno.timestamp_fin).tz(BOT_CONFIG.timezone).format('DD/MM HH:mm');
                const duracion = turno.timestamp_fin - turno.timestamp_inicio;
                const horas = Math.floor(duracion / 3600);
                const minutos = Math.floor((duracion % 3600) / 60);
                respuesta += `   Fin: ${fin}\n`;
                respuesta += `   Duración: ${horas}h ${minutos}m\n`;
            }
            
            respuesta += `\n`;
        });
        
        return respuesta;
        
    } catch (error) {
        console.error('❌ Error consultando estado:', error);
        return `❌ Error interno del sistema. Contacta al administrador.`;
    }
}

// 🔄 FUNCIÓN: Inicializar datos
async function inicializarDatos() {
    try {
        console.log('📊 Descargando datos desde S3...');
        datosExcel = await descargarExcelDesdeS3();
        
        // Cargar turnos activos en memoria
        turnosActivos.clear();
        datosExcel.turnos.forEach(turno => {
            if (turno.estado === 'ACTIVO') {
                turnosActivos.set(turno.id_turno, turno);
            }
        });
        
        console.log(`✅ Datos cargados: ${datosExcel.turnos.length} turnos, ${datosExcel.vehiculos.length} vehículos, ${datosExcel.facturas.length} facturas`);
        console.log(`🔄 Turnos activos en memoria: ${turnosActivos.size}`);
        
    } catch (error) {
        console.error('❌ Error inicializando datos:', error);
    }
}

// 🤖 EVENTOS DEL BOT

// Verificar si existe sesión guardada al iniciar
client.on('loading_screen', (percent, message) => {
    console.log(`⏳ Cargando WhatsApp... ${percent}% - ${message}`);
});

// Sesión existente encontrada y autenticada
client.on('authenticated', () => {
    console.log('✅ Sesión existente encontrada y autenticada');
    console.log('🔄 Reutilizando sesión guardada - No es necesario escanear QR');
});

// Necesita escanear QR (primera vez o sesión expirada)
client.on('qr', (qr) => {
    console.log('📱 NECESARIO: Escanear código QR para WhatsApp Web');
    console.log('🔍 Motivo: Primera vez o sesión expirada');
    console.log('📲 Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo');
    console.log('='.repeat(50));
    qrcode.generate(qr, { small: true });
    console.log('='.repeat(50));
    console.log('⏱️ El código QR expira en 20 segundos');
});

// Bot conectado y listo
client.on('ready', async () => {
    console.log('🎉 Bot BeeZero conectado exitosamente!');
    console.log(`📱 Configuración: ${BOT_CONFIG.groupName}`);
    console.log(`🪣 S3 Bucket: ${S3_CONFIG.bucketName}`);
    console.log(`📁 Sesión guardada en: ./session`);
    
    // Inicializar datos solo una vez al iniciar
    await inicializarDatos();
    
    // Marcar el bot como listo y actualizar timestamp
    botReady = true;
    botStartTime = Date.now();
    
    console.log('🔄 Modo actualización manual activado');
    console.log('💡 Para actualizar datos, envía el comando "actualizar" al bot');
    console.log('⏰ Bot configurado para procesar SOLO mensajes nuevos');
    console.log('🔥 ¡Bot listo para recibir comandos!');
});

client.on('message', async (message) => {
    try {
        // Ignorar mensajes propios
        if (message.fromMe) return;
        
        // Solo procesar mensajes de texto
        if (message.type !== 'chat') return;
        
        // ⏰ SOLO PROCESAR MENSAJES NUEVOS
        if (!botReady) {
            // Bot aún no está listo, ignorar mensaje
            return;
        }
        
        // Verificar si el mensaje es anterior al inicio del bot
        const messageTimestamp = message.timestamp * 1000; // WhatsApp timestamp en segundos
        if (messageTimestamp < botStartTime) {
            console.log(`⏰ Mensaje anterior al inicio del bot ignorado: ${new Date(messageTimestamp).toLocaleString('es-BO')}`);
            return;
        }
        
        const contact = await message.getContact();
        const chat = await message.getChat();
        
        // Verificar si es un grupo permitido
        if (chat.isGroup) {
            const groupName = chat.name;
            console.log(`🔍 Verificando grupo: "${groupName}" vs configurado: "${BOT_CONFIG.groupName}"`);
            
            // MODO DIAGNÓSTICO: Permitir temporalmente todos los grupos
            // Comentar la línea siguiente para permitir todos los grupos
            // TEMPORAL FIX: if (BOT_CONFIG.groupName && groupName !== BOT_CONFIG.groupName) {
                // TEMPORAL FIX: console.log(`⚠️  Mensaje ignorado - Grupo no permitido: "${groupName}"`);
                // TEMPORAL FIX: console.log(`💡 Para permitir este grupo, actualiza WHATSAPP_GROUP_NAME en .env`);
                // TEMPORAL FIX: return; // Ignorar otros grupos
            // TEMPORAL FIX: }
        }
        
        const messageText = message.body.toLowerCase().trim();
        
        // Log del mensaje NUEVO (para diagnosticar)
        const messageTime = new Date(message.timestamp * 1000).toLocaleString('es-BO', { timeZone: 'America/La_Paz' });
        console.log(`💬 NUEVO [${messageTime}] ${chat.isGroup ? '[' + chat.name + ']' : '[DM]'} ${contact.pushname || contact.number}: ${message.body}`);
        
        // Log adicional de debug
        if (BOT_CONFIG.debugMode) {
            console.log(`🔍 Debug Info:`, {
                isGroup: chat.isGroup,
                groupName: chat.name,
                configuredGroup: BOT_CONFIG.groupName,
                messageType: message.type,
                messageTimestamp: messageTime,
                botStartTime: new Date(botStartTime).toLocaleString('es-BO'),
                from: contact.number
            });
        }
        
        let respuesta = '';
        
        // 🏁 COMANDOS DE INICIO DE TURNO
        if (messageText.includes('inicio turno') || messageText.includes('iniciar turno') || 
            messageText.includes('abrir turno') || messageText.includes('empezar turno')) {
            
            respuesta = await iniciarTurno(contact, message.body);
        }
        
        // 🔚 COMANDOS DE CIERRE DE TURNO
        else if (messageText.includes('cerrar turno') || messageText.includes('terminar turno') || 
                 messageText.includes('finalizar turno') || messageText.includes('fin turno')) {
            
            respuesta = await cerrarTurno(contact, message.body);
        }
        
        // 📊 COMANDOS DE CONSULTA
        else if (messageText.includes('mis turnos') || messageText.includes('estado turno') || 
                 messageText.includes('consultar turno') || messageText.includes('ver turnos')) {
            
            respuesta = await consultarEstadoTurnos(contact);
        }
        
        // 🔄 COMANDO DE ACTUALIZACIÓN
        else if (messageText.includes('actualizar') || messageText.includes('refresh') || 
                 messageText.includes('sincronizar') || messageText.includes('update')) {
            
            respuesta = `🔄 **Actualizando datos desde S3...**\n\n`;
            
            try {
                await inicializarDatos();
                const totalTurnos = datosExcel.turnos.length;
                const totalVehiculos = datosExcel.vehiculos.length;
                const totalFacturas = datosExcel.facturas.length;
                                 const turnosActivosCount = turnosActivos.size;
                
                                 respuesta += `✅ **Datos actualizados exitosamente:**\n` +
                            `• 👷 Turnos: ${totalTurnos} (${turnosActivosCount} activos)\n` +
                           `• 🚗 Vehículos: ${totalVehiculos}\n` +
                           `• 📄 Facturas: ${totalFacturas}\n\n` +
                           `🕐 **Última actualización:** ${new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}\n\n` +
                           `💡 **Tip:** Los datos del dashboard se actualizarán automáticamente.`;
            } catch (error) {
                console.error('❌ Error en actualización manual:', error);
                respuesta += `❌ **Error al actualizar datos:**\n` +
                           `${error.message}\n\n` +
                           `🔧 **Solución:** Verifica la conexión a S3 y vuelve a intentar.`;
            }
        }
        
        // 🔍 COMANDO DE DEBUG - Información del bot
        else if (messageText.includes('debug') || messageText.includes('info bot') || 
                 messageText.includes('status bot')) {
            
            const botStartTimeStr = new Date(botStartTime).toLocaleString('es-BO', { timeZone: 'America/La_Paz' });
            const messageTimeStr = new Date(message.timestamp * 1000).toLocaleString('es-BO', { timeZone: 'America/La_Paz' });
            
            respuesta = `🔍 **Bot BeeZero - Información de Debug:**\n\n` +
                       `📱 **Grupo actual:** ${chat.isGroup ? chat.name : 'Mensaje directo'}\n` +
                       `⚙️ **Grupo configurado:** ${BOT_CONFIG.groupName}\n` +
                       `🔧 **Modo debug:** ${BOT_CONFIG.debugMode ? 'ON' : 'OFF'}\n` +
                       `📊 **Turnos cargados:** ${datosExcel.turnos.length}\n` +
                       `🔄 **Turnos activos:** ${turnosActivos.size}\n` +
                       `📱 **Tu número:** ${contact.number}\n` +
                       `⏰ **Bot iniciado:** ${botStartTimeStr}\n` +
                       `⏰ **Tu mensaje:** ${messageTimeStr}\n` +
                       `🆕 **Mensaje nuevo:** ${message.timestamp * 1000 >= botStartTime ? 'SÍ' : 'NO'}\n` +
                       `🕐 **Timestamp actual:** ${new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}\n\n` +
                       `✅ **Bot procesando solo mensajes nuevos!**`;
        }
        
        // 🧪 COMANDO DE PRUEBA - Responder a cualquier mensaje con "test"
        else if (messageText.includes('test') || messageText.includes('prueba') || 
                 messageText.includes('ping')) {
            
            respuesta = `🏓 **Pong!** Bot BeeZero recibió tu mensaje.\n\n` +
                       `📱 **Desde:** ${chat.isGroup ? 'Grupo: ' + chat.name : 'Mensaje directo'}\n` +
                       `👤 **Usuario:** ${contact.pushname || contact.number}\n` +
                       `💬 **Mensaje:** ${message.body}\n` +
                       `🕐 **Hora:** ${new Date().toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}\n\n` +
                       `✅ **Conexión confirmada!**`;
        }
        
        // 👋 COMANDO SIMPLE - Responder a saludos
        else if (messageText.includes('hola') || messageText.includes('hi') || 
                 messageText.includes('hello') || messageText.includes('buenas')) {
            
            respuesta = `👋 ¡Hola! Soy el Bot BeeZero.\n\n` +
                       `📱 **Grupo:** ${chat.isGroup ? chat.name : 'Mensaje directo'}\n` +
                       `✅ **Estoy funcionando correctamente.**\n\n` +
                       `💡 Escribe "ayuda" para ver todos los comandos disponibles.`;
        }

        // ℹ️ COMANDO DE AYUDA
        else if (messageText.includes('ayuda') || messageText.includes('help') || 
                 messageText.includes('comandos') || messageText === 'bot') {
            
            respuesta = `🤖 **Bot BeeZero - Comandos disponibles:**\n\n` +
                       `🏁 **Iniciar turno:**\n` +
                       `• "inicio turno"\n` +
                       `• "iniciar turno auto: ABC123 caja: 500"\n` +
                       `• "abrir turno daños: ninguno"\n\n` +
                       `🔚 **Cerrar turno:**\n` +
                       `• "cerrar turno"\n` +
                       `• "terminar turno caja: 750"\n` +
                       `• "fin turno daños: rayón lateral"\n\n` +
                       `📊 **Consultar:**\n` +
                       `• "mis turnos"\n` +
                       `• "estado turno"\n` +
                       `• "ver turnos"\n\n` +
                       `🔄 **Actualizar:**\n` +
                       `• "actualizar"\n` +
                       `• "sincronizar"\n` +
                       `• "refresh"\n\n` +
                       `🧪 **Debug/Prueba:**\n` +
                       `• "test" o "prueba"\n` +
                       `• "debug" o "info bot"\n\n` +
                       `🔒 **Sistema casado**: Solo quien inicia puede cerrar el turno.\n` +
                       `📱 **Números**: Solo números bolivianos válidos.\n` +
                       `🕐 **Horario**: Zona horaria de Bolivia.\n` +
                       `⏰ **Mensajes**: Solo procesa mensajes nuevos.\n\n` +
                       `💡 **Ejemplo completo:**\n` +
                       `"inicio turno auto: Toyota ABC123 caja: 500 daños: ninguno"`;
        }
        
        // Enviar respuesta si hay una
        if (respuesta) {
            console.log(`📤 Enviando respuesta a ${contact.pushname || contact.number}`);
            await message.reply(respuesta);
        } else {
            console.log(`⚠️  No se encontró comando válido en: "${message.body}"`);
        }
        
    } catch (error) {
        console.error('❌ Error procesando mensaje:', error);
        await message.reply('❌ Error interno del sistema. Contacta al administrador.');
    }
});

client.on('message_create', async (message) => {
    // Log de mensajes enviados por el bot
    if (message.fromMe && BOT_CONFIG.debugMode) {
        console.log(`🤖 Bot: ${message.body}`);
    }
});

// Error de autenticación
client.on('auth_failure', (session) => {
    console.log('❌ Error de autenticación:', session);
    console.log('🔧 Soluciones posibles:');
    console.log('   1. Eliminar sesión: rm -rf ./session');
    console.log('   2. Reiniciar bot: npm start');
    console.log('   3. Verificar que WhatsApp esté activo en el teléfono');
});

// Sesión desconectada inesperadamente
client.on('disconnected', (reason) => {
    console.log('⚠️ Bot desconectado:', reason);
    if (reason === 'LOGOUT') {
        console.log('🔄 Sesión cerrada manualmente desde WhatsApp');
        console.log('💡 Elimina la sesión y reinicia: rm -rf ./session && npm start');
    }
});

// 🔍 FUNCIÓN: Verificar sesión existente
function verificarSesionExistente() {
    const sessionPath = './session';
    try {
        if (fs.existsSync(sessionPath)) {
            const files = fs.readdirSync(sessionPath);
            if (files.length > 0) {
                console.log('✅ Sesión guardada encontrada');
                console.log(`📁 Archivos de sesión: ${files.length}`);
                console.log('🔄 Se intentará reutilizar la sesión existente');
                return true;
            }
        }
        console.log('⚠️ No se encontró sesión guardada');
        console.log('📱 Será necesario escanear código QR');
        return false;
    } catch (error) {
        console.log('❌ Error verificando sesión:', error.message);
        return false;
    }
}

// 🚀 INICIALIZAR BOT
console.log('🚀 Iniciando Bot BeeZero...');
console.log(`📱 Grupo objetivo: ${BOT_CONFIG.groupName}`);
console.log(`🪣 S3 Bucket: ${S3_CONFIG.bucketName}`);
console.log(`🔧 Modo debug: ${BOT_CONFIG.debugMode ? 'ON' : 'OFF'}`);
console.log('='.repeat(60));

// Verificar sesión antes de inicializar
const tieneSession = verificarSesionExistente();
console.log('='.repeat(60));

client.initialize();

// 🔧 MANEJO DE ERRORES GLOBALES
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

// 🛑 MANEJO DE CIERRE LIMPIO
process.on('SIGINT', async () => {
    console.log('\n⏹️ Cerrando Bot BeeZero...');
    await client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⏹️ Terminando Bot BeeZero...');
    await client.destroy();
    process.exit(0);
}); 