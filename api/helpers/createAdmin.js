let mongoose = require("mongoose");
let dotenv = require("dotenv");
let bcrypt=require('bcrypt')
dotenv.config();
const schema=require('../app/authservices/model/userModel')
// Connect with MongoDB using mongoose at default port 27017

mongoose.connect(
  process.env.DB_URl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

 async function create(){
     let payload=({
      full_name : process.env.FULLNAME,
         email:process.env.ADMIN_EMAIL,
         roleId : 1,
         password:await bcrypt.hash(process.env.ADMIN_PWD,parseInt(process.env.SALT_ROUNDS)),
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
