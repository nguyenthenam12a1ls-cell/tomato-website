import { rateLimit } from 'express-rate-limit';


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: { success: false, message: "Quá nhiều yêu cầu , thử lại sau 15 phút" }
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: { success: false, message: "Quá nhiều yêu cầu , thử lại sau 15 phút" }
});

export { authLimiter, generalLimiter };
