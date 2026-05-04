const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

// Handle Auth middleware for all requests

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.send("User Data sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Admin Data sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("User Deleted");
});

app.listen("3000", () => {
  console.log("Server is started successfully on port 3000...");
});
