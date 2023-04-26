const { date, string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Applied = Schema({
    name:{
        type: String,
       
    },
    address:{
        type: String,
      
    },
    contact:{
        type: Number,
      
    },
    reqworker:{
        type: String,
      
    },
    noworker:{
        type: Number,
    },
    desc:{
        type: String,
      
    },
    jobtype:{
        type: String,   
      
    },
    salary:{
        type: Number,
     
    },
    timefrom:{
        type: String,
      
    },
    timeto:{
        type: String,
      
    },
    email:{
        type: String,
     
    },
    contactemp:{
        type: String,
    }

});



module.exports = mongoose.model("Applied",Applied);



