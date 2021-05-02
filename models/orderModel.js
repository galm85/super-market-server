const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
            userId:String,
            name:String,
            email:String,
            image:String,
            phone:String,
            address:String,
            city:String,
            orders:[],
            status:String,
            totalPrice:Number
},{timestamps:true})


const Order = mongoose.model('Order',orderSchema);

module.exports =Order;