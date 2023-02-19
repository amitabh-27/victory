let mongoose = require("mongoose");
let dotenv = require("dotenv");
let bcrypt=require('bcrypt')
dotenv.config();
const schema=require('../app/userService/model/userModel')
const getRandomName = require("../middleware/commonFunction").getRandomName
const getRandomEmail = require("../middleware/commonFunction").getRandomEmail

// Connect with MongoDB using mongoose at default port 27017

mongoose.connect(
  "mongodb://127.0.0.1:27017/victory",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

 async function create(){
    for (var i = 1; i <= 30; i++) {    
     
        let payload=({
            fullName : getRandomName(6),
            email:getRandomEmail(6) + i + "@victory.in",
            password:await bcrypt.hash("victory@123",parseInt(10)),
            
        })
   
        let save=await schema(payload).save()
      }

     if(create){
        console.log("users created successfully")
        process.exit()    
        }
     else{
         console.log("An error occurred")
         process.exit()
     }
  }

  create()