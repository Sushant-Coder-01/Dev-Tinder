const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new Error("Unauthorized!");
    }

    const userId = req.session.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};

module.exports = { userAuth };
