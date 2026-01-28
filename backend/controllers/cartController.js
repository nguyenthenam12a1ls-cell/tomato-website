import userModel from "../models/userModel.js";

// add items to user cart 
const addToCart = async(req,res) => {
    try {
        // SỬA: Đọc từ req.userId (do auth.js cung cấp)
        let userData = await userModel.findById(req.userId); 
        
        if (!userData) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }

        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        
        // SỬA: Dùng req.userId để cập nhật
        await userModel.findByIdAndUpdate(req.userId,{cartData}); 
        res.json({success:true, message:"Added To Cart"});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// remove items from user cart 
const removeFromCart = async(req,res) => {
    try {
        // SỬA: Đọc từ req.userId
        let userData = await userModel.findById(req.userId); 
        
        if (!userData) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }

        let cartData = await userData.cartData;
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        
        // SỬA: Dùng req.userId để cập nhật
        await userModel.findByIdAndUpdate(req.userId,{cartData}); 
        res.json({success:true,message:"Removed From Cart"});
    } catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// fetch user cart data 
const getCart = async(req,res) => {
    try {
        // SỬA: Đọc từ req.userId
        let userData = await userModel.findById(req.userId); 
        
        if (!userData) {
            return res.json({ success: false, message: "Không tìm thấy user" });
        }

        let cartData = await userData.cartData;
        res.json({success:true,cartData});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}
export {addToCart, removeFromCart, getCart}