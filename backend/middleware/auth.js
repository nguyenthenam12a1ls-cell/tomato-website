import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token || req.cookies?.token;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error in Auth Middleware (Token invalid or expired)" });
    }
};

export default authMiddleware;
