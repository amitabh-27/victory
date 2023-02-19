let { CAST_MODEL } = require("../model/static.model");
const USER = require('../../authservices/model/userModel')
const setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;

let _cast = {};

_cast.addCast = async (req, res, next) => {
  try {
    let payloadData = req.body;
    payloadData.created_by = req.userId;
    // payloadData.title = (payloadData.title).toLowerCase();

    let isExist = await CAST_MODEL.findOne({ title: payloadData.title, created_by: req.userId, stateId: 0 });
    if (isExist) {
      res.status(400).send({
        success: false,
        message: `Cast ${payloadData.title} already exist `,
      });
    } else {
      let saveQue = await new CAST_MODEL(payloadData).save();
      if (saveQue) {
        res.status(200).send({
          success: true,
          message: `Cast added successfully`,
          data: saveQue,
        });
      } else {
        res.status(400).send({
          success: false,
          message: `SAVE_FAILED`,
        });
      }
    } 
  } catch (error) {
    console.log("error",error)
    await setResponseObject(req, false, error.message);
    next();
  }
};

_cast.getMyCast = async (req, res, next) => {
  try {
    let findData = await CAST_MODEL.find({
      created_by: req.userId,
      stateId: 0,
    }).sort({ createdAt: -1 });

    if (!findData) {
      res.status(NOT_FOUND).send({
        success: false,
        message: `Cast not found`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Cast found successfully`,
        data: findData,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_cast.getCast = async (req, res, next) => {
    try {
    const findClient = await USER.findOne({_id: req.userId}).select('_id created_by');
      let findData = await CAST_MODEL.find({
        created_by: findClient.created_by,
        stateId: 0,
      }).sort({ title: 1 });
  
      if (!findData) {
        res.status(NOT_FOUND).send({
          success: false,
          message: `Cast not found`,
        });
      } else {
        res.status(200).send({
          success: true,
          message: `Cast found successfully`,
          data: findData,
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

_cast.updateCast = async (req, res, next) => {
  try {
    let payloadData = req.body;
    let deleteQue = await CAST_MODEL.findOneAndUpdate(
      { _id: req.params.id },
      payloadData,
      { new: true }
    );

    if (deleteQue) {
      res.status(200).send({
        success: true,
        message: "cast updated successfully",
        data: deleteQue
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Error occured while update cast",
      });
    }
  } catch (error) {
    console.log(`error`, error)
    await setResponseObject(req, false, error.message);
    next();
  }
};

_cast.deleteCast = async (req, res, next) => {
  try {
    let deleteQue = await CAST_MODEL.findOneAndUpdate(
      { _id: req.params.id },
      { stateId: 2 },
      { new: true }
    );

    if (deleteQue) {
      res.status(200).send({
        success: true,
        message: "Cast deleted successfully",
        data: deleteQue
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Error occured while deleting cast",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_cast.getAllCast = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let page = parseInt(req.query.page) || 1;

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
      default:
        sorting = {
          $or:[
            {stateId: 0},
            {stateId: 1},
          ]
        };
    }

    let filterSearch = {};
    if (req.query.search && req.query.search !== "undefined") {
      filterSearch = {
        $or: [
          {
            title: {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
          {
            "created_by.full_name": {
              $regex: req.query.search ? req.query.search : "",
              $options: "i",
            },
          },
        ],
      };
    }

    let result = await CAST_MODEL.aggregate([
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
        $sort: {
          stateId: -1
        },
      },
      {
        $project:{
          _id: 1,
          stateId: 1,
          title: 1,
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
        message: `Cast successfully found`,
        data: result[0].data,
        count: result[0].count[0].count,
      });
    } else {
      res.send({
        success: true,
        message: `Cast not found`,
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

module.exports = _cast;
