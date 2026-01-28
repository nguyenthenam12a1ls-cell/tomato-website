import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // 1. Lấy token từ header
    const { token } = req.headers; 

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        // 2. Giải mã token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 3. --- SỬA LỖI CHÍNH ---
        // Gắn 'id' (từ token) vào 'req.userId' (cách làm chuẩn)
        // Đây là cách đúng và sẽ hoạt động cho cả request GET và POST
        req.userId = token_decode.id; 

        next(); // Cho phép đi tiếp
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error in Auth Middleware (Token invalid or expired)" });
    }
}

export default authMiddleware;