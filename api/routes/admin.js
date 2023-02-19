var express = require("express");
var router = express.Router();

require("express-group-routes");

const ADMIN_CONTROLLER = require("../app/authservices/controller/adminController");
const VOTER_CONTROLLER = require("../app/contentservices/controller/voter.controller");
const STATIC_CONTROLLER = require("../app/userstaticservices/controller/static.controller");


const AUTH = require("../middleware/auth");
const handleResponse = require("../middleware/handleResponse");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Election Propaganda Server" });
});

router.post("/login", ADMIN_CONTROLLER.login,handleResponse.RESPONSE)
router.post("/uploadFile", ADMIN_CONTROLLER.uploadFile,handleResponse.RESPONSE)

router.group("/manage",(auth) => {
    auth.post("/add-client",AUTH.authenticate, ADMIN_CONTROLLER.addClient,handleResponse.RESPONSE);
    auth.delete("/deleteUser/:userId",AUTH.authenticate, ADMIN_CONTROLLER.deleteUser,handleResponse.RESPONSE);
    auth.put("/update-client/:userId",AUTH.authenticate, ADMIN_CONTROLLER.updateClientInfo,handleResponse.RESPONSE);
    auth.get("/get-all-client",ADMIN_CONTROLLER.getAllClients,handleResponse.RESPONSE);
    auth.get("/getClientById", ADMIN_CONTROLLER.getClientById,handleResponse.RESPONSE);
    auth.get("/get-all-volunteer", ADMIN_CONTROLLER.getAllVolunteer,handleResponse.RESPONSE);
});

router.group("/auth",(auth) => {
    auth.get("/myProfile",AUTH.authenticate, ADMIN_CONTROLLER.myProfile,handleResponse.RESPONSE);
    auth.put("/edit-profile/:userId",AUTH.authenticate, ADMIN_CONTROLLER.editProfile,handleResponse.RESPONSE);
    auth.post("/add-client",AUTH.authenticate, ADMIN_CONTROLLER.addClient,handleResponse.RESPONSE);
    auth.post("/updateProfileByAdmin",AUTH.authenticate, ADMIN_CONTROLLER.updateProfileByAdmin,handleResponse.RESPONSE);
    // auth.delete("/deleteUser",AUTH.authenticate, ADMIN_CONTROLLER.deleteUser,handleResponse.RESPONSE);
    // auth.put("/getAllClients",ADMIN_CONTROLLER.getAllClients,handleResponse.RESPONSE);
    auth.get("/getClientById", ADMIN_CONTROLLER.getClientById,handleResponse.RESPONSE);
    auth.put("/active-inactive/:id", ADMIN_CONTROLLER.activeInactive,handleResponse.RESPONSE);
});

router.group("/voter",(voter) => {
    voter.post("/add-manual",AUTH.authenticate, VOTER_CONTROLLER.addVotersManual,handleResponse.RESPONSE);
    voter.post("/add-client",AUTH.authenticate, ADMIN_CONTROLLER.addClient,handleResponse.RESPONSE);
    voter.post("/updateProfileByAdmin",AUTH.authenticate, ADMIN_CONTROLLER.updateProfileByAdmin,handleResponse.RESPONSE);
    voter.delete("/deleteUser",AUTH.authenticate, ADMIN_CONTROLLER.deleteUser,handleResponse.RESPONSE);
    voter.get("/getFilterDropdownOptions", VOTER_CONTROLLER.getFilterDropdownOptions,handleResponse.RESPONSE);
});

router.group("/static",(voter) => {
    voter.get("/get-all-cast",AUTH.authenticate, STATIC_CONTROLLER.getAllCast,handleResponse.RESPONSE);
    voter.put("/update-cast/:id",AUTH.authenticate, STATIC_CONTROLLER.updateCast,handleResponse.RESPONSE);
    voter.delete("/delete-cast/:id",AUTH.authenticate, STATIC_CONTROLLER.deleteCast,handleResponse.RESPONSE);
});

router.group("/voter",(auth) => {
    auth.get("/get-all-added",AUTH.authenticate, VOTER_CONTROLLER.getAllVotersAdded,handleResponse.RESPONSE);
    auth.get("/get-details/:voterId",AUTH.authenticate, VOTER_CONTROLLER.getVoterDetails,handleResponse.RESPONSE);
    auth.post("/uploadExcel", VOTER_CONTROLLER.uploadExcel,handleResponse.RESPONSE);
});


module.exports = router;
