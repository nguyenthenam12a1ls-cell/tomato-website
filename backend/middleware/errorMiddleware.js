import logger from "../utils/logger.js";

const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    if (err.code === "P2025") {
        error.message = "Không tìm thấy dữ liệu yêu cầu";
        error.statusCode = 404;
        error.status = 'fail';
    }

    if (err.code === "P2002") {
        error.message = "Dữ liệu bị trùng lặp";
        error.statusCode = 400;
        error.status = 'fail';
    }

    // Ghi log lỗi bằng Winston thay vì console.error
    logger.error(error.message, {
        statusCode: error.statusCode,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(error.statusCode).json({
        success: false,
        status: error.status,
        message: error.message || "Đã xảy ra lỗi hệ thống",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default globalErrorHandler;