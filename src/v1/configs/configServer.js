"use strict";
require("dotenv").config();

const development = {
   app: {
      port: process.env.SERVER_PORT || 5555,
      host: process.env.SERVER_HOST || "localhost",
   },
};

const production = {
   app: {
      port: process.env.SERVER_PORT || 5555,
      host: process.env.SERVER_HOST || "localhost",
   },
};

const config = {development, production};
const env = process.env.NODE_ENV || "development";

console.log(
   `\nNODE_ENV RUNNING: ${env}` +
      " ::: " +
      `PORT RUNNING: ${config[env].app.port}` +
      " ::: " +
      `SERVER RUNNING: http://${config[env].app.host}:${config[env].app.port}\n`
);

module.exports = config[env];
