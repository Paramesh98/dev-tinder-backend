const mongoose = require("mongoose");

const CLUSTER_URL = "mongodb+srv://param:param@cluster0.1yguy.mongodb.net";
const DB_NAME = "devTinder";

const connectToDB = async () => {
  await mongoose.connect(`${CLUSTER_URL}/${DB_NAME}`);
};

module.exports = connectToDB;
