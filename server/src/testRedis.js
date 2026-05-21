const redis = require("redis");

const client = redis.createClient();

async function testRedis() {
  await client.connect();

  console.log("Redis Connected");

  await client.set(
    "session:123",
    JSON.stringify({
      userId: 7,
    }),
  );

  const data = await client.get("session:123");

  console.log(data);

  await client.expire("session:123", 60);

  process.exit();
}

testRedis();
