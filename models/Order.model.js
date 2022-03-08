const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
            user_id:mongoose.Types.ObjectId,
            status:String,
            totalPrice:Number,
            details:[]
},{timestamps:true})


const Order = mongoose.model('Order',orderSchema);

module.exports =Order;