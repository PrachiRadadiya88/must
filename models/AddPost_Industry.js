const { date } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const AddPost = Schema({
    name:{
        type: String,
        require: true, 
    },
    address:{
        type: String,
        require: true,
    },
    contact:{
        type: Number,
        require: true,
    },
    reqworker:{
        type: String,
        require: true,
    },
    noworker:{
        type: Number,
        require: true,
    },
    desc:{
        type: String,
        require: true,
    },
    jobtype:{
        type: String,   
        require: true,
    },
    salary:{
        type: Number,
        require: true,
    },
    timefrom:{
        type: String,
        require: true,
    },
    timeto:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },

});



module.exports = mongoose.model("AddPost",AddPost);