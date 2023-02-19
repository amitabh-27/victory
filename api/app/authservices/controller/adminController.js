
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
  { name: "bannerImg" },
]);


const _user = {};

_user.uploadFile = async (req, res, next) => {
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
        if (req.files) {
          //uploading images
          if (req.files.bannerImg) {
            let img = req.files.bannerImg[0].path;
            data.bannerImg = img;
          }
        }
        res.json({
          success: false,
          message: `File uploaded successfully`,
          data: data
        });

      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.login = async(req,res,next) =>{
  try {
    let payloadData = req.body;
    let findUser = await USER.findOne({email: payloadData.email, roleId : 1});
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
        };
        var token = jwt.sign(token_Data, process.env.SECRET);
        res.json({
          success: true,
          token: token,
          bannerUrl: "",
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
};

_user.myProfile = async (req, res, next) => {
  try {
    let findUser = await USER.findOne({ _id: req.userId });
    if (!findUser) {
      res.status(400).send({
        success: false,
        message: `ERROR_UPDATE`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "SUCCESS_UPDATE",
        data: findUser,
      });
    }
     
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

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

_user.updateClientInfo = async (req, res, next) => {
  try {
    let data = req.body;
    console.log(`data`, data)

    if(data.password && data.password.trim().length > 0){
    console.log(`password`, data.password)

      data.password = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );
    }

    console.log(`data111`, data)


    let updateProfile = await USER.findOneAndUpdate(
      { _id: req.params.userId },
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
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.addClient = async(req,res,next) => {
  try {
    let payloadData = req.body;
    payloadData.created_by = req.userId;
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
}

_user.getClientById111 = async(req,res,next) => {
  try {
    let payloadData = req.query;
    let checkEmailExist = await USER.findOne({_id: payloadData.userId});
    if(!checkEmailExist){
      res.send({
        success: true,
        message: `User not found! Please try again.`,
      });
    } else {
        res.send({
          success: true,
          message: `User added successfully`,
          data: checkEmailExist,
        });
    }
  } catch (err) {
    await setResponseObject(req, false, err.message, "");
    next();
  }
}

_user.getAllClients = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let page = parseInt(req.query.page) || 1;

    var sorting = {};
    switch (req.query.sorting) {
      case "1":
        sorting = {
          stateId: "Active",
        };
        break;
      case "2":
        sorting = {
          stateId: "In-Active",
        };
        break;
      case "3":
        sorting = {
          stateId: "Banned",
        };
        break;
      case "4":
        sorting = {
          stateId: "Deleted",
        };
        break;
      default:
        sorting = {};
    }

    let filterSearch = {};
    if (req.query.search && req.query.search !== "undefined") {
      filterSearch = {
        $or: [
          {
            full_name: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            email: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            phone_number: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            state_code: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            district: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            assembly_cinstituency: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let result = await USER.aggregate([
      {
        $match: {
          roleId: 2,
        },
      },
      {
        $match: filterSearch,
      },
      {
        $match: sorting,
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$created_by" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
          ],
          as: "created_by",
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1
        },
      },
      {
        $project:{
          _id: 1,
          stateId: 1,
          roleId: 1,
          profileImg: 1,
          full_name: 1,
          email: 1,
          phone_number: 1,
          state_code: 1,
          district: 1,
          assembly_cinstituency: 1,
          gender: 1,
          created_by: {
            _id: 1, full_name: 1, profileImg: 1
          }
        }
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (page - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (result && result[0].data.length) {
      res.send({
        success: true,
        message: `Client successfully found`,
        data: result[0].data,
        count: result[0].count[0].count,
      });
    } else {
      res.send({
        success: true,
        message: `Client not found`,
        data: [],
        count: 0,
      });
    }
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.getClientById = async (req, res, next) => {
  try {
    let result = await USER.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.query.userId),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$created_by" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
          ],
          as: "created_by",
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project:{
          _id: 1,
          stateId: 1,
          roleId: 1,
          profileImg: 1,
          full_name: 1,
          email: 1,
          phone_number: 1,
          state_code: 1,
          district: 1,
          assembly_cinstituency: 1,
          gender: 1,
          created_by: {
            _id: 1, full_name: 1, profileImg: 1
          }
        }
      },
    ]);

    if (result) {
      res.send({
        success: true,
        message: "",
        data: result[0],
      });
    } else {
      res.send({
        success: true,
        message: "",
      });
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.updateProfileByAdmin = async (req, res, next) => {
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

_user.deleteUser = async(req,res,next) =>{
  try {
    const deleteProfile = await USER.findOneAndUpdate(
      { _id: req.params.userId },
      {stateId: "Deleted"},
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

_user.getAllStaffs = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || constant.PAGE_LIMIT;
    let page = parseInt(req.query.page) || constant.PAGE;

    var sorting = {};
    switch (req.query.sorting) {
      case "1":
        sorting = {
          stateId: 0,
        };
        break;
      case "2":
        sorting = {
          stateId: 1,
        };
        break;
      case "3":
        sorting = {
          stateId: 2,
        };
        break;
      case "4":
        sorting = {
          stateId: 3,
        };
        break;
      default:
        sorting = { };
    }

    let filterSearch = {};
    if (req.query.search && req.query.search !== "undefined") {
      filterSearch = {
        $or: [
          {
            fullName: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            post: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            phoneNumber: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            whatsappNo: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let result = await USER.aggregate([
      {
        $match: {
          roleId: 1,
        },
      },
      {
        $match: filterSearch,
      },
      {
        $match: sorting,
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: '$createdBy',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1
        },
      },
      {
        $project:{
          _id: 1,
          stateId: 1,
          roleId: 1,
          profileImg: 1,
          phoneNumber: 1,
          fullName: 1,
          email: 1,
          address: 1,
          city: 1,
          stateTxt: 1,
          zipCode: 1,
          createdBy: {
            _id: 1, fullName: 1
          },
        }
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (page - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (result && result[0].data.length) {
      res.send({
        success: true,
        message: ".FOUND",
        data: result[0].data,
        count: result[0].count[0].count,
      });
    } else {
      res.send({
        success: true,
        message: "NOT_FOUND User ",
        data: [],
        count: 0,
      });
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.getSingleStaff = async (req, res, next) => {
  try {
    let result = await USER.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.query.userId),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: '$createdBy',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1
        },
      },
      {
        $project:{
          _id: 1,
          stateId: 1,
          roleId: 1,
          profileImg: 1,
          phoneNumber: 1,
          fullName: 1,
          email: 1,
          address: 1,
          city: 1,
          stateTxt: 1,
          zipCode: 1,
          createdBy: {
            _id: 1, fullName: 1
          },
        }
      },
    ]);

    if (result) {
      res.send({
        success: true,
        message: "",
        data: result[0],
      });
    } else {
      res.send({
        success: true,
        message: "",
      });
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


_user.getAllVolunteer = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let page = parseInt(req.query.page) || 1;

    var sorting = {};
    switch (req.query.sorting) {
      case "1":
        sorting = {
          stateId: "Active",
        };
        break;
      case "2":
        sorting = {
          stateId: "In-Active",
        };
        break;
      case "3":
        sorting = {
          stateId: "Banned",
        };
        break;
      case "4":
        sorting = {
          stateId: "Deleted",
        };
        break;
      default:
        sorting = {};
    }

    let filterSearch = {};
    if (req.query.search && req.query.search !== "undefined") {
      filterSearch = {
        $or: [
          {
            full_name: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            email: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            phone_number: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            state_code: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            district: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            assembly_cinstituency: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let result = await USER.aggregate([
      {
        $match: {
          roleId: 3,
        },
      },
      {
        $match: filterSearch,
      },
      {
        $match: sorting,
      },
      {
        $lookup: {
          from: "user-models",
          let: { id: "$created_by" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
          ],
          as: "created_by",
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1
        },
      },
      {
        $project:{
          _id: 1,
          stateId: 1,
          roleId: 1,
          profileImg: 1,
          full_name: 1,
          email: 1,
          phone_number: 1,
          state_code: 1,
          district: 1,
          gender: 1,
          created_by: {
            _id: 1, full_name: 1, profileImg: 1
          }
        }
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (page - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (result && result[0].data.length) {
      res.send({
        success: true,
        message: `volunteer successfully found`,
        data: result[0].data,
        count: result[0].count[0].count,
      });
    } else {
      res.send({
        success: true,
        message: `volunteer not found`,
        data: [],
        count: 0,
      });
    }
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.activeInactive = async(req,res,next) =>{
  try {
    const findUser = await USER.findOne({_id: req.params.id});
    
    if(findUser && findUser.stateId == "In-Active"){
      const updateData = await USER.findOneAndUpdate(
        {_id: req.params.id},
        {stateId: "Active"},
        {new: true},
      );
      res.json({
        success: true,
        message: `User active successfully`
      })
      
    } else {
      const updateData = await USER.findOneAndUpdate(
        {_id: req.params.id},
        {stateId: "In-Active"},
        {new: true},
      );
      res.json({
        success: true,
        message: `User in-active successfully`
      })
      
    }
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
}




module.exports = _user;
