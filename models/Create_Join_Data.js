const { date } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const JoinData = Schema({
   name:{
        type: String,
      
   },
    contact :{
        type: String,
        
        // unique: true,
    },
    contact2 :{
        type: String,
        // unique: true,
    },

    email:{
        type: String,
        
    },
    

    desc:{
        type: String,
        
    },
    emailind:
    {
        type: String,
    },
    address:{
        type: String,
    
    },

    currentplace:{
        type: String,
     
    },
    skills:{
        type: Array,
      require: true,
    },
    year:{
        type: String,
     
    },
    salary:{
        type: String,
      
    },
    contactemp:{
        type: String,
        
    }


});



module.exports = mongoose.model("JoinData",JoinData);