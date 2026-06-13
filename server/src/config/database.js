const mongoose = require("mongoose");
const { env } = require("../config/env.js");

const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
};

module.exports = connectDB;
