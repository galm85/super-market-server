const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema({
    title:{type:String,require:true},
    image:{type:String,require:true},
    department_id:{type:mongoose.Types.ObjectId,require:true},
    location:{type:String,required:true}

},{timestamps:true})


const Categorie = mongoose.model('Categorie',categorieSchema);

module.exports =Categorie;