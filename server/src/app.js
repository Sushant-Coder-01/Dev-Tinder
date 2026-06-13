const express = require("express");
const connectDB = require("./config/database.config");
const app = express();
const cookieParser = require("cookie-parser");
const { connectRedis, redisClient } = require("./config/redis.config");
const { authRouter } = require("./routes/auth.route");
const { profileRouter } = require("./routes/profile.route");

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

connectDB()
  .then(async () => {
    await connectRedis();

    console.log("Database connected successfully...");
    app.listen("3000", () => {
      console.log("Server is started successfully on port 3000...");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
