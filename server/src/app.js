const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
require("dotenv").config();

app.use(express.json());

app.post("/signup", async (req, res) => {
  let body = "";

  // recive chunks
  req.on("data", (chunks) => {
    body += chunks;
  });

  req.on("end", () => {
    if (body) {
      req.body = JSON.parse(body);
    }
    console.log(req.body);
    res.send(1);
  });

  // const userData = {
  //   firstName: "Sushant",
  //   lastName: "Mangore",
  //   age: 25,
  // };
  // const user = new User(userData);

  // try {
  //   await user.save();

  //   res.send("User Added Successfully!");
  // } catch (error) {
  //   res.status(400).send("Error saving the user: " + error.message);
  // }
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
