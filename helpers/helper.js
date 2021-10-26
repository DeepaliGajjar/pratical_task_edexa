const mongoose = require('mongoose');
const userSchema = require('../model/userModel');
const tipSchema = require('../model/tipModel');
const percentSchema = require('../model/percentModel');
const user = mongoose.model('users',userSchema);
const tips = mongoose.model('tips',tipSchema);
const percent = mongoose.model('percent',percentSchema);
const jwt = require("jsonwebtoken");

async function registeruser(req,res){
  try{
    let query = {
      email:req.body.email,
      password:req.body.password
    }
    await user.findOne(query).then(result => {
      if(result){
        let new_user = new user(req.body)
        new_user.save((err,data) => {
          if(err){
            console.log(err,"err");
            res.json({
              code:500,
              message: "Something went wrong"
            })
          }
          if(data){
            res.json({
              code:200,
              message: "Registered successfully",
              data:data.name
            })
          }
        })
      }
      else{
        res.json({
          code:200,
          message: "User already Registered",
        })
      }
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}

async function login (req,res){
  try{
    let query = {
      email:req.body.email,
      password:req.body.password
    }
    await user.findOne(query).then(async (result) => {
      if(result){      
        var token = jwt.sign({ payload: result }, 'shhhhh')
        res.json({
          code:200,
          message: "Login Successfully!",
          data:{token:token}
        })
      }
      else{
        res.json({
          code:200,
          message: "Enter valid Credentials!",
          data:{token:token}
        })    
      }
    }).catch(err => {
      console.log(err);
      res.json({
        code:200,
        message: "Something went wrong",
        data:{token:token}
      })    
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}

async function addtip(req,res){
  try{
    var decoded = jwt.verify(req.headers.token, 'shhhhh');
    let _id = decoded['payload']._id

    req.body.tip = Number(Number(req.body.percentage) * Number(req.body.amount))/100
    req.body.userId = mongoose.Types.ObjectId(_id)
    let new_tip = new tips(req.body)

    new_tip.save((err,data) => {
      if(err){
        console.log(err,"err");
        res.json({
          code:500,
          message: "Something went wrong"
        })
      }
      if(data){
        res.json({
          code:200,
          message: "Tip Added successfully",
          data:data.name
        })
      }
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}

async function gettip(req,res){
  try{
    var decoded = jwt.verify(req.headers.token, 'shhhhh');
    let query = {
      userId:mongoose.Types.ObjectId(decoded['payload']._id),
    }
    await tips.find(query).sort({created_At:-1}).then(async (result) => {
      if(result){
        res.json({
          code:200,
          message: "Get Successfully",
          data:result
        })
      }
      else{
        res.json({
          code:500,
          message: "Something went wrong"
        })
      }
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}


async function addpercent(req,res){
  try{
    var decoded = jwt.verify(req.headers.token, 'shhhhh');
    let _id = decoded['payload']._id
    req.body.userId = mongoose.Types.ObjectId(_id)
    let new_percent = new percent(req.body)

    new_percent.save((err,data) => {
      if(err){
        console.log(err,"err");
        res.json({
          code:500,
          message: "Something went wrong"
        })
      }
      if(data){
        res.json({
          code:200,
          message: "Percent Added successfully",
          data:data.name
        })
      }
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}

async function getpercent(req,res){
  try{
    var decoded = jwt.verify(req.headers.token, 'shhhhh');
    let query = {
      userId:mongoose.Types.ObjectId(decoded['payload']._id),
    }
    await percent.find(query).sort({created_At:-1}).then(async (result) => {
      if(result){
        res.json({
          code:200,
          message: "Get Successfully",
          data:result
        })
      }
      else{
        res.json({
          code:500,
          message: "Something went wrong"
        })
      }
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}

async function getfilteredtip(req,res){
  try{
    console.log(req.body);
    let startDate = new Date(req.body.startDate)
    let endDate = new Date(req.body.endDate)
    let decoded = jwt.verify(req.headers.token, 'shhhhh');
    let maxdata
    let query = {
      userId:mongoose.Types.ObjectId(decoded['payload']._id),
      created_at:{
        $gte: startDate,
        $lte: endDate
      },
    }
    if(req.body.analyticstype === "tipPercentage"){
    let aggregateQuery = [
      {"$match": {userId:mongoose.Types.ObjectId(decoded['payload']._id) }}, 
      {"$group" : { "_id": "$percentage", "count": { "$sum": 1 } } },
      {"$project": {"maxpercentage" : "$count","percentage":"$_id", "_id" : 0}}
    ]
      await tips.aggregate(aggregateQuery).then(async (result) => {
        if(result){
          let max = Math.max.apply(Math, result.map(function(o) { return o.maxpercentage; }))
          console.log(max);
          maxdata = result.filter(e=> e.maxpercentage === max)
        }
      })
      if(maxdata.length > 0){
        query['percentage'] = maxdata[0].percentage
      }
    }
    else if(req.body.analyticstype === "mostvisited"){
      let aggregateQuery = [
        {"$match": {userId:mongoose.Types.ObjectId(decoded['payload']._id) }}, 
        {"$group" : { "_id": "$place", "count": { "$sum": 1 } } },
        {"$project": {"maxvisited" : "$count","place":"$_id", "_id" : 0}}
      ]
      await tips.aggregate(aggregateQuery).then(async (result) => {
        if(result){
          console.log(result);
          let max = Math.max.apply(Math, result.map(function(o) { return o.maxvisited; }))
          console.log(max);
          maxdata = result.filter(e=> e.maxvisited === max)
        }
      })
      if(maxdata.length > 0){
        query['place'] = maxdata[0].place
      }
    }
    await tips.find(query).then(async (result) => {
      if(result){
        res.json({
          code:200,
          message: "Get Successfully",
          data:result
        })
      }
      else{
        res.json({
          code:500,
          message: "Something went wrong"
        })
      }
    })
  }
  catch(exception){
    console.log(exception);
    res.json({
      code:500,
      message: "Something went wrong"
    })
  }
}

module.exports = {
  registeruser,
  login,
  addtip,
  gettip,
  getfilteredtip,
  addpercent,
  getpercent
}
