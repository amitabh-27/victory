var express = require('express');
var router = express.Router();
require("express-group-routes");

const USER_CONTROLLER = require("../app/authservices/controller/userController");
const VOTER_CONTROLLER = require("../app/contentservices/controller/voter.controller");
const QnA_CONTROLLER = require("../app/qnaservices/controller/qna.controller");
const CAST_CONTROLLER = require("../app/userstaticservices/controller/static.controller");

const AUTH = require("../middleware/AUTH");
const handleResponse = require("../middleware/handleResponse");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.group("/auth",(auth) => {
  auth.post("/login", USER_CONTROLLER.login,handleResponse.RESPONSE);
  auth.put("/edit-profile",AUTH.authenticate, USER_CONTROLLER.editProfile,handleResponse.RESPONSE);
});

router.group("/manage",(auth) => {
  auth.post("/add-surveyor",AUTH.authenticate, USER_CONTROLLER.add_surveyor,handleResponse.RESPONSE);
  auth.post("/update-surveyor",AUTH.authenticate, USER_CONTROLLER.update_surveyor,handleResponse.RESPONSE);
  auth.post("/delete-surveyor",AUTH.authenticate, USER_CONTROLLER.delete_surveyor,handleResponse.RESPONSE);
  auth.get("/get-my-surveyor",AUTH.authenticate, USER_CONTROLLER.get_my_surveyor,handleResponse.RESPONSE);
});

router.group("/voter",(auth) => {
  auth.get("/get-voter-by-cinstituency",AUTH.authenticate, VOTER_CONTROLLER.getVotersByAssemblyCinstituency,handleResponse.RESPONSE);
  auth.get("/get-details/:voterId",AUTH.authenticate, VOTER_CONTROLLER.getVoterDetails,handleResponse.RESPONSE);
  auth.post("/update/:voterId",AUTH.authenticate, VOTER_CONTROLLER.updateVoter,handleResponse.RESPONSE);
});

router.group("/qna",(auth) => {
  auth.post("/add-question",AUTH.authenticate, QnA_CONTROLLER.addQuestion,handleResponse.RESPONSE);
  auth.put("/update-question/:id",AUTH.authenticate, QnA_CONTROLLER.updateQue,handleResponse.RESPONSE);
  auth.get("/get-my-question",AUTH.authenticate, QnA_CONTROLLER.getMyQuestion,handleResponse.RESPONSE);
  auth.get("/get-question-list",AUTH.authenticate, QnA_CONTROLLER.getQuestionList,handleResponse.RESPONSE);
  auth.delete("/delete-question/:id",AUTH.authenticate, QnA_CONTROLLER.deleteQue,handleResponse.RESPONSE);
  // answer
  auth.post("/add-answer",AUTH.authenticate, QnA_CONTROLLER.addAnswer,handleResponse.RESPONSE);
  auth.put("/update-answer",AUTH.authenticate, QnA_CONTROLLER.updateAnswer,handleResponse.RESPONSE);
  auth.delete("/delete-answer",AUTH.authenticate, QnA_CONTROLLER.deleteAnswer,handleResponse.RESPONSE);
});

router.group("/static",(auth) => {
  auth.post("/add-cast",AUTH.authenticate, CAST_CONTROLLER.addCast,handleResponse.RESPONSE);
  auth.put("/update-cast/:id",AUTH.authenticate, CAST_CONTROLLER.updateCast,handleResponse.RESPONSE);
  auth.get("/get-my-cast",AUTH.authenticate, CAST_CONTROLLER.getMyCast,handleResponse.RESPONSE);
  auth.get("/get-cast-dropdown",AUTH.authenticate, CAST_CONTROLLER.getCast,handleResponse.RESPONSE);
  auth.delete("/delete-cast/:id",AUTH.authenticate, CAST_CONTROLLER.deleteCast,handleResponse.RESPONSE);
});

module.exports = router;
