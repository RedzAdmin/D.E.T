// D.E.T CONTACT GAIN - Backend Configuration
// ⚠️ SECURITY: Never commit this file with real credentials!
// Use .env file for actual deployment

const path = require('path');

const CONFIG = {
    // Server Configuration
    SERVER: {
        PORT: process.env.PORT || 3000,
        HOST: process.env.HOST || 'localhost',
        NODE_ENV: process.env.NODE_ENV || 'development',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500',
        RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
        RATE_LIMIT_MAX: 100 // requests per window
    },
    
    // Security
    SECURITY: {
        JWT_SECRET: process.env.JWT_SECRET || 'det-contact-gain-secret-key-2024-change-in-production',
        API_KEY: process.env.API_KEY || 'det-api-key-2024',
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '32-char-encryption-key-here!!!',
        SALT_ROUNDS: 10
    },
    
    // Email Service (For sending VCF files)
    EMAIL: {
        SERVICE: process.env.EMAIL_SERVICE || 'gmail',
        HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
        PORT: process.env.EMAIL_PORT || 587,
        SECURE: process.env.EMAIL_SECURE === 'true',
        USER: process.env.EMAIL_USER || 'your-email@gmail.com',
        PASSWORD: process.env.EMAIL_PASSWORD || 'your-app-password',
        FROM: process.env.EMAIL_FROM || 'D.E.T Contact Gain <noreply@detcontact.com>',
        TEMPLATE_PATH: path.join(__dirname, 'templates')
    },
    
    // Database/Storage
    STORAGE: {
        CONTACTS_FILE: path.join(__dirname, 'data', 'contacts.json'),
        BATCHES_FILE: path.join(__dirname, 'data', 'batches.json'),
        LOGS_FILE: path.join(__dirname, 'logs', 'app.log'),
        BACKUP_DIR: path.join(__dirname, 'backups')
    },
    
    // Batch System
    BATCH: {
        DEFAULT_TARGET: 50,
        AUTO_CLOSE: true,
        AUTO_SEND_VCF: true,
        VCF_FILE_NAME: 'DET_Contacts_{batch_id}.vcf',
        EMAIL_SUBJECT: 'D.E.T Contact Gain - Your VCF File for Batch {batch_id}',
        RETENTION_DAYS: 30
    },
    
    // File Uploads
    UPLOADS: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_MIME_TYPES: ['text/x-vcard', 'text/vcard'],
        UPLOAD_DIR: path.join(__dirname, 'uploads')
    },
    
    // Logging
    LOGGING: {
        LEVEL: process.env.LOG_LEVEL || 'info',
        FILE_ENABLED: true,
        CONSOLE_ENABLED: true,
        FORMAT: 'combined'
    },
    
    // Monitoring
    MONITORING: {
        ENABLED: true,
        SENTRY_DSN: process.env.SENTRY_DSN,
        NEW_RELIC_KEY: process.env.NEW_RELIC_KEY
    },
    
    // API Versioning
    API: {
        VERSION: 'v1',
        PREFIX: '/api/v1',
        DOCS_PATH: '/api-docs'
    },
    
    // Features Flags
    FEATURES: {
        EMAIL_VERIFICATION: true,
        CAPTCHA: false,
        TWO_FACTOR_AUTH: false,
        WEBHOOKS: false,
        ANALYTICS: true
    },
    
    // External Services
    SERVICES: {
        // Add API keys for external services
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        TWILIO_SID: process.env.TWILIO_SID,
        TWILIO_TOKEN: process.env.TWILIO_TOKEN,
        GOOGLE_RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET
    }
};

// Validate required environment variables
const requiredEnvVars = [
    'EMAIL_USER',
    'EMAIL_PASSWORD'
];

if (process.env.NODE_ENV === 'production') {
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            console.error(`❌ Missing required environment variable: ${envVar}`);
            process.exit(1);
        }
    });
}

module.exports = CONFIG;