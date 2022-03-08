const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    category_id:{type:mongoose.Types.ObjectId},
    department_id:{type:mongoose.Types.ObjectId},
    price:{type:Number,required:true},
    salePrice:{type:Number},
    image:{type:String,required:true},
    onStock:{type:Boolean},
    onSale:{type:Boolean},
},{timestamps:true})


const Product = mongoose.model('Product',productSchema);

module.exports =Product;