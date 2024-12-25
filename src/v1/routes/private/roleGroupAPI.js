const express = require("express");
const rootRouter = express.Router();

const __ROLE_GROUP_CONTROLLER = require("../../controllers/roleGroupController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__ROLE_GROUP_CONTROLLER.createRoleGroup));
rootRouter.put("/update", asyncHandler(__ROLE_GROUP_CONTROLLER.updateRoleGroup));
rootRouter.delete("/delete", asyncHandler(__ROLE_GROUP_CONTROLLER.deleteRoleGroup));

rootRouter.get("/all", asyncHandler(__ROLE_GROUP_CONTROLLER.getAllRoleGroup)); 
//rootRouter.get("/:id", asyncHandler(__ROLE_GROUP_CONTROLLER.getRoleGroupById));
rootRouter.get("/:role_id/:group_id", asyncHandler(__ROLE_GROUP_CONTROLLER.getRoleGroupById)); // Dùng 2 param
module.exports = rootRouter;
