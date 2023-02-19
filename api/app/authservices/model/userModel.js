let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;


let user = new SCHEMA(
  {
    full_name: {
      type: String,
    },

    email: {
      type: String,
    },

    phone_number: {
      type: String,
    },

    password: {
      type: String,
    },

    profileImg: {
      type: String,
      default: "",
    },

    state_code: {
      type: String,
    },

    district: {
      type: String,
    },

    assembly_cinstituency: {
      type: String,
    },

    gender: {
      type: String,
    },

    token: {
      type: String,
    },

    roleId: {
      type: Number,
      enum: [0, 1, 2, 3], // 0 => Super-Admin, 1 => Admin, 2 => client, 3 => surveyor,
      default: 2,
    },

    stateId: {
      type: String,
      enum: ["Active", "In-Active", "Banned", "Deleted"], 
      default: "Active",
    },

    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "user-model"
    },
  },
  { timestamps: true }
);

user.index({ location: "2dsphere" });
module.exports = mongoose.model("user-model", user);
