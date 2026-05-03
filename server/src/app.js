const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello this is home page!");
});

app.use("/test", (req, res) => {
  res.send("Hello test!");
});

app.listen("3000", () => {
  console.log("Server is started successfully on port 3000...");
});
