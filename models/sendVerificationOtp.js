const mongoose = require("../config/db1.config");

const Schema = mongoose.Schema;


const User = Schema({
    username: {
        type: String,
        require: true,

    },

    password: {
        type: String,
        require: true,

    },

    email: {
        type: String,
        require: true,
        unique: true,
    },
    
    role:{
        type: String,
        require: true,
    },
    verified :{
        type: boolean,
        default:false,
    }
});



module.exports = mongoose.model("User", User);