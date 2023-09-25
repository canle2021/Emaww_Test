const express = require("express");
const redis = require("redis");

const app = express();
const port = 3001;
const redisPort = 6379;

const client = redis.createClient(redisPort);

client.on("connect", () => {
  console.log("Connected to Redis");
});

app.use(express.json());

app.post("/storeData", (req, res) => {
  const { key, value } = req.body;

  client.set(key, value, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error storing data in Redis");
    } else {
      res.send("Data stored in Redis");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
