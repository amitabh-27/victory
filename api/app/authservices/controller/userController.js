
// import user model
let USER = require("../model/userModel");
let fs = require("fs");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let multer = require("multer");
const dir = "./uploads/fileUpload";

let dotenv = require("dotenv");
dotenv.config();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "profileImg" },
]);


const _user = {};

_user.login = async(req,res,next) =>{
  try {
    let payloadData = req.body;
    let findUser = await USER.findOne({email: payloadData.email, roleId :{$ne: 1}});
    if(!findUser){
      res.status(400).send({
        success: false,
        message: `Email /password do not match any existing accounts! Please try again.`,
      });
    } else {
      let passwordMatch = await bcrypt.compare(
        payloadData.password,
        findUser.password
      );
      if(!passwordMatch){
        res.status(400).send({
          success: false,
          message: `Password do not match! Please try again.`,
        });
      } else {
        let token_Data = {
          email: findUser.email,
          _id: findUser._id,
          roleId: findUser.roleId,
          assembly_cinstituency: findUser.assembly_cinstituency
        };
        var token = jwt.sign(token_Data, process.env.SECRET);
        res.json({
          success: true,
          bannerUrl: "uploads\\fileUpload\\1673767941408-beauty-bloom-blue-67636.jpg",
          token: token,
          message: `Login successfully`,
          data: findUser
        })
      }
    }
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
}

_user.editProfile = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        let data = req.body;
        let findUser = await USER.findOne({ _id: req.userId });
        if (req.files) {
          //uploading images
          if (req.files.profileImg) {
            let img = req.files.profileImg[0].path;
            data.profileImg = img;
          }
        }
    
        let updateProfile = await USER.findOneAndUpdate(
          { _id: req.userId },
          data,
          { new: true }
        );

        if (!updateProfile) {
          res.status(400).send({
            success: false,
            message: `ERROR_UPDATE`,
          });
        } else {
          res.status(200).send({
            success: true,
            message: "SUCCESS_UPDATE",
            data: updateProfile,
          });
        }
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.add_surveyor = async(req,res,next) => {
  try {
    let payloadData = req.body;
    payloadData.created_by = req.userId;
    payloadData.roleId = 3;
    let checkEmailExist = await USER.findOne({email: payloadData.email});
    if(checkEmailExist){
      res.send({
        success: true,
        message: `Email aready exit! Please try again.`,
      });
    } else {
      //encrypt password
      let hash = await bcrypt.hash(
        payloadData.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      const saveData = await new USER(payloadData).save();
      if (saveData) {
        res.send({
          success: true,
          message: `User added successfully`,
          data: saveData,
        });
      } else {
        res.send({
          success: true,
          message: `Fail to add user! Please try again.`,
        });
      }
    }
  } catch (err) {
    await setResponseObject(req, false, err.message, "");
    next();
  }
};

_user.update_surveyor = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        let data = req.body;

        let findUser = await USER.findOne({ _id: req.params.id });

        if (req.files) {
          let img = req.files.profileImg[0].path;
          data.profileImg = img;
        }

        let updateProfile = await USER.findOneAndUpdate(
          { _id: req.params.id },
          data,
          {
            new: true,
          }
        );

        if (!updateProfile) {
          res.status(400).send({
            success: false,
            message: "ERROR_UPDATE",
          });
        } else {
          res.status(200).send({
            success: true,
            message: "SUCCESS_UPDATE",
            data: updateProfile,
          });
        }
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.delete_surveyor = async(req,res,next) =>{
  try {
    const deleteProfile = await USER.findOneAndUpdate(
      { _id: req.params.userId },
      {stateId: 3},
      { new: true }
    );
    if(!deleteProfile){
      res.status(400).send({
        success: false,
        message: `Fail to delete user`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: `User deleted successfuly`,
      });
    }

  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
}

_user.get_my_surveyor = async (req, res, next) => {
  try {
    let result = await USER.aggregate([
      {
        $match: {
          created_by: mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $match: {
          stateId: "Active",
        },
      },
      {
        $sort: {
          createdAt: -1
        },
      },
    ]);

    if (result && result.length) {
      res.send({
        success: true,
        message: `surveyor successfully found`,
        data: result,
      });
    } else {
      res.send({
        success: true,
        message: `Client not found`,
        data: [],
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


module.exports = _user;
