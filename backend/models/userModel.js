import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    cartData:{type:Object,default:{}},
    
    googleId: {type:String, unique:true, sparse:true},
    avatar: {type:String, default:''},
    phone: {type:String, default:''},
    street: {type:String, default:''},
    ward: {type:String, default:''},
    province: {type:String, default:''},
    country: {type:String, default:''},
    
}, {minimize: false})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;