import express from "express"
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js"
import { generalLimiter } from '../middleware/rateLimiter.js';


const cartRouter = express.Router();
cartRouter.post("/add", generalLimiter, authMiddleware, addToCart);
cartRouter.post("/remove", generalLimiter, authMiddleware, removeFromCart);
cartRouter.post("/get", generalLimiter, authMiddleware, getCart);

export default cartRouter;
