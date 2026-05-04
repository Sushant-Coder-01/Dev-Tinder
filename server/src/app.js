const express = require("express");

const app = express();

app.use("/", (err, req, res, next) => {
  console.log("Error Middleware");
  res.status(500).send("Something went wrong");
});

app.get("/user", (req, res) => {
  // try {
  throw new Error("User Auth Error");
  // } catch (error) {
  //   res.status(401).send("Unauthorized");
  // }
});

app.use("/", (err, req, res, next) => {
  console.log("Error Middleware");
  res.status(500).send("Something went wrong");
});

app.listen("3000", () => {
  console.log("Server is started successfully on port 3000...");
});
