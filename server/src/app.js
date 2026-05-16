const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = User(req.body);

  try {
    await user.save();

    res.send("User Added Successfully!");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
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

    await User.findByIdAndUpdate(userId, data);
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
