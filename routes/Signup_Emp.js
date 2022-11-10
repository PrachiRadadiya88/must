const express = require("express");
const { model } = require("../config/db2.config");
const Emp = require("../models/signup_employee");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware");
const signup_employee = require("../models/signup_employee");

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
