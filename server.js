const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = 30005


const router = require('./routes/api');
var bodyParser = require('body-parser')
app.use(bodyParser.json());

var cors = require('cors')
app.use(cors())

const fileupload = require("express-fileupload");
app.use(fileupload());

app.use('/images', express.static('/public/uploads')); // sharing static files


const dburl = "mongodb://localhost:27017/myapp"
let db = mongoose.connect(dburl , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB connected");
}).catch(err => {
  console.log(err);
})

app.use(router)

app.listen(port, () => {
  console.log("Server listening on ", port);
})