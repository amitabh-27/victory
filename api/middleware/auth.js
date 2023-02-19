const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const _tokenManager = {};

// check token
_tokenManager.authenticate = async (req, res, next) => {
  let token = getToken(req);
  console.log("authorization:Bearer", token);
  //verify if user authenticated.
  const secret = "*$#@!^*" || "Development";
  jwt.verify(token, secret, async (err, decoded) => {
    if (decoded) {
      req.userId = decoded._id;
      req.roleId = decoded.roleId;
      req.email = decoded.email;
      req.assembly_cinstituency = decoded.assembly_cinstituency;
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }
  });
};

const getToken = function (req) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

module.exports = _tokenManager;
