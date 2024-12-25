const express = require("express");
const rootRouter = express.Router();

const __ROLE_CONTROLLER = require("../../controllers/roleController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__ROLE_CONTROLLER.createRole));
rootRouter.put("/update/:id", asyncHandler(__ROLE_CONTROLLER.updateRole));
rootRouter.delete("/delete/:id", asyncHandler(__ROLE_CONTROLLER.deleteRole));

module.exports = rootRouter;
