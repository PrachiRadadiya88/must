const express = require("express");
const Emp = require("../models/signup_employee");
const EmployeeCreatePro = require("../models/Create_Profile_model_employee");
const IndustryCreatePro = require("../models/Create_Profile_model_industry");
const AddPost = require("../models/AddPost_Industry");
const NotificationIndustry = require("../models/NotificationIndustry");
const config = require("../config");
const Applied = require("../models/Applied");
const JoinData = require("../models/Create_Join_Data");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware");
const signup_employee = require("../models/signup_employee");
const { json } = require("body-parser");
const NotificationInsert = require("../models/NotificationInsert");
const router = express.Router();
router.route("/regist").post(async (req, resp) => {
    console.log("inside the rigestation--->>>>", req.body);
    if (req.body.mobile) {
        const emp = await Emp({
            mobile: req.body.mobile
        });
        await emp
            .save()
            .then(() => {
                console.log("user registerd");
                resp.status(200).json("ok");
            })

            .catch((err) => {
                resp.status(403).json({ msg: err.msg });
                });
    } else {
        return resp.status(404).json({ msg: "All field required" });
    }
});


// router.route("/profileget/:mobile").get(async (req, resp) => {


router.route('/').post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    if(typeof req.body.body === "string") 
    //convert skill to array
    req.body.body = JSON.parse(req.body.body);
    try {
        if (req.body.contact && req.body.body && req.body.title) {
            const notificationIndustry = await new NotificationIndustry(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }
});

router.route("/indgetnotification").get(async (req, resp) => {
    console.log("=========================================")
   let result = await NotificationIndustry.find()
   return resp.json({
   result:result,
     });
});
router.route("/getapplieddata/:contactemp").get(async (req, resp) => {
    
    // clogconsole.log("=========================================")
    let result = await Applied.find({ contactemp: req.params.contactemp });
    return resp.json({
        result: result,
    });
 });


router.route("/getaddddddd/:email").get(async (req, resp) => {
    
    // clogconsole.log("=========================================")
    let result = await AddPost.findOne({ email: req.params.email });
    return resp.json({
        result: result,
    });
    // let { username } = req.params;

    // console.log(username);
    // let user = await User.findOne({ username }).lean()

    // console.log(user)

    // return resp.status(500).json({ msg: user });
});


router.route("/indgetdata").get(async (req, resp) => {
    console.log("=========================================")
   let result = await AddPost.find()

   return resp.json({
   result:result,
     });


});
router.route("/profilegetemp/:contact").get(async (req, resp) => {
    // clogconsole.log("=========================================")
   let result = await  EmployeeCreatePro.findOne({ contact: req.params.contact });
    return resp.json({
        result: result,
    });
    // let { username } = req.params;

    // console.log(username);
    // let user = await User.findOne({ username }).lean()

    // console.log(user)

    // return resp.status(500).json({ msg: user });
});

router.route("/updateempprofile").post(async (req, resp) =>{
    if(typeof req.body.skills === "string") 
    //convert skill to array
    req.body.skills = JSON.parse(req.body.skills);

    let result = await EmployeeCreatePro.updateOne(//use here only update to update all data that have same name
       {contact:req.body.contact},{$set:{name:req.body.name,contact2:req.body.contact2,email:req.body.email,desc:req.body.desc,address:req.body.address,currentplace:req.body.currentplace,skills:req.body.skills}}
   )
   return resp.json({

       result: result,
    
    });
});
router.route("/createproemp").post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    if(typeof req.body.skills === "string") 
    //convert skill to array
    req.body.skills = JSON.parse(req.body.skills);
    console.log("inside the create profile--->>>>", req.body);
    try {
        if (req.body.name && req.body.contact && req.body.email && req.body.desc && req.body.address && req.body.currentplace && req.body.skills && req.body.contact2 && req.body.year && req.body.salary) {
            const employeecreatepro = await new EmployeeCreatePro(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }
});



router.route("/createjoindata").post(async (req, resp) => {
    console.log("inside the create profile--->>>>", req.body);
    if(typeof req.body.skills === "string") 
    //convert skill to array
    req.body.skills = JSON.parse(req.body.skills);
    console.log("inside the create profile--->>>>", req.body);
    try {
        if ( req.body.name && req.body.contact && req.body.email && req.body.desc && req.body.address && req.body.currentplace && req.body.skills && req.body.contact2 && req.body.year && req.body.salary) {
            const joindata = await new JoinData(req.body).save();
            return resp.status(200).json("ok");
        }
        return resp.status(404).json({ msg: "all field require" });
    } catch (error) {
        console.log(error, "error");
    }
   
});

router.route("/login").post((req, resp) => {
    // if(req.body.email != null && req.body.role==="Industry")

    Emp.findOne({ mobile: req.body.mobile }, (err, result) => {
        if (err) return resp.status(500).json({ msg: err });
        if (result === null) {
            return resp.status(403).json("Either mobile incorrect")
        }
        if (result.mobile === req.body.mobile) {
            //here we will implement the jwt token functionality
            let token = jwt.sign({ mobile: req.body.mobile }, config.key, {
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
router.route("/checkmobile/:mobile").get(async (req, resp) => {
    // clogconsole.log("=========================================")
    Emp.findOne({ mobile: req.params.mobile }, (err, result) => {
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
module.exports = router;
