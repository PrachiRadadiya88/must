const express = require('express');
const router = express.router();
const UserOTPVerification=require("../models/UserOTPVerification")
const express = require("express");
// const { model } = require("../config/db1.config"); 
const User = require("../models/user.model");
// const UserOTPVerification=require("../models/UserOTPVerification")
const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware")
require('dotenv').config();
const bcrypt=require("bcrypt");


let transporter=nodemailer.createTransport({
    host:"smtp-mail.outlook.com",
   auth:{
        email:process.env.AUTH_EMAIL,
        password:process.env.AUTH_PASSWORD,
   },
});


const sendOTPVerificationEmail=async({_id,email},resp)=>{
    try {
        const otp=`${Math.floor(1000+Math.random()*9000)}`
        
        const mailOptions={
            from:process.env.AUTH_EMAIL,
            to:email,
            subject:"verify your email",
            html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete the verfication</p><p>This code <b>Expires in 1 hour</b>.</p>`,
        };

        const saltRounds=10;
        const hashedOTP=await bcrypt.hash(otp,saltRounds);
        const newOTPVerification=await new UserOTPVerification({
            email:email,
            otp:hashedOTP,
            createdAt:Date.now(),
            expiresAt:Date.now()+3600000,
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        resp.json({
            status:"PENDING",
            message:"Verification otp email sent",
            date:{
                email,
            }
        })
    } catch (error) {
        resp.json({
            status:"FAILED",
            message:error.message,
        });
    }
};



router.post("/verifyOTP",async(req,resp)=>{
    try {
        let{email,otp}=req.body;
        if(!email || !otp){
            throw Error("Empty otp details are not allowed "); 
        }else{
            
            const UserOTPVerificationRecords=await UserOTPVerification.find({
                email,
            });
            if(UserOTPVerificationRecords.length <= 0){
                throw new Error(
                    "Account record doesn't exist or has been verified already.Please signup or login."
                );
            }else{
                const {expiresAt}=UserOTPVerificationRecords[0];
                const hashedOTP=UserOTPVerificationRecords[0].otp;

                if(expiresAt < Date.now()){
                    await UserOTPVerification.deleteMany({email});
                    throw new Error("Code has expired.Please request again."); 
                }else{
                    const validOTP=await bcrypt.compare(otp,hashedOTP);

                    if(!validOTP){
                        throw new Error("Invalid code password.Check your inbox.");
                    }else{
                        await User.updateOne({email:email},{verified:true});
                        await UserOTPVerification.deleteMany({email});
                        resp.json({
                            status:"VERIFIED",
                            message:`User Email verified successfully`,
                        });
                    }
                }
            }
        }
    } catch (error) {
        resp.json({
            status:"FAILED",
            message:error.message,
        }); 
    }
});