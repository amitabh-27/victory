let mongoose = require("mongoose")
let schema = mongoose.Schema;

let voterSchema = new schema({

    sl_no : {
        type : String
    },

    state_code : {
        type : String
    },
    
    distric : {
        type : String
    },

    assembly_cinstituency : {
        type : String
    },

    assembly_cinstituency_no : {
        type : String
    },
    
    booth_name : {
        type : String
    },

    booth_no : {
        type : String
    },

    epic_no : {
        type : String
    },

    full_name : {
        type : String
    },

    full_name_hindi : {
        type : String
    },

    father_name : {
        type : String
    },

    father_name_hindi : {
        type : String
    },

    age : {
        type : String
    },

    dob : {
        type : String
    },

    gender : {
        type : String,
    },

    mobile : {
        type : String
    },

    cast : {
        type : String
    },

    address : {
        type : String
    },

    work : {
        type : String
    },
    
    color : {
        type : String,
        enum: ['r','w','g','']
    },

    //=========================
    stateId : {
        type : Number,
        enum : [0,1,2], // 0 => Active, 1 => Inactive,  2 => Delete
        default : 0
    },

    created_by : {
        type : mongoose.Types.ObjectId,
        ref : 'user'
    }

},{timestamps: true});


module.exports = mongoose.model('voter', voterSchema);