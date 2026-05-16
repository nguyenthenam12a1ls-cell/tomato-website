import logger from './utils/logger.js';

console.log("Đang bắt đầu ghi log test...");

logger.info("Đây là một thông báo bình thường (sẽ được ghi vào application.log)");

logger.error("Đây là một lỗi mô phỏng!", {
    statusCode: 500,
    stack: "Error: Lỗi mô phỏng\n    at Object.<anonymous> (test_logger.js:5:1)\n    at Module._compile (node:internal/modules/cjs/loader:1356:14)",
    path: "/api/test",
    method: "POST"
});

console.log("Ghi log test hoàn tất! Hãy kiểm tra thư mục logs.");
