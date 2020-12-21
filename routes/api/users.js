const express = require("express");
const router = express.Router();
const {
    check,
    validationResult
} = require("express-validator");
const User = require("../../models/users");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//Endpoint      /user/test/
//Type          GET
//Access        public
//Use           test api
router.get("/test/", (req, res) => {
    console.log(req.body);
    res.send("User api...");
});

//Endpoint      /user/register/
//Type          POST
//Access        public
//Use           api for registering new user
router.post(
    "/register/",
    [
        check("username", "Username required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password should be of minimum length 8").isLength({
            min: 8,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        try {
            let {
                username,
                email,
                password
            } = req.body;
            let user = await User.findOne({
                email: email
            });
            if (user) {
                //Error message is returned as array to maintain consistency throught the code which helps in parsing the error
                //in frontend
                return res
                    .status(400)
                    .json({
                        errors: [{
                            msg: "User already exist"
                        }]
                    });
            }
            const avatar = gravatar.url(email, {
                s: 200, //size
                r: "pg", //rating(parental guidance)
                d: "retro", //default(404, retro, mm, etc)
            });
            user = User({
                username,
                email,
                password,
                avatar
            });

            //to generate a salt which will be used to encrypt password
            const salt = await bcrypt.genSalt(10);

            //encrypting password
            user.password = await bcrypt.hash(user.password, salt);

            //saving user
            await user.save();

            //generating webtoken
            const payload = {
                user: {
                    id: user.id
                }
            }
            token = jwt.sign(payload, config.get('secretKey'), {
                expiresIn: 360000
            }, (err, token) => {
                if (err) {
                    throw err;
                }
                return res.status(200).json({
                    accessToken: token
                });
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
    }
);

//todo - update password, delete user

module.exports = router;