const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const User = Schema({
    name:{
        type: String,
        require: true,
      
    },

    contact:{
        type: String,
        require: true,
      
    },

    address :{
        type: String,
        require: true,
        unique: true,
    }
});



module.exports = mongoose.model("User",User);