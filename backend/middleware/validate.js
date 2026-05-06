const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // lấy danh sách các lỗi từ Zod và trả về cho client
        const errors = result.error.issues.map(e => e.message);

        return res.status(400).json({ success: false, message: errors[0], errors });
    }

    // Dữ liệu hợp lệ , ghi đè req.body bằng dữ liệu đã được zod parse(sạch và đúng kiểu)

    req.body = result.data;
    next();
};

export default validate;