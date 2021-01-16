const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const User = require("../../models/users");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

//Endpoint      /auth/user/
//Type          GET
//Access        public
//Desc          to get user data
router.get("/user/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Endpoint      /auth/login/
//Type          POST
//Access        Public
//Desc          Login into the system
router.post(
  "/login/",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors);
      res.status(400).json({ errors: errors.array });
    }
    let { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        res.status(401).json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(
        payload,
        config.get("secretKey"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          return res.json({ accessToken: token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
