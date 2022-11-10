const express = require("express");
// const { model } = require("../config/db1.config"); 
const User = require("../models/user.model");
const UserOTPVerification=require("../models/UserOTPVerification")
const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware")
require('dotenv').config();
// const bcrypt=require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");
var transporter=nodemailer.createTransport({
    host:"smtp-mail.outlook.com",
   auth:{
        email:process.env.AUTH_EMAIL,
        password:process.env.AUTH_PASSWORD,
   },
});

// router.route("/:username").get(middleware.checkToken,(req, resp) => {
//     User.findOne({ username: req.params.username }, (err, result) => {
//         if (err) return resp.status(500).json({ msg: err });
//         resp.json({
//             data: result,
//             username: req.params.username,
//         });
//     });
// });

router.route("/login").post((req, resp) => {
    // if(req.body.email != null && req.body.role==="Industry")
    
    User.findOne({ email: req.body.email }, (err, result) => {
        if (err) return resp.status(500).json({ msg: err });
        if (result === null) {
            return resp.status(403).json("Either email incorrect")
        }
        if (result.password === req.body.password) {
            //here we will implement the jwt token functionality
            let token = jwt.sign({ email: req.body.email }, config.key, {
                expiresIn: "24h",
            });
            resp.json({
                token: token,
                "msg": "success",

            });
        }
        else {
            resp.status(403).json("password incorrect");
        }
    }

    );
})


router.route("/register").post(async (req, resp) => {
    console.log("inside the rigestation--->>>>", req.body);
    // const rl =  req.body.role
    // if(req.body.role === 'Industry')
    // {
    if (req.body.username && req.body.password && req.body.email) {
        const user = await User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email

            
        });
     const result=
        await user
            .save()
            .then((result) => {
                console.log("user registerd");
                resp.status(200).json("ok");
                //sendOTPVerificationEmail(result,resp);
            })
            .catch((err) => {
                resp.status(403).json({ msg: err.msg });
            });
    } else {
        return resp.status(404).json({ msg: "All field required" });
    }


    // resp.json("registered");
    

});
// const sendOTPVerificationEmail=async({_id,email},resp)=>{
//     try {
//         const otp=`${Math.floor(1000+Math.random()*9000)}`
        
//         const mailOptions={
//             from:process.env.AUTH_EMAIL,
//             to:email,
//             subject:"verify your email",
//             html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete the verfication</p><p>This code <b>Expires in 1 hour</b>.</p>`,
//         };

//         const saltRounds=10;
//         const hashedOTP=await bcrypt.hash(otp,saltRounds);
//         const newOTPVerification=await new UserOTPVerification({
//             email:email,
//             otp:hashedOTP,
//             createdAt:Date.now(),
//             expiresAt:Date.now()+3600000,
//         });
//         await newOTPVerification.save();
//         await transporter.sendMail(mailOptions);
//         resp.json({
//             status:"PENDING",
//             message:"Verification otp email sent",
//             data:{
//                 email,
//             }
//         })
//     } catch (error) {
//         resp.json({
//             status:"FAILED",
//             message:error.message,
//         });
//     }
// }
// router.post("/verifyOTP",async(req,resp)=>{
//     try {
//         let{email,otp}=req.body;
//         if(!email || !otp){
//             throw Error("Empty otp details are not allowed "); 
//         }else{
//             const UserOTPVerificationRecords=await UserOTPVerification.find({
//                 email,
//             });
//             if(UserOTPVerificationRecords.length <= 0){
//                 throw new Error(
//                     "Account record doesn't exist or has been verified already.Please signup or login."
//                 );
//             }else{
//                 const {expiresAt}=UserOTPVerificationRecords[0];
//                 const hashedOTP=UserOTPVerificationRecords[0].otp;

//                 if(expiresAt < Date.now()){
//                     await UserOTPVerification.deleteMany({email});
//                     throw new Error("Code has expired.Please request again."); 
//                 }else{
//                     const validOTP=await bcrypt.compare(otp,hashedOTP);

//                     if(!validOTP){
//                         throw new Error("Invalid code password.Check your inbox.");
//                     }else{
//                         await User.updateOne({email:email},{verified:true});
//                         await UserOTPVerification.deleteMany({email});
//                         resp.json({
//                             status:"VERIFIED",
//                             message:`User Email verified successfully`,
//                         });
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         resp.json({
//             status:"FAILED",
//             message:error.message,
//         }); 
//     }
// });


router.route("/update/:username").patch((req, resp) => {
    User.findOneAndUpdate(
        { username: req.params.username },
        { $set: { password: req.body.password } },
        (err, result) => {
            if (err) return resp.status(500).json({ msg: err });
            const msg = {
                msg: "password successfully updated",
                username: req.params.username,
            };
            return resp.json(msg);
        }
    );
});


router.route("/delete/:username").delete((req, resp) => {
    User.findOneAndDelete({ username: req.params.username }, (err, result) => {
        if (err) return resp.status(500).json({ msg: err });
        const msg = {
            msg: "user succeddful deleted",
            username: req.params.username,
        };
        return resp.json(msg)
    });
});

router.route("/:username").get(async (req, resp) => {

    let { username } = req.params;

    console.log(username);
    let user = await User.findOne({ username }).lean()

    console.log(user)

    return resp.status(500).json({ msg: user });
});

router.route("/checkmail/:email").get(async (req, resp) => {
    // clogconsole.log("=========================================")
    User.findOne({ email: req.params.email }, (err, result) => {
        if (err) return resp.status(500).json({ msg: err });
        if (result !== null) {
            return resp.json({
                status: true,

            });
        }
        else
            return resp.json({
                status: false,

            });

    });
    // let { username } = req.params;

    // console.log(username);
    // let user = await User.findOne({ username }).lean()

    // console.log(user)

    // return resp.status(500).json({ msg: user });
});


// const otpgenerator = require('otp-generator');
// const crypto = require('crypto');
// const key = "otp-secret-key";

// router.route("/createOtp").post(async (req, resp)=>{
//    await createOtp();
// })
// router.route("/verifyOTP").post(async (req, resp)=>{
//   await  verifyOTP();
// })
// async function createOtp(req,resp,params,callback){
//     const otp = otpgenerator.generate(4,{
//         alphabets : false,
//         uppercase : false,
//         specialChars: false

//     });
//     const ttl = 5*60*1000;
//     const expires = Date.now()+ttl;
//     let data = `${params.phone}.${otp}.${expires}`;
//     const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
//     const fullHash = `${hash}.${expires}`;
//     console.log(`Your OTP is ${otp}`);
// //SEND SMS; 
// return callback (null, fullHash);

// }

// async function verifyOTP(params,callback)

// {
//     let [hashValue,expires] = params.hash.split('.');

//     let now = Date.now();
//     if(now>parseInt(expires)) return callback("OtpExpires");
//     let newCalculateHash = crypto
//     .createHmac("sha256", key)
//     .update(data)
//     .digest("hex");

//     if(newCalculateHash === hashValue)
//     {
//         return callback(null,"success")
//     }
//     return callback("invalid otp");
// }
// const controller = require('../controller')



// router.post("/otpLogin",controller.otpLogin);
// router.post("/verifyOtp",controller.verifyOtp);



module.exports = router;

