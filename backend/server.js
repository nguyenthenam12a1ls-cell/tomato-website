import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cookieParser from 'cookie-parser';

// Import cho các tính năng mới
import session from 'express-session';
import passport from './config/passport.js'; 
// import chatRouter from './routes/chatRoute.js' // <-- ĐÃ XÓA DÒNG NÀY

// app config
const app = express();
const port = 4000;

// --- SỬA THỨ TỰ MIDDLEWARE ---

// 1. Phải chạy express.json() ĐẦU TIÊN
app.use(express.json());

// 2. Chạy cors()
app.use(cors());

// 3. Chạy cookieParser()
app.use(cookieParser());

// 4. Cấu hình Session & Passport
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));
app.use(passport.initialize());
// ----------------------------

// db connection 
connectDB();

// api endpoints 
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
// app.use("/api/chat", chatRouter); // <-- ĐÃ XÓA DÒNG NÀY

app.get("/", (req,res) =>  {
    res.send("API Working");
});

app.listen(port,() => {
    console.log(`Server started on http://localhost:${port}`);
})