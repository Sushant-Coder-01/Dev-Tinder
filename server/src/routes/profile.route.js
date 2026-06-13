const express = require("express");
const { userAuth } = require("../middlewares/auth.middleware");
const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = { profileRouter };
