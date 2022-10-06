const express = require("express");
const { model } = require("mongoose");
const User = require("../models/user.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware=require("../middleware")

const router = express.Router();

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
    User.findOne({ username: req.body.username }, (err, result) => {
        if (err) return resp.status(500).json({ msg: err });
        if (result === null) {
            return resp.status(403).json("Either user name incoorct")
        } 
        if (result.password === req.body.password) {
            //here we will implement the jwt token functionality
            let token = jwt.sign({ username: req.body.username }, config.key, {
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
    });
})


router.route("/register").post((req, resp) => {
    console.log("inside the rigestation");
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,

    });
    user
        .save()
        .then(() => {
            console.log("user registerd");
            resp.status(200).json("ok");
        })
        .catch((err) => {
            resp.status(403).json({ msg: err });
        });
    // resp.json("registered");
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

router.route("/:username").get(async(req, resp) => {

    let {username} = req.params;

    console.log(username);
    let user =await User.findOne({username}).lean()

    console.log(user)
    
    return resp.status(500).json({ msg: user });
});

module.exports = router;