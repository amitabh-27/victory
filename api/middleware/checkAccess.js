// check token
const setResponseObject = require("./commonFunction").setResponseObject;// for common functions used on some files
let USER = require("../app/user/model/userModel");
const userAgent = require("user-agents");

  const _authManager = {};


  _authManager.checkAuthenticationForApp = async (req, res, next) => {
    if(req.body.email == 'admin@victory.in'){

        res
        .status(constant.failureStatus)
        .send({
            success : false,
            message : responseMessage.UNAUTHORIZED
        })
    }else{
       next();
    }

};

_authManager.checkAuthenticationForWebsite = async (req, res, next) => {
    if(req.body.email !== 'admin@victory.in'){
        let data = req.body;
        res
        .status(constant.failureStatus)
        .send({
            success : false,
            message : "UNAUTHORIZED"
        })
    }else{
        next();
    }
}

_authManager.checkProfileVerified = async (req, res, next) => {

    let checkVerificationStatus = await USER.findOne({_id : req.userId});

    if(checkVerificationStatus.beautyProfessionalVerification == 0 ){

        res
        .status(constant.failureStatus)
        .send({
            success : false,
            message : responseMessage.PROFILE_VERIFICATION_PENDING
        })
    }else if(checkVerificationStatus.beautyProfessionalVerification == 2){
        res
        .status(constant.failureStatus)
        .send({
            success : false,
            message : responseMessage.PROFILE_VERIFICATION_REJECTED
        })
    }else{
        next();
    }

};

module.exports = _authManager;