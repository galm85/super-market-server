const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId},
    contactName:{type:String,required:true},
    contactPhone:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,requirrequired:true},
    deliveryDate:{type:String,required:true},
    payment:{
        creditCardType:String,
        creditCardNumber:String,
        creditCardOwner:String,
        creditCardNumberExpireDate:String,
        ccvCode:String,
        paymentsNumber:Number,
    },
    status:String,
    totalPrice:Number,
    cart:[]
},{timestamps:true})


const Order = mongoose.model('Order',orderSchema);

module.exports =Order;