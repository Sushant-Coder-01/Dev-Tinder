const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(userData);

  try {
    await user.save();

    res.send("User Added Successfully!");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
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
