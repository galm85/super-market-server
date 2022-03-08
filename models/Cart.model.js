const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,required:true},
    items:{type:Array},
},{timestamps:true});



const Cart = mongoose.model('Cart',cartSchema);

module.exports =Cart;