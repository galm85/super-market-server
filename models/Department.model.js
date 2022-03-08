const mongoose = require('mongoose');


const departmentSchema = new mongoose.Schema({
    title:{type:String,require:true},
    image:{type:String,require:true},
    location:{type:String,required:true}
   
},{timestamps:true})


const Department = mongoose.model('Department',departmentSchema);

module.exports =Department;