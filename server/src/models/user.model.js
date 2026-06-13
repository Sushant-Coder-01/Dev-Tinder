const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { env } = require("../config/env.config.js");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid eamil address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true },
);

userSchema.methods.generateTokens = function () {
  const user = this;

  const payload = {
    userId: user._id,
  };

  const accessToken = jwt.sign(payload, env.accessSecretKey, {
    expiresIn: "15m",
    issuer: "devtinder-app",
  });

  const refreshToken = jwt.sign(payload, env.refreshSecretKey, {
    expiresIn: "1d",
    issuer: "devtinder-app",
  });

  return { accessToken, refreshToken };
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;

  const hashedPassword = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword,
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
