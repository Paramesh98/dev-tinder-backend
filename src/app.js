const express = require("express");

const app = express();

app.use((req, res) => {
  res.status(200).send("Hello, world!");
});

app.listen("8081", () => {
  console.log("Server is running on port 8081");
});
