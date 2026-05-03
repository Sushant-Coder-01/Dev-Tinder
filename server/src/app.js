const express = require("express");

const app = express();

app.use("/user", [
  (req, res, next) => {
    // Route handler 1
    console.log("This is the user route handler 1");
    next();
  },
  (req, res, next) => {
    // Route handler 2
    console.log("This is the user route handler 2");
    // res.send("This is route handler 2");
    next();
  },
  (req, res, next) => {
    // Route handler 2
    console.log("This is the user route handler 3");
    // res.send("This is route handler 3");
    next();
  },
  (req, res, next) => {
    // Route handler 2
    console.log("This is the user route handler 4");
    // res.send("This is route handler 4");
    next();
  },
]);

app.listen("3000", () => {
  console.log("Server is started successfully on port 3000...");
});
