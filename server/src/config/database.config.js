const mongoose = require("mongoose");
const { env } = require("./env.config.js");

const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
};

module.exports = connectDB;
