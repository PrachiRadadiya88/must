const express = require("express");
// const { model } = require("../config/db1.config"); 
const User = require("../models/user.model");
const IndustryCreatePro = require("../models/Create_Profile_model_industry");
const UserOTPVerification = require("../models/UserOTPVerification")
const NotificationInsert = require("../models/NotificationInsert");

const NotificationIndustry = require("../models/NotificationIndustry");
const Applied = require("../models/Applied");
const JoinData = require("../models/Create_Join_Data");
const AddPost = require("../models/AddPost_Industry");
const EmployeeCreatePro = require("../models/Create_Profile_model_employee");


const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware")
require('dotenv').config();
// const bcrypt=require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");
// const bodyparser = require("body-parser");
// app.use(bodyparser.json())
// var admin = require("firebase-admin");
// var fcm = require("fcm");
// var serviceAccount = require("../config/push-notification-key.json");
// const certPath = admin.credential.cert(serviceAccount);
// var FCM = new fcm(certPath);

// router.route("/:username").get(middleware.checkToken,(req, resp) => {
//     User.findOne({ username: req.params.username }, (err, result) => {
//         if (err) return resp.status(500).json({ msg: err });
//         resp.json({
//             data: result,
//             username: req.params.username,
//         });
//     });
// });

var admin = require("firebase-admin");

var serviceAccount = require("../config/push-notification-key.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://push-notification-1c1f5.firebaseio.com"

})


const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};




router.route("/notification").post(async (req, resp) => {

    const registrationToken = req.body.registrationToken
    const message = {
        notification: {
            title: req.body.title,
            body: req.body.body
        },
    };
    const options = notification_options

    admin.messaging().sendToDevice(registrationToken, message, options)
        .then(response => {
            console.log("Notification sent", response)
            resp.status(200).send("Notification sent successfully")

        })
        .catch(error => {
            console.log(error);
        });


});




router.route('/storenotification').post(async (req, resp) => {

    console.log("inside the create profile--->>>>", req.body);
    // if(typeof req.body.body === "string") 
    // //convert skill to array
    // req.body.body = JSON.parse(req.body.body);
    try {
        if (req.body.email && req.body.body && req.body.title) {
            const notificationInsert = await new NotificationInsert(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }

});

router.route("/getnotification/:email").get(async (req, resp) => {
   console.log("start notification");
    let result = await NotificationInsert.find({ email: req.params.email });
    return resp.json({
        result: result,
    });

    console.log("end notification");

});



router.route("/getindustrypostcollection/:email").get(async (req, resp) => {
    console.log("start notification");
     let result = await AddPost.find({ email: req.params.email });
     return resp.json({
         result: result,
     });
 
     console.log("end notification");
 
 });


 router.route("/deletepost").post(async (req, resp) => {
    console.log("start delete");
    // console.log(req.params._id);
     let result = await AddPost.deleteOne({ _id: req.body._id });
     console.log("deleted");
     return resp.json({
         result: result,
     });
 
  
 
 });





//  router.route('/storenotificationindustry').post(async (req, resp) => {

//     console.log("inside the create profile--->>>>", req.body);
//     try {
//         if (req.body.contact && req.body.body && req.body.title) {
//             const notificationIndustry = await new NotificationIndustry(req.body).save();
//             return resp.status(200).json("ok");
//         }
//         return resp.status(404).json({ msg: "all field require" });
//     } catch (error) {
//         console.log(error, "error");
//     }

// });







//  const router = express.Router();



router.route("/sendotp").post(async (req, resp) => {
    const nodemailer = require('nodemailer');
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'harshilcbatch@gmail.com',
            pass: 'khcbecmhdnfbfzwt'
        }
    });

    const mailOptions = {
        from: 'harshilcbatch@gmail.com',
        to: req.body.email,
        subject: 'One Time Password',
        html: `<p>Enter </br><b>OTP:${otp}</b> </br>       in the app to verify your email address and complete the verfication</p><p>This code <b>Expires in 3 minute</b>.</p>`,

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
    if (req.body.email && otp) {
        await UserOTPVerification.deleteMany({ email: req.body.email });
        const userOTPVerification = await UserOTPVerification({
            email: req.body.email,
            otp: otp,
            expire: Date.now() + 180000,
        });
        const result =
            await userOTPVerification
                .save()
                .then((result) => {
                    console.log("otp saved successfully", result);
                    console.log("otp saved successfully");
                    resp.status(200).json("ok");
                    //sendOTPVerificationEmail(result,resp);
                })
                .catch((err) => {
                    resp.status(403).json({ msg: err.msg });
                });
    } else {
        return resp.status(404).json({ msg: "All field required" });
    }


});

