const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

const connectRedis = async () => {
  await redisClient.connect();

  console.log("Redis connected successfully...");
};

module.exports = {
  redisClient,
  connectRedis,
};
