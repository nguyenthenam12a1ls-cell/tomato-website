import { PrismaClient } from "@prisma/client";
import { sendError } from "../utils/response.js";

const prisma = new PrismaClient();

const adminAuth = async (req, res, next) => {

    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== "admin") {
            return sendError(res, "Quyền truy cập bị từ chối", 403);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export default adminAuth;