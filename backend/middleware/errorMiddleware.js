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

    res.status(error.statusCode).json({ // Dùng error.statusCode
        success: false,
        status: error.status,         // Dùng error.status
        message: error.message || "Đã xảy ra lỗi hệ thống", // Dùng error.message
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default globalErrorHandler;