router.route("/verifyotp").post(async (req, resp) => {
    console.log("inside the rigestation--->>>>", req.body);
    UserOTPVerification.findOne({ email: req.body.email }, async (err, result) => {
        console.log("inside the rigestation--->>>>", result);
        if (err) return resp.status(500).json({ msg: err });
        if (result === null) {
            return resp.status(403).json("Either email incorrect")
        }
        if (result.otp === req.body.otp) {
            //here we will implement the jwt token functionality
            console.log(
                new Date(result.expire).toLocaleString(),
                "--------",
                new Date().toLocaleString()
            )
            if (result.expire < Date.now()) {
                await UserOTPVerification.deleteMany({ email: req.body.email });
                //    throw new Error("Code has expired.Please request again."); 
                return resp.status(400).json({ "msg": "Code has expired.Please request again." })
            }
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
});
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

router.route("/resetpassword").post(async (req, resp) => {
    // if(req.body.email != null && req.body.role==="Industry")
    try {
        let result = await User.findOne({ email: req.body.email }).lean()
        if (result === null) {
            return resp.status(403).json("Either email incorrect")
        }
        console.log("result", result.password, req.body.password);
        if (result.password === req.body.password) {

            await User.updateOne(
                { email: req.body.email }, { $set: { password: req.body.password2 } });

                resp.status(200).json("password updated succesfully");
        }
        else {
            resp.status(403).json("password incorrect");
        }
    }
    catch (err) {
        console.log(err);
    }

})


router.route("/forgetpassword").post(async (req, resp) => {
    // if(req.body.email != null && req.body.role==="Industry")
    try {
        let result = await User.findOne({ email: req.body.email }).lean()
        if (result === null) {
            return resp.status(403).json("Either email incorrect")
        }
        else{  await User.updateOne(
                { email: req.body.email }, { $set: { password: req.body.password } });

                resp.status(200).json("password updated succesfully");
    
      
            resp.status(200).json({msg:"password updated successfully"});}
 

          

    }
    catch (err) {
        console.log(err);
    }

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
        const result =
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
router.route("/createpro").post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    try {
        if (req.body.name && req.body.contact && req.body.email && req.body.desc && req.body.address && req.body.timefrom && req.body.timeto) {
            const industrycreatepro = await new IndustryCreatePro(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }
    // } else if(req.body.name==null) {
    //     return resp.status(404).json({ msg: "name required" });
    // }
    // else if(req.body.timefrom || req.body.timeto==null) {
    //     return resp.status(404).json({ msg: "time required" });
    // }
    // else if(req.body.contact==null) {
    //     return resp.status(404).json({ msg: "contact required" });
    // }
    // else if(req.body.email==null) {
    //     return resp.status(404).json({ msg: "email required" });
    // }
    // else if(req.body.address==null) {
    //     return resp.status(404).json({ msg: "address required" });
    // }
    // else if(req.body.desc==null) {
    //     return resp.status(404).json({ msg: "desc required" });
    // }
    // resp.json("registered");
});






router.route("/empgetdata").get(async (req, resp) => {
    console.log("=========================================")
    let result = await EmployeeCreatePro.find()
    return resp.json({
        result: result,
    });
});
router.route("/profileupdategetind").get(async (req, resp) => {
    console.log("=========================================")
    let result = await IndustryCreatePro.find()
    return resp.json({
        result: result,
    });
});

router.route("/updateindprofile").post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    let result = await IndustryCreatePro.updateOne(//use here only update to update all data that have same name
        { email: req.body.email }, { $set: { name: req.body.name, contact: req.body.contact, desc: req.body.desc, address: req.body.address, timefrom: req.body.timefrom, timeto: req.body.timeto } }
    )
    return resp.json({
        result: result,
    });
});
router.route("/addpost").post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    try {
        // if(typeof req.body.req.body.reqworker === "string") 
        //convert skill to array
        // req.body.req.body.reqworker = JSON.parse(req.body.req.body.reqworker);

        console.log("inside the create profile--->>>>", req.body);

        if (req.body.name && req.body.contact && req.body.email && req.body.desc && req.body.address && req.body.timefrom && req.body.timeto && req.body.salary && req.body.reqworker && req.body.noworker && req.body.jobtype) {
            const addpost = await new AddPost(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }
    // } else if(req.body.name==null) {
    //     return resp.status(404).json({ msg: "name required" });
    // }
    // else if(req.body.timefrom || req.body.timeto==null) {
    //     return resp.status(404).json({ msg: "time required" });
    // }
    // else if(req.body.contact==null) {
    //     return resp.status(404).json({ msg: "contact required" });
    // }
    // else if(req.body.email==null) {
    //     return resp.status(404).json({ msg: "email required" });
    // }
    // else if(req.body.address==null) {
    //     return resp.status(404).json({ msg: "address required" });
    // }
    // else if(req.body.desc==null) {
    //     return resp.status(404).json({ msg: "desc required" });
    // }
    // resp.json("registered");
});


router.route("/applied").post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    try {
        // if(typeof req.body.reqworker === "string") 
        // // convert skill to array
        // req.body.reqworker = JSON.parse(req.body.reqworker);

        console.log("inside the create profile--->>>>", req.body);

        if (req.body.name && req.body.contact && req.body.email && req.body.desc && req.body.address && req.body.timefrom && req.body.timeto && req.body.salary && req.body.reqworker && req.body.noworker && req.body.jobtype && req.body.contactemp) {
            const applied = await new Applied(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }
    // } else if(req.body.name==null) {
    //     return resp.status(404).json({ msg: "name required" });
    // }
    // else if(req.body.timefrom || req.body.timeto==null) {
    //     return resp.status(404).json({ msg: "time required" });
    // }
    // else if(req.body.contact==null) {
    //     return resp.status(404).json({ msg: "contact required" });
    // }
    // else if(req.body.email==null) {
    //     return resp.status(404).json({ msg: "email required" });
    // }
    // else if(req.body.address==null) {
    //     return resp.status(404).json({ msg: "address required" });
    // }
    // else if(req.body.desc==null) {
    //     return resp.status(404).json({ msg: "desc required" });
    // }
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

router.route("/empgetdata").get(async (req, resp) => {
    console.log("=========================================")
    let result = await EmployeeCreatePro.find()
    return resp.json({
        result: result,
    });
});

router.route("/profilegetind/:mail").get(async (req, resp) => {
    
    // clogconsole.log("=========================================")
    let result = await IndustryCreatePro.findOne({ email: req.params.mail });
    return resp.json({
        result: result,
    });
    // let { username } = req.params;

    // console.log(username);
    // let user = await User.findOne({ username }).lean()

    // console.log(user)

    // return resp.status(500).json({ msg: user });
});


router.route("/getjoindata/:emailind").get(async (req, resp) => {
    
    // clogconsole.log("=========================================")
    let result = await JoinData.find({ emailind: req.params.emailind });
    return resp.json({
        result: result,
    });
    // let { username } = req.params;

    // console.log(username);
    // let user = await User.findOne({ username }).lean()

    // console.log(user)

    // return resp.status(500).json({ msg: user });
});



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

