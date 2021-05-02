const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema({
    title:{type:String,require:true},
    image:{type:String,require:true},
},{timestamps:true})


const Categorie = mongoose.model('Categorie',categorieSchema);

module.exports =Categorie;