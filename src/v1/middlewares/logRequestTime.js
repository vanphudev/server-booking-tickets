"use strict";

const logRequestTime = (req, res, next) => {
   req.requestTime = new Date();
   next();
};

module.exports = logRequestTime;
