var express = require("express");
var router = express.Router();

require("express-group-routes");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Victory App Server" });
});


module.exports = router;
