const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const app = express();

const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { connectRedis, redisClient } = require("./config/redis");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.post("/refresh", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    // 1. Verify JWT first
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

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
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, {
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

connectDB()
  .then(async () => {
    await connectRedis();

    console.log("Database connected successfully...");
    app.listen("3000", () => {
      console.log("Server is started successfully on port 3000...");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
