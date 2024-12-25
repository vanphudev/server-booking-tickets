"use strict";

const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redis = new Redis({
   port: process.env.REDIS_PORT || 16406,
   host: process.env.REDIS_HOST || "redis-16406.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com",
   username: process.env.REDIS_USERNAME || "default",
   password: process.env.REDIS_PASSWORD,
   db: 0,
   retryStrategy: function (times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
   },
});

redis.on("error", (err) => {
   console.error("Redis Client Error: ", err);
});

redis.on("connect", () => {
   console.log("Redis Client Connected Successfully");
});

module.exports = redis;
