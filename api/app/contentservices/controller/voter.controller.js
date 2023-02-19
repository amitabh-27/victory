const { setResponseObject } = require('../../../middleware/commonFunction');
const VOTER_MODEL = require('../model/voters.model');
const USER = require("../../authservices/model/userModel")
const translate = require('translate-google');
const { default: mongoose } = require('mongoose');
const { QUESTION_MODEL } = require('../../qnaservices/model/qna.model');

let fs = require("fs");
let multer = require("multer");
const dir = "./uploads/voters";
var csv = require('csvtojson')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "votersfile" },
]);

const _voters = {};

_voters.addVotersManual = async (req,res,next) =>{
    try {
        const payloadData = req.body;
        payloadData.created_by = req.userId;

        // let fullName = await translate(payloadData.full_name, {to: 'hi'}).then(res => {
        //     payloadData.full_name_hindi = res;
        // }).catch(err => {
        //     console.error(err)
        // })

        payloadData.full_name_hindi = await translate(payloadData.full_name, {to: 'hi'});
        payloadData.father_name_hindi = await translate(payloadData.father_name, {to: 'hi'});

        const saveData = await VOTER_MODEL.create(payloadData);
        if (saveData) {
            res.send({
            success: true,
            message: `Voter added successfully`,
            data: saveData,
            });
        } else {
            res.send({
            success: true,
            message: `Fail to add voter! Please try again.`,
            });
        }

    } catch (error) {
        console.log(`error`, error)
        await setResponseObject(req, false, error.message, "");
        next();
    }
}

_voters.updateVoter = async (req,res,next) =>{
    try {
      let payloadData = req.body;
      let updateData = await VOTER_MODEL.findOneAndUpdate(
        {_id: req.params.voterId},
        payloadData,
        {new: true}
      );
      console.log("updateData",req.params.voterId, updateData)
      if (updateData) {
        res.send({
        success: true,
        message: `Voter updated successfully`,
        data: saveData,
        });
    } else {
      res.send({
      success: true,
      message: `Fail to update voter! Please try again.`,
      });
    }
  } catch (error) {
      console.log(`error`, error)
      await setResponseObject(req, false, error.message, "");
      next();
  }
}

_voters.addVoters2 = async (req,res,next) =>{
    try {
        let payloadData = req.body;
    } catch (error) {
        console.log(`error`, error)
        await setResponseObject(req, false, error.message, "");
        next();
    }
}

