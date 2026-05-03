const express = require("express");

const app = express();

app.get("/test", (req, res) => {
  res.send("Hello test!");
});

app.listen("3000", () => {
  console.log("Server is started successfully on port 3000...");
});

app.get("/user", (req, res) => {
  const queryParams = req.query;
  console.log(queryParams);
  const user = {
    name: "Sushant Mangore",
    age: 24,
    profession: "Software Engineer",
  };
  res.send(user);
});

app.post("/user", (req, res) => {
  const user = {
    name: "Sushant Mangore",
    age: 24,
    profession: "Software Engineer",
  };
  res.send(`User ${user.name} created successfully!`);
});

app.delete("/user", (req, res) => {
  const user = {
    name: "Sushant Mangore",
    age: 24,
    profession: "Software Engineer",
  };
  res.send(`User ${user.name} deleted successfully!`);
});

app.get("/", (req, res) => {
  res.send("Hello this is home page!");
});
