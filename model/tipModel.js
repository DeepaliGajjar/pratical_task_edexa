const mongoose = require('mongoose');

module.exports =  tipSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId
  },
  place : {
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  percentage:{
    type:Number,
    required:true
  },
  tip:{
    type:Number
  },
  created_At:{
    type:Date,
    default:Date.now
  }
})