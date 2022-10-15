const express = require("express");
const { model } = require("../config/db1.config");
const User = require("../models/user.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { application } = require("express");
const middleware = require("../middleware")

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
    if (req.body.username && req.body.password && req.body.email  ) {
        const user = await User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
            
        });
        await user
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

module.exports = router;