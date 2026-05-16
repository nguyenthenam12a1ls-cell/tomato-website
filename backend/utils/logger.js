import winston from 'winston';
import 'winston-daily-rotate-file';

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: "info",

    format: customFormat,

    transports: [
        new winston.transports.Console({
            format: winston.format.simple() // Giữ format đơn giản cho console dễ nhìn
        }),

        new winston.transports.DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            datePattern: 'YYYY-MM-DD', // BẮT BUỘC để biến %DATE% hoạt động
            level: "error",
            maxFiles: '14d' // Giữ lại log trong 14 ngày
        }),

        new winston.transports.DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        })
    ]
});

export default logger;