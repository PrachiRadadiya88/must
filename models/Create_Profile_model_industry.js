const { date } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const IndustryCreatePro = Schema({
    name:{
        type: String,
        require: true,
        unique: true,
      
    },
    contact :{
        type: Number,
        require: true,
        unique: true,
    },

    email:{
        type: String,
        require: true,
        unique: true,
      
    },

    desc:{
        type: String,
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
    address:{
        type: String,
        require: true,
        unique: true,
    }


});



module.exports = mongoose.model("IndustryCreatePro",IndustryCreatePro);