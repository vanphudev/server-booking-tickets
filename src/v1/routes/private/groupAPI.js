const express = require("express");
const rootRouter = express.Router();

const __GROUP_CONTROLLER = require("../../controllers/groupController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__GROUP_CONTROLLER.createGroup));
rootRouter.put("/update/:id", asyncHandler(__GROUP_CONTROLLER.updateGroup));
rootRouter.delete("/delete/:id", asyncHandler(__GROUP_CONTROLLER.deleteGroup));

rootRouter.get("/all", asyncHandler(__GROUP_CONTROLLER.getAllGroup)); 
rootRouter.get("/:id", asyncHandler(__GROUP_CONTROLLER.getGroupById));
module.exports = rootRouter;
