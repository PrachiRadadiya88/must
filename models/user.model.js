const mongoose = require("../config/db1.config");

const Schema = mongoose.Schema;
const Joi = require("joi");
const { schema } = require("./signup_employee");


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
    
    // role:{
    //     type: String,
    //     require: true,
    // },
    verified :{
        type: Boolean,
        default: false,
    }
});



module.exports = mongoose.model("User", User);


// function validate (user){
//     const  Schema = Joi.object({
//         username : Joi.string().required(),
//         email : Joi.string().required(), 
    
//     })
//     return schema.validate(user);
// }

// module.exports = {User,validate};