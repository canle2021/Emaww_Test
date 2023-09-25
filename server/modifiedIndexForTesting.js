// server.js
const express = require("express");
const redis = require("redis");

const app = express();
const port = 3001;
const redisPort = 6379;

class Server {
  constructor() {
    this.client = redis.createClient(redisPort);
    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });
  }

  setRedisClient(client) {
    this.client = client;
  }

  // ... Rest of your server code ...

  listen() {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const serverInstance = new Server();

app.use(express.json());

app.post("/storeData", (req, res) => {
  const { key, value } = req.body;

  serverInstance.client.set(key, value, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error storing data in Redis");
    } else {
      res.send("Data stored in Redis");
    }
  });
});

module.exports = serverInstance;
