import express from "express";
import cors from "cors";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import "./config/env.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import voucherRouter from "./routes/voucherRoute.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import morgan from "morgan";
import helmet from "helmet"
import compression from "compression"
import restaurantRouter from "./routes/restaurantRoute.js";
import globalErrorHandler from "./middleware/errorMiddleware.js";
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';

const app = express();
const port = 4000;

app.use(express.json({ type: "application/json" }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());
app.use(morgan("dev"));


app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use('/api/voucher', voucherRouter);
app.use('/api/restaurant', restaurantRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use(globalErrorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

export default app;
