"use strict";
const express = require("express");
const helmet = require("helmet");
const geoip = require("geoip-lite");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const device = require("express-device");
const useragent = require("express-useragent");
const expressIp = require("express-ip");
const compression = require("compression");
const path = require("path");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const __RESPONSE = require("./core");
const {ConnectDatabase: initDb, CloseDatabase: closedDb} = require("./db");
const rootRouter = require("./routes");
const logRequestTime = require("../v1/middlewares/logRequestTime");
const app = express();
const connectDB = require("./configs/mongodb");
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(expressIp().getIpInfoMiddleware);
app.use(device.capture());
app.use(useragent.express());
app.use(useragent.express());
app.use(bodyParser.json({limit: "200mb"}));
app.use(bodyParser.urlencoded({limit: "200mb", extended: true}));

app.use(
   helmet.contentSecurityPolicy({
      directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"],
         imgSrc: ["'self'", "https://res.cloudinary.com"],
      },
   })
);

initDb();
connectDB();

app.use(
   cors({
      origin: "*",
      credentials: true,
   })
);

app.use(logRequestTime);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res, next) => {
   try {
      const info = {
         device: req.device.type,
         browser: req.useragent.browser,
         os: req.useragent.os,
         platform: req.useragent.platform,
         version: req.useragent.version,
         ip: req.ipInfo.ip,
         userAgent: req.useragent.source,
         location: {
            range: req.ipInfo.range || null,
            country: req.ipInfo.country || null,
            region: req.ipInfo.region || null,
            eu: req.ipInfo.eu || null,
            timezone: req.ipInfo.timezone || null,
            city: req.ipInfo.city || null,
            ll: req.ipInfo.ll || null,
            metro: req.ipInfo.metro || null,
            area: req.ipInfo.area || null,
         },
      };
      res.render("info-project", {info});
   } catch (error) {
      next(error);
   }
});

app.get("/info-project", (req, res) => {
   try {
      res.render("info-project");
   } catch (error) {
      next(error);
   }
});

app.use("/api/v1", rootRouter);

app.use((req, res, next) => {
   const error = new __RESPONSE.NotFoundError({
      message: "Route not found - Method Not Allowed!",
      suggestion: "Please check your request",
      request: req,
   });
   next(error);
});

app.use((error, req, res, next) => {
   console.log(error);
   const statusCode = error.status || 500;
   return res.status(statusCode).json({
      status: statusCode || 500,
      error: error.error || "Internal Server Error !",
      message: error.message || "Internal Server Error !",
      reason: error.reason || "Please check your request and try again !",
      timestamp: error.timestamp || new Date(),
      details: error.details || null,
   });
});

module.exports = app;
