const express = require("express");
const connectToDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());
const PORT = "8081";

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const user = new User(data);
    await user.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(400).json({
      message: "Error creating user" + err.message,
      code: err.code,
    });
  }
});

app.get("/users", async (req, res) => {
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

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user.length <= 0) {
      return res.status(404).json({
        message: "User not found",
        code: 404,
      });
    }
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

app.delete("/user/:id", async (req, res) => {
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

app.patch("/user/:id", async (req, res) => {
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

connectToDB()
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server is running on port 8081");
    });
  })
  .catch((err) => {
    console.log("Error: " + err);
  });
