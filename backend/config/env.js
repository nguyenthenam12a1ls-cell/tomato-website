import "dotenv/config";

const requireEnv = [
    "DATABASE_URL",
    "JWT_SECRET",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY",
    "VNP_HASHSECRET",
    "VNP_TMNCODE",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
];

requireEnv.forEach((name) => {
    if (!process.env[name]) {
        console.error(`Lỗi Khởi động: Thiếu biến môi trường "${name}" trong file .env`);
        process.exit(1);
    }
});

export const env = {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    vnpHashSecret: process.env.VNP_HASHSECRET,
    vnpTmnCode: process.env.VNP_TMNCODE,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4000
};

