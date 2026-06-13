const express = require("express");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation.util");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env.config");
const crypto = require("crypto");

authRouter.post("/signup", async (req, res) => {
  try {
    const userData = req.body;

    validateSignUpData(userData);

    const { firstName, lastName, emailId, password } = userData;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginData(req.body);

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials.");
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials.");
    }

    const { accessToken, refreshToken } = user.generateTokens();

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    user.refreshToken = hashedRefreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.send("User Login Successfully!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/refresh", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    // 1. Verify JWT first
    const decoded = jwt.verify(refreshToken, env.refreshSecretKey);

    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // 3. Hash incoming token
    const incomingHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // 4. Compare stored hash
    if (incomingHash !== user.refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // 5. Issue new access token
    const accessToken = jwt.sign({ userId }, env.accessSecretKey, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.send("New access token created");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = { authRouter };
