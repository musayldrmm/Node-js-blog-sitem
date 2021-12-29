const mongoose = require('mongoose');

const categoryşema= new mongoose.Schema({
    name:{type:String,required:true,unique:true}
})
module.exports=mongoose.model('category',categoryşema)