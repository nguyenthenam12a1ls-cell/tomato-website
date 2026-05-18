import { prisma } from "../config/prisma.js"
import AppError from "../utils/AppError.js";

const adminAuth = async (req, res, next) => {

    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== "admin") {
            throw new AppError("Quyền truy cập bị từ chối", 403);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export default adminAuth;