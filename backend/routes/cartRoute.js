import express from "express"
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js"
import authMiddleware from "../middleware/auth.js"
import { generalLimiter } from '../middleware/rateLimiter.js';
import { cartSchema } from "../validators/cartValidator.js";
import validate from "../middleware/validate.js";


const cartRouter = express.Router();
cartRouter.post("/add", generalLimiter, authMiddleware, validate(cartSchema), addToCart);
cartRouter.post("/remove", generalLimiter, authMiddleware, validate(cartSchema), removeFromCart);
cartRouter.post("/get", generalLimiter, authMiddleware, getCart);

export default cartRouter;
