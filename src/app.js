const express = require("express");
const connectToDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());
const PORT = "8081";

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const user = new User(data);
    user.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Error creating user" + err.message,
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
