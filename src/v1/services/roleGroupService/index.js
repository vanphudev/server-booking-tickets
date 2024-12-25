"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const validator = require("validator");

const getAllRoleGroup = async () => {
    const roleGroup = await db.RoleGroup.findAll();
    return roleGroup;
};

// Phương thức lấy RoleGroup theo RoleId và GroupId
const getRoleGroupById = async (roleId, groupId) => {
    const roleGroup = await db.RoleGroup.findOne({ where: { role_id: roleId, group_id: groupId } });
    if (!roleGroup) {
        throw new __RESPONSE.NotFoundError({
            message: "Role group not found",
            request: req,
        })
    }
    return roleGroup;
};

// Phương thức tạo mới RoleGroup
const createRoleGroup = async (req) => {
    const { roleId, groupId } = req.body;

    if (!roleId || !groupId) {
        throw new Error("roleId and groupId are required fields");
    }

    const roleGroup = await db.RoleGroup.create({
        role_id: roleId,
        group_id: groupId,
    });

    return {
        roleId: roleGroup.role_id,
        groupId: roleGroup.group_id,
    };
};

// Phương thức cập nhật RoleGroup
const updateRoleGroup = async (req) => {
    const { roleId, groupId } = req.body;
    console.log(req.body);
    const [roleGroup] = await db.RoleGroup.update({role_id: roleId}, { where: {group_id: groupId } });
    if (!roleGroup) {
        throw new __RESPONSE.NotFoundError({
            message: "Role group not found",
            request: req,
        })
    }
    return 
        "Update thành công !";
    
};

// Phương thức xóa RoleGroup
const deleteRoleGroup = async (req) => {
    const { roleId, groupId } = req.body;
    console.log(req.body);
    const [roleGroup] = await db.RoleGroup.delete({role_id: roleId}, { where: {group_id: groupId } });
    if (!roleGroup) {
        throw new __RESPONSE.NotFoundError({
            message: "Role group not found",
            request: req,
        })
    }

    await roleGroup.destroy();
    return { message: "Role group deleted successfully" };
};

module.exports = {
    getAllRoleGroup,
    getRoleGroupById,
    createRoleGroup,
    updateRoleGroup,
    deleteRoleGroup,
};