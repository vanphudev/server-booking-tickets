const {
   app: {port, host},
} = require("./src/v1/configs/configServer");
require("dotenv").config();
const app = require("./src/v1/app");

const __PORT = port || 8800;
const __HOST = host || "localhost";

app.listen(__PORT, __HOST, () => {
   console.log(`App listening on http://localhost:${__PORT}\n`);
});

process.on("SIGINT", () => {
   console.log("Server is shutting down.");
});
