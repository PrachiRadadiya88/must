const { date } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const NotificationIndustry = Schema({
   
    name :{
        type: String,   
    },


    title:{
        type: String,
    },
  

    body:{
        type: Array,
    },
    contact:{
        type: String,
    }
    

});



module.exports = mongoose.model("NotificationIndustry",NotificationIndustry);