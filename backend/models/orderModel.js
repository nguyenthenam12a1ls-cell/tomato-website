import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    
    // ✅ THÊM CÁC FIELD MỚI CHO VNPAY/STRIPE
    paymentMethod: { 
        type: String, 
        enum: ["stripe", "vnpay", "cod"], 
        default: "cod" 
    },
    originalAmount: { 
        type: Number 
    }, // Số tiền USD gốc (trước khi quy đổi)
    currency: { 
        type: String, 
        enum: ["usd", "vnd"], 
        default: "usd" 
    }, // Loại tiền tệ
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;