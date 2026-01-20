// D.E.T CONTACT GAIN - Frontend Configuration
// ⚠️ SECURITY WARNING: These are public configs. Sensitive data should be in backend config only

const DET_CONFIG = {
    // App Identity
    APP_NAME: "D.E.T CONTACT GAIN",
    APP_VERSION: "1.0.0",
    DEVELOPER: "CODEBREAKER",
    
    // Batch System
    BATCH_SYSTEM: {
        CURRENT_BATCH_ID: "DET-BATCH-001",
        BATCH_NAME: "Dark Empire Tech Launch",
        TARGET_CONTACTS: 50,
        BATCH_STATUS: "ACTIVE", // ACTIVE, COMPLETED, CLOSED
        AUTO_SEND_VCF: true,
        ALLOW_MULTIPLE_ENTRIES: false
    },
    
    // Social Links
    SOCIAL: {
        WHATSAPP_CHANNEL: "https://whatsapp.com/channel/your-channel-id",
        WHATSAPP_DIRECT: "https://wa.me/2347030626048",
        GITHUB_PROFILE: "https://github.com/codebreaker-dett",
        TWITTER: "https://twitter.com/codebreaker_det",
        TELEGRAM: "https://t.me/det_channel"
    },
    
    // API Configuration
    API: {
        BASE_URL: window.location.hostname.includes('localhost') 
            ? 'http://localhost:3000/api' 
            : 'https://api.yourdomain.com',
        ENDPOINTS: {
            SUBMIT_CONTACT: '/contacts',
            GET_STATS: '/stats',
            CHECK_BATCH: '/batch',
            VERIFY_EMAIL: '/verify'
        },
        RETRY_ATTEMPTS: 3,
        TIMEOUT: 10000 // 10 seconds
    },
    
    // Animations
    ANIMATIONS: {
        ENABLED: true,
        DURATION: {
            SHORT: 300,
            MEDIUM: 600,
            LONG: 1000
        },
        EASING: "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    
    // Validation
    VALIDATION: {
        PHONE_REGEX: /^\+[1-9]\d{1,14}$/,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 50
    },
    
    // Features
    FEATURES: {
        REAL_TIME_PROGRESS: true,
        NOTIFICATIONS: true,
        AUTO_REFRESH_STATS: true,
        REFRESH_INTERVAL: 30000, // 30 seconds
        SHOW_WATERMARK: true
    },
    
    // UI Settings
    UI: {
        THEME: "dark",
        ACCENT_COLOR: "#6a11cb",
        SECONDARY_COLOR: "#2575fc",
        GLOW_EFFECT: true,
        PARTICLES_COUNT: 5,
        FLOATING_BUTTONS: true
    },
    
    // Messages
    MESSAGES: {
        SUCCESS: "Contact added successfully! You'll receive the VCF file via email when the batch is complete.",
        ERROR: "Something went wrong. Please try again.",
        VALIDATION_ERROR: "Please check your input and try again.",
        BATCH_COMPLETE: "🎉 Batch complete! VCF files are being sent to all participants.",
        LOADING: "Processing...",
        EMAIL_SENT: "VCF file sent to your email!"
    },
    
    // SEO & Analytics
    META: {
        TITLE: "D.E.T CONTACT GAIN - Batch Contact Collection System",
        DESCRIPTION: "Join our contact collection batches. When batch is full, receive all contacts as VCF file via email.",
        KEYWORDS: "contact collection, vcf, batch system, networking, D.E.T, CodeBreaker",
        OG_IMAGE: "/assets/og-image.png"
    }
};

// Freeze config to prevent modifications
Object.freeze(DET_CONFIG);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DET_CONFIG;
}