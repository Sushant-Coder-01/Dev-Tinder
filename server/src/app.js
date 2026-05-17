const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();
const app = express();

const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validate the data
    const userData = req.body;

    validateSignUpData(userData);

    const { firstName, lastName, emailId, password } = userData;

    // encrypt the password
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials.");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // set a token.
    res.cookie("token", token);

    res.send("User Login Successfually!");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid token!");
    }

    //verify the token
    const decodedMessage = jwt.verify(token, "Sush@DevTinder#123");

    const { _id } = decodedMessage;

    const user = await User.find({ _id });

    if (!user) {
      throw new Error("User does not exist!");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Get user from the email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });

    if (user.length === 0) {
      res.status(404).send("User not found!");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error while get the user: ", error);
  }
});

// Feed API, get all the users from the database.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(404).send("No user exists!");
    }

    res.send(users);
  } catch (error) {
    res.status(400).send("Error while get all the users: ", error);
  }
});

// Delete a user from the database.
app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete({ _id: userId });
    // await User.findByIdAndDelete(userId);

    res.send("User deleted Successfully.");
  } catch (error) {
    res.status(400).send("Error while deleting the user: ", error);
  }
});

// Update data of the user.
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  console.log("userId: ", userId);
  const data = req.body;
  try {
    const allowedUpdates = ["firstName", "lastName"];
    const updates = Object.keys(req.body);
    const isValid = updates.every((key) => allowedUpdates.includes(key));

    if (!isValid) {
      return res.status(400).send("Invalid updates!");
    }

    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated Successfully.");
  } catch (error) {
    res.status(400).send("Error while updating the user: ", error);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen("3000", () => {
      console.log("Server is started successfully on port 3000...");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
