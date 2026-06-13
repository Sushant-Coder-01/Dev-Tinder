const dotenv = require("dotenv");

dotenv.config();

const env = {
  accessSecretKey: process.env.ACCESS_SECRET,
  refreshSecretKey: process.env.REFRESH_SECRET,
  sessionSecretKey: process.env.SESSION_SECRET,
  pasetoSecretKey: process.env.PASETO_SECRET_KEY,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV,
};

module.exports = { env };
