const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Emp = Schema({
 

    mobile:{
        type: String,
        require: true,
        unique:true
    }

    // role:{
    //     type: String,
    //     require: true,
    // }

   
});



module.exports = mongoose.model("Emp",Emp);