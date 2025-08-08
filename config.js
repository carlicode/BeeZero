// 🔧 BeeZero WhatsApp Bot - Configuración
require('dotenv').config();

/**
 * Configuración centralizada del bot BeeZero
 */
const config = {
    // 🔑 AWS Configuration
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
        s3: {
            bucketName: process.env.S3_BUCKET_NAME || 'beezero-images-bucket',
            excelFolder: process.env.S3_EXCEL_FOLDER || 'reportes/',
            excelFilename: process.env.S3_EXCEL_FILENAME || 'analisis-imagenes.xlsx'
        }
    },

    // 📱 WhatsApp Configuration
    whatsapp: {
        groupName: process.env.WHATSAPP_GROUP_NAME || 'Prueba bot Bee Zero',
        groupLink: process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/JT0EExspp72ImTAnNXEKzg',
        allowedGroups: process.env.ALLOWED_GROUPS ? process.env.ALLOWED_GROUPS.split(',') : [],
        sessionPath: './session',
        clientId: 'beezero-bot'
    },

    // 📞 Phone Configuration
    phone: {
        countryCode: process.env.COUNTRY_CODE || '591',
        validPrefixes: process.env.VALID_PREFIXES ? process.env.VALID_PREFIXES.split(',') : ['6', '7'],
        phoneLength: parseInt(process.env.PHONE_LENGTH) || 8
    },

    // 🤖 Bot Configuration
    bot: {
        name: process.env.BOT_NAME || 'BeeZero Bot',
        version: process.env.BOT_VERSION || '1.0.0',
        debugMode: process.env.DEBUG_MODE === 'true',
        timezone: process.env.TIMEZONE || 'America/La_Paz',
        logLevel: process.env.LOG_LEVEL || 'INFO',
        logFile: process.env.LOG_FILE || 'beezero-bot.log'
    },

    // 📊 Sheet Names
    sheets: {
        turnos: process.env.TURNOS_SHEET || 'Turnos',
        vehiculos: process.env.VEHICULOS_SHEET || 'Vehículos',
        facturas: process.env.FACTURAS_SHEET || 'Facturas'
    },

    // 🔒 Security
    security: {
        adminNumbers: process.env.ADMIN_NUMBERS ? process.env.ADMIN_NUMBERS.split(',') : [],
        enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
        notificationWebhook: process.env.NOTIFICATION_WEBHOOK || null
    },

    // 🔄 Cache & Sync
    cache: {
        ttl: parseInt(process.env.CACHE_TTL) || 300,
        syncInterval: 0, // Desactivado - solo actualización manual
        manualUpdate: true
    },

    // 💾 Backup
    backup: {
        interval: parseInt(process.env.BACKUP_INTERVAL) || 3600,
        retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 7
    },

    // 🎯 Turn States
    turnStates: {
        active: 'ACTIVO',
        closed: 'CERRADO',
        noStart: 'SIN_INICIO',
        cancelled: 'CANCELADO'
    },

    // 📝 Commands
    commands: {
        startTurn: ['inicio turno', 'iniciar turno', 'abrir turno', 'empezar turno'],
        closeTurn: ['cerrar turno', 'terminar turno', 'finalizar turno', 'fin turno'],
        queryTurns: ['mis turnos', 'estado turno', 'consultar turno', 'ver turnos'],
        help: ['ayuda', 'help', 'comandos', 'bot']
    },

    // 🎨 Messages
    messages: {
        welcome: `🤖 **Bot BeeZero - Comandos disponibles:**

🏁 **Iniciar turno:**
• "inicio turno"
• "iniciar turno auto: ABC123 caja: 500"
• "abrir turno daños: ninguno"

🔚 **Cerrar turno:**
• "cerrar turno"
• "terminar turno caja: 750"
• "fin turno daños: rayón lateral"

📊 **Consultar:**
• "mis turnos"
• "estado turno"
• "ver turnos"

🔒 **Sistema casado**: Solo quien inicia puede cerrar el turno.
📱 **Números**: Solo números bolivianos válidos.
🕐 **Horario**: Zona horaria de Bolivia.

💡 **Ejemplo completo:**
"inicio turno auto: Toyota ABC123 caja: 500 daños: ninguno"`,

        errors: {
            invalidPhone: '❌ Número de teléfono no válido',
            alreadyActive: '⚠️ Ya tienes un turno activo',
            noActiveTurn: '⚠️ No tienes un turno activo que puedas cerrar',
            systemError: '❌ Error interno del sistema. Contacta al administrador.',
            unauthorized: '🔒 Solo el número que inició el turno puede cerrarlo (sistema casado)'
        }
    },

    // 🔍 Validation
    validation: {
        requireValidPhone: true,
        enforceGroupRestriction: true,
        enableSystemCasado: true,
        allowMultipleActiveTurns: false
    }
};

/**
 * Validar configuración requerida
 */
function validateConfig() {
    const required = [
        'aws.accessKeyId',
        'aws.secretAccessKey',
        'aws.s3.bucketName'
    ];

    for (const key of required) {
        const value = key.split('.').reduce((obj, prop) => obj[prop], config);
        if (!value) {
            throw new Error(`❌ Configuración requerida faltante: ${key}`);
        }
    }

    console.log('✅ Configuración validada correctamente');
    return true;
}

/**
 * Obtener configuración formateada para logging
 */
function getConfigSummary() {
    return {
        bot: config.bot.name,
        version: config.bot.version,
        group: config.whatsapp.groupName,
        bucket: config.aws.s3.bucketName,
        debug: config.bot.debugMode,
        timezone: config.bot.timezone
    };
}

module.exports = {
    config,
    validateConfig,
    getConfigSummary
}; 