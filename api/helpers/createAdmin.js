let mongoose = require("mongoose");
let dotenv = require("dotenv");
let bcrypt=require('bcrypt')
dotenv.config();
const schema=require('../app/authservices/model/userModel')
// Connect with MongoDB using mongoose at default port 27017

mongoose.connect(
  "mongodb://127.0.0.1:27017/victory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

 async function create(){
     let payload=({
        full_name : "Admin",
        email: "admin@victory.in",
        roleId : 1,
        password:await bcrypt.hash("Admin@123",parseInt(10)),
      })
     

     let save=await schema(payload).save()
     if(save){
        console.log("admin created successfully")
        process.exit()    
        }
     else{
         console.log("An error occurred")
         process.exit()
     }
  }

  create()
