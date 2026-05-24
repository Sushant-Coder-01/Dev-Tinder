const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { accessToken } = cookies;
    const decodedPayload = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    const userId = decodedPayload.userId;
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
