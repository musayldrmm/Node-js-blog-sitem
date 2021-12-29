const mongoose = require('mongoose');

const userşema= new mongoose.Schema({
    username:{type:String,require:true,unique:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true}
})
module.exports=mongoose.model('User',userşema)