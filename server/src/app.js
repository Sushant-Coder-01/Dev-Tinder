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
const { RedisStore } = require("connect-redis");
const { MongoStore } = require("connect-mongo");

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),

    name: "sessionID",

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 5,
    },
  }),
);

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

    console.log("\n========== BEFORE LOGIN ==========");
    console.log("req.sessionID:", req.sessionID);
    console.log("req.session:", req.session);

    // REGENERATE SESSION
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).send("Session regenerate failed");
      }

      console.log("\n========== AFTER REGENERATE ==========");
      console.log("NEW sessionID:", req.sessionID);

      req.session.user = {
        userId: user._id,
      };

      console.log("\n========== AFTER SETTING USER ==========");
      console.log("req.session:", req.session);

      res.on("finish", () => {
        console.log("\nFINAL RESPONSE HEADERS:");
        console.log(res.getHeaders());
      });

      res.send("User Login Successfully!");
    });
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

app.post("/refresh", (req, res) => {
  res.send("new access token created");
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
