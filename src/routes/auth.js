const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { vlaidateSignUpData } = require("../utils/validation");
const { userAuth } = require("../middlewares/userAuth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    vlaidateSignUpData(req);

    const { password, ...data } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ ...data, password: passwordHash });
    await user.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(400).json({
      message: "Error creating user" + err.message,
      code: err.code,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(404).json({
        message: "User password is not valid",
      });
    }

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    return res.status(200).json({ message: "User login successfully" });
  } catch (err) {
    return res.status(400).json({
      message: "Error logging in user" + err.message,
      code: err.code,
    });
  }
});

router.post("/logout", userAuth, async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return res.status(400).json({
      message: "Error logging out user" + err.message,
      code: err.code,
    });
  }
});

module.exports = router;
