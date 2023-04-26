const { date } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const NotificationInsert = Schema({
   
    reqworker :{
        type: String,   
    },

    email:{
        type: String,
       
      
    },
    title:{
        type: String,
    },
  

    body:{
        type: String,
    },
    contact:{
        type: String,
    }
    

});



module.exports = mongoose.model("NotificationInsert",NotificationInsert);