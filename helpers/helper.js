const mongoose = require('mongoose');
const userSchema = require('../model/userModel');
const user = mongoose.model('users',userSchema);

async function registeruser(req,res){
  console.log(req.body);
  // console.log(req.files);
  // var str = req.files.profilePicture.name;
  // req.files.profilePicture.name = str.replace(/\s/g, "_");

  // let filename = new Date().getTime() + "-" + req.files.profilePicture.name;

  // await req.files.profilePicture.mv("../public/uploads/" + filename, function (err) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // req.body.profilePicture = filename;
  let new_user = new user(req.body)
  new_user.save((err,data) => {
    if(err){
      console.log(err,"err");
      res.json({
        message: "Something went wrong"
      })
    }
    if(data){
      res.json({
        message: "Registered successfully",
        data:data.name
      })
    }
  })
}

async function login (rea,res){
  console.log(req.body);
}

module.exports = {
  registeruser,
  login
}
