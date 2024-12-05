const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");
const { validateMyEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    return res.status(200).json({
      data: req.user,
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error fetching user " + err.message,
      code: err.code,
    });
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateMyEditProfileData(req);
    const loggedInUser = req.user;
    const udpated = await loggedInUser.updateOne(req.body);
    return res.status(200).json({
      message: `User ${udpated.firstName} ${udpated.lastName} updated successfully`,
      data: loggedInUser,
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error updating user " + err.message,
      code: err.code,
    });
  }
});

router.patch("/profile/forgetpassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;
    const isPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password", code: 401 });
    }
    const newHasPassword = await bcrypt.hash(newPassword, 10);
    await loggedInUser.updateOne({ password: newHasPassword });
    return res.status(200).json({
      message: `User ${loggedInUser.firstName} ${loggedInUser.lastName} updated successfully`,
      data: loggedInUser,
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error updating user " + err.message,
      code: err.code,
    });
  }
});

router.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      data: users,
      code: 200,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error fetching users" + err.message,
      code: err.code,
    });
  }
});

router.get("/user/:id", userAuth, async (req, res) => {
  try {
    const cookies = req.cookies;

    const user = await User.findOne({ _id: req.params.id });

    if (user.length <= 0) {
      return res.status(404).json({
        message: "User not found",
        code: 404,
      });
    }

    const userData = jwt.verify(cookies.token, "some secret key");
    console.log("cookies", userData);

    return res.status(200).json({
      data: user,
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error fetching user " + err.message,
      code: err.code,
    });
  }
});

router.delete("/user/:id", userAuth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        code: 404,
      });
    }
    return res.status(200).json({
      message: "User deleted successfully",
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error deleting user " + err.message,
      code: err.code,
    });
  }
});

router.patch("/user/:id", userAuth, async (req, res) => {
  const ALLOWED_KEYS = ["age", "about", "gender", "skills"];
  if (Object.keys(ALLOWED_KEYS).every((key) => ALLOWED_KEYS.includes(key))) {
    return res.status(400).json({
      message: `Cant update the field ${key}`,
      code: 400,
    });
  }
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        code: 404,
      });
    }
    return res.status(200).json({
      message: "User updated successfully",
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error updating user " + err.message,
      code: err.code,
    });
  }
});

module.exports = router;
