let {QUESTION_MODEL, ANSWER_MODEL } = require("../model/qna.model");
const setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;

let _address = {};

_address.addQuestion = async (req, res, next) => {
  try {
    let payloadData = req.body;
    payloadData.created_by = req.userId;

    let isExist = await QUESTION_MODEL.findOne({ question: payloadData.question, created_by: req.userId, stateId: 0 });
    if (isExist) {
      res.status(400).send({
        success: false,
        message: `Question already exist with ${payloadData.question}`,
      });
    } else {
      let saveQue = await QUESTION_MODEL(payloadData).save();
      if (saveQue) {
        res.status(200).send({
          success: true,
          message: `Question added successfully`,
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
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.getMyQuestion = async (req, res, next) => {
  try {
    let findData = await QUESTION_MODEL.find({
      created_by: req.userId,
      stateId: 0,
    }).sort({ createdAt: -1 });

    if (!findData) {
      res.status(NOT_FOUND).send({
        success: false,
        message: `Question not found`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Question found successfully`,
        data: findData,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.getQuestionList = async (req, res, next) => {
  try {
    const findClient = await USER.findOne({_id: req.userId}).select('_id created_by');
    let findData = await QUESTION_MODEL.find({
      created_by: findClient.created_by,
      stateId: 0,
    }).sort({ createdAt: -1 });

    if (!findData) {
      res.status(400).send({
        success: false,
        message: `Question not found`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Question found successfully`,
        data: findData,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.updateQue = async (req, res, next) => {
  try {
    let payloadData = req.body;
    let deleteQue = await QUESTION_MODEL.findOneAndUpdate(
      { _id: req.params.id },
      payloadData,
      { new: true }
    );

    if (deleteQue) {
      res.status(200).send({
        success: true,
        message: "Question updated successfully",
        data: deleteQue
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Error occured while update question",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.deleteQue = async (req, res, next) => {
  try {
    let address = await QUESTION_MODEL.findOne({ _id: req.params.id });
    let deleteQue = await QUESTION_MODEL.findOneAndUpdate(
      { _id: req.params.id },
      { stateId: 2 },
      { new: true }
    );

    if (deleteQue) {
      res.status(200).send({
        success: true,
        message: "Question deleted successfully",
        data: deleteQue
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Error occured while deleting question",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

// =============== ANSWER - API - FUNCTIONS =================== // 


_address.addAnswer = async (req, res, next) => {
  try {
    let payloadData = req.body;
    payloadData.created_by = req.userId;

    let isExist = await ANSWER_MODEL.findOne({ 
      question_id: payloadData.question_id, 
      answer_by: payloadData.answer_by, 
      stateId: 0 
    });
    if (isExist) {
      res.status(400).send({
        success: false,
        message: `Question already exist with ${payloadData.question}`,
      });
    } else {
      let saveQue = await ANSWER_MODEL(payloadData).save();
      if (saveQue) {
        res.status(200).send({
          success: true,
          message: `Answer added successfully`,
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
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.getMyAnswer = async (req, res, next) => {
  try {
    let findData = await ANSWER_MODEL.find({
      created_by: req.userId,
      stateId: 0,
    }).sort({ createdAt: -1 });

    if (!findData) {
      res.status(NOT_FOUND).send({
        success: false,
        message: `Question not found`,
      });
    } else {
      res.status(200).send({
        success: true,
        message: `Question found successfully`,
        data: findData,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.updateAnswer = async (req, res, next) => {
  try {
    let payloadData = req.body;
    let deleteQue = await ANSWER_MODEL.findOneAndUpdate(
      { _id: req.params.id },
      payloadData,
      { new: true }
    );

    if (setDefault) {
      res.status(200).send({
        success: true,
        message: "Question answer successfully",
        data: deleteQue
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Error occured while answer question",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

_address.deleteAnswer = async (req, res, next) => {
  try {
    let deleteQue = await ANSWER_MODEL.findOneAndUpdate(
      { _id: req.params.id },
      { stateId: 2 },
      { new: true }
    );

    if (setDefault) {
      res.status(200).send({
        success: true,
        message: "Question answer successfully",
        data: deleteQue
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Error occured while deleting answer",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

module.exports = _address;