_voters.getVotersByAssemblyCinstituency = async (req, res, next) => {
    try {
      let pageLimit = parseInt(req.query.pageLimit) || 20;
      let page = parseInt(req.query.page) || 1;
  
      var sorting = {};
      switch (req.query.sorting) {
        case "1":
          sorting = {
            sl_no: 1, // booth wise
          };
          break;
        case "2":
          sorting = {
            full_name: 1, // Alpha
          };
          break;
        case "3":
          sorting = {
            mobile: 1,
          };
          break;
        case "4":
          sorting = {
            address: 1,
          };
          break;
        case "5":
          sorting = {
            age: 1,
          };
          break;
        case "6":
          sorting = {
            full_name: 1,
          };
          break;
        case "7":
          sorting = {
            cast: 1,
          };
          break;
        case "8":
          sorting = {
            color: 1,
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
              full_name: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              full_name_hindi: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              father_name: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              father_name_hindi: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              full_name: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              age: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              mobile: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              cast: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
            {
              color: {
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
              distric: {
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
            {
              assembly_cinstituency_no: {
                $regex: req.query.search ? req.query.search : "",
                $options: "i",
              },
            },
          ],
        };
      }
  
      let result = await VOTER_MODEL.aggregate([
        {
          $match: {
            assembly_cinstituency_no: req.assembly_cinstituency,
          },
        },
        {
          $match: filterSearch,
        },
        {
          $match: sorting,
        },
        {
          $sort: {
            createdAt: -1
          },
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
          message: "Voter's found successfully",
          data: result[0].data,
          count: result[0].count[0].count,
        });
      } else {
        res.send({
          success: false,
          message: "Voter's not found",
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


_voters.getVoterDetails = async (req, res, next) => {
    try {
      const getVoterDetails = await VOTER_MODEL.findOne({_id: req.params.voterId});
      const myConstitution = await USER.findOne({_id: req.userId}).select('created_by');
      // const getVolanter = await QUESTION_MODEL.find({created_by: myConstitution.created_by});
      let getQuestion = await QUESTION_MODEL.aggregate([
        {
          $match: {
            $or:[
              {created_by: mongoose.Types.ObjectId(req.userId)},
              {created_by: mongoose.Types.ObjectId(myConstitution.created_by)}
            ]
          },
        },
        // {
        //   $match: {
        //     assembly_cinstituency_no: req.assembly_cinstituency,
        //   },
        // },
        {
          $lookup: {
            from: "answers",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$question_id", "$$id"] },
                },
              },
            ],
            as: "answer",
          },
        },
        {
          $unwind: {
            path: '$answer',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project:{
            _id: 1,
            question: 1,
            answer: {
              _id: 1,
              answer: 1
            },
          }
        }
      ]);
  
        res.send({
          success: true,
          message: "Voter detail's found successfully",
          data: getVoterDetails,
          questions: getQuestion,
        });

    } catch (error) {
      console.log("error", error);
      await setResponseObject(req, false, error.message, "");
      next();
    }
};

_voters.getAllVotersAdded = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 20;
    let page = parseInt(req.query.page) || 1;

    var sorting = {};
    switch (req.query.sorting) {
      case "1":
        sorting = {
          sl_no: 1, // booth wise
        };
        break;
      case "2":
        sorting = {
          full_name: 1, // Alpha
        };
        break;
      case "3":
        sorting = {
          mobile: 1,
        };
        break;
      case "4":
        sorting = {
          address: 1,
        };
        break;
      case "5":
        sorting = {
          age: 1,
        };
        break;
      case "6":
        sorting = {
          full_name: 1,
        };
        break;
      case "7":
        sorting = {
          cast: 1,
        };
        break;
      case "8":
        sorting = {
          color: 1,
        };
        break;
      case "8":
        sorting = {
          state_code: 1,
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
            full_name: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            full_name_hindi: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            father_name: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            father_name_hindi: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            epic_no: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            age: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            mobile: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            cast: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            color: {
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
            distric: {
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
          {
            assembly_cinstituency_no: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let result = await VOTER_MODEL.aggregate([
      {
        $match: filterSearch,
      },
      {
        $match: sorting,
      },
      {
        $sort: {
          createdAt: -1
        },
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
        message: "Voter's found successfully",
        data: result[0].data,
        count: result[0].count[0].count,
      });
    } else {
      res.send({
        success: true,
        message: "Voter's not found",
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

_voters.getFilterDropdownOptions = async(req,res,next) => {
  try {
    const state_code = await VOTER_MODEL.find({stateId: 0}).select('state_code');
    const distric = await VOTER_MODEL.find({stateId: 0}).select('distric');
    const assembly_cinstituency_no = await VOTER_MODEL.find({stateId: 0}).select('assembly_cinstituency_no');

    res.json({
      success: true,
      message: `Options found`,
      data:{
        state_code,distric,assembly_cinstituency_no
      }
    })
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message, "");
    next();
  }
}


_voters.uploadExcel = async (req, res, next) => {
  try {
    console.log("object")
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      if (err) {
        console.log(`err`, err)
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        let data = req.body;
        let findUser = await USER.findOne({ _id: req.userId });
        if (req.files) {
          console.log("req.files",req.files)
          if (req.files.votersfile) {
            console.log(`req.files.votersfile`, req.files.votersfile)
            // let img = req.files.votersfile[0].path;
            csv()
            .fromFile(req.files.votersfile[0].path)
            .then((response) => {
              // console.log(`response`, response)
              // for (var x = 0; x < response; x++) {
              //   empResponse = parseFloat(response[x].Name)
              //   response[x].Name = empResponse
              //   empResponse = parseFloat(response[x].Email)
              //   response[x].Email = empResponse
              //   empResponse = parseFloat(response[x].Designation)
              //   response[x].Designation = empResponse
              //   empResponse = parseFloat(response[x].Mobile)
              //   response[x].Mobile = empResponse
              // }
              response.forEach(async element => {
                element.full_name_hindi = await translate(element.full_name, {to: 'hi'});
                element.father_name_hindi = await translate(element.father_name, {to: 'hi'});

                const saveData = await VOTER_MODEL.create(element);
                console.log(`saveData`,saveData._id)
              });
              res.json({success: true, message: `Record saved`})

              // empSchema.insertMany(response, (err, data) => {
              //   if (err) {
              //     console.log(err)
              //   } else {
              //     res.redirect('/')
              //   }
              // })
            })
          }
        }

      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


module.exports = _voters;