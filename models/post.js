const mongoose = require('mongoose');
const Schema=mongoose.Schema

const postşema= new mongoose.Schema({
    title:{type:String,require:true},
    author:{type:Schema.Types.ObjectId,ref:'users'},
    content:{type:String,require:true},
    date:{type:Date,default:Date.now},
    category:{type:Schema.Types.ObjectId,ref:'categories'},
 
})
module.exports=mongoose.model('Post',postşema)