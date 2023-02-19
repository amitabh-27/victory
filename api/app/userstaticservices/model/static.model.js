let mongoose = require("mongoose")
let schema = mongoose.Schema;

let castSchema = new schema({
    title : {
        type : String
    },

    stateId : {
        type : Number,
        enum : [0,1,2], // 0 => Active, 1 => Inactive,  2 => Delete
        default : 0
    },
  
    created_by : {
        type : mongoose.Types.ObjectId,
        ref : 'user-model'
    }

},{timestamps: true});

module.exports.CAST_MODEL = mongoose.model('cast',castSchema);