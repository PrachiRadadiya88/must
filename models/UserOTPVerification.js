const mongoose = require("mongoose");



const Schema = mongoose.Schema;

const UserOTPVerificationSchema = Schema({
    email:{
        type:String
    },
    otp:{
        type:String
    },
    expire:{
        type:Date
    }
});

module.exports = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);

// module.exports=  mongoose.model(UserOTPVerification,"UserOTPVerification")