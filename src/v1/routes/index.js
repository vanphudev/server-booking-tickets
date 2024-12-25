const express = require("express");
const rootRouter = express.Router();

rootRouter.use("/private", require("./private"));
rootRouter.use("/public", require("./public"));

module.exports = rootRouter;
