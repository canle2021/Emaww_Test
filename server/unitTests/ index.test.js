const request = require("supertest");
const express = require("express");
const server = require("../index");

const app = express();
app.use(express.json());

describe("POST /storeData", () => {
  it("should store data in Redis and return a success message", async () => {
    const response = await request(app)
      .post("/storeData")
      .send({ key: "testKey", value: '{"test": "data"}' });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Data stored in Redis");
  });

  it("should return an error message when Redis storage fails", async () => {
    // Mock Redis set method to simulate an error
    const mockRedisClient = {
      set: jest.fn((key, value, callback) => {
        callback(new Error("Redis storage error"));
      }),
    };

    // Override the default Redis client with the mock
    server.setRedisClient(mockRedisClient);

    const response = await request(app)
      .post("/storeData")
      .send({ key: "testKey", value: '{"test": "data"}' });

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error storing data in Redis");
  });
});
