const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Emp = Schema({
    name:{
        type: String,
        require: true,
      
    },

    mobile:{
        type: String,
        require: true,
        unique:true
    },

    role:{
        type: String,
        require: true,
    }

   
});



module.exports = mongoose.model("Emp",Emp);