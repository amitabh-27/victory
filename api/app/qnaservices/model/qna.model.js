let mongoose = require("mongoose")
let schema = mongoose.Schema;

let questionSchema = new schema({
    question : {
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

let answerSchema = new schema({
    question_id : {
        type : mongoose.Types.ObjectId,
        ref : 'question'
    },

    answer_by : {
        type : mongoose.Types.ObjectId,
        ref : 'voter'
    },

    answer:{
        type: String
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


module.exports.QUESTION_MODEL = mongoose.model('question',questionSchema);
module.exports.ANSWER_MODEL = mongoose.model('answer', answerSchema);