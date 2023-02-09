const express = require("express");

const Emp = require("../models/signup_employee");
const EmployeeCreatePro = require("../models/Create_Profile_model_employee");
const IndustryCreatePro = require("../models/Create_Profile_model_industry");
const AddPost = require("../models/AddPost_Industry");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware");
const signup_employee = require("../models/signup_employee");
const { json } = require("body-parser");

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

    // resp.json("registered");
});

router.route("/indgetdata").get(async (req, resp) => {
    console.log("=========================================")
   let result = await AddPost.find()

   return resp.json({
    result: result,
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

    let result = await EmployeeCreatePro.updateOne(//use here only update to update all data that have same name
       {contact:req.body.contact},{$set:{name:req.body.name,contact:req.body.contact,contact2:req.body.contact2,email:req.body.email,desc:req.body.desc,address:req.body.address,currentplace:req.body.currentplace,skills:req.body.skills}}
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
        if (req.body.name && req.body.contact && req.body.email && req.body.desc && req.body.address && req.body.currentplace && req.body.skills && req.body.contact2) {
            const employeecreatepro = await new EmployeeCreatePro(req.body).save();
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
