const mongoose = require('mongoose');

module.exports =  percentSchema = new mongoose.Schema({
  percentage:{
    type:Number,
  },
  userId:{
    type:mongoose.Types.ObjectId
  },
})