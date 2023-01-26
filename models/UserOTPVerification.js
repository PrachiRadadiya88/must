const mongoose = require("mongoose");



const Schema = mongoose.Schema;

const UserOTPVerificationSchema = Schema({
    email:{
        type:String
    },
    otp:{
        type:String
    },
});

module.exports = mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);

// module.exports=  mongoose.model(UserOTPVerification,"UserOTPVerification")