const { date } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const EmployeeCreatePro = Schema({
    name:{
        type: String,
        require: true,
       
      
    },
    contact :{
        type: Number,
        require: true,
        unique: true,
    },
    contact2 :{
        type: Number,
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
    address:{
        type: String,
        require: true,
      
    },

    currentplace:{
        type: String,
        require: true,
    },
    skills:{
        type: Array,
        require: true,
    },
    year:{
        type: String,
        require: true,
    },
    salary:{
        type: String,
        require: true,
    }



});



module.exports = mongoose.model("EmployeeCreatePro",EmployeeCreatePro);