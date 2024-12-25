"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");
const { getAllRoleGroup, getRoleGroupById, createRoleGroup, updateRoleGroup, deleteRoleGroup } = require("../../services/roleGroupService");

const __ROLE_GROUP_CONTROLLER = {
    getAllRoleGroup: async (req, res, next) => {
        try {
            const roleGroup = await getAllRoleGroup();
            new __RESPONSE.OK({
                message: "Retrieved all Role Groups",
                metadata: roleGroup,
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error retrieving Role group:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    getRoleGroupById: async (req, res, next) => {
        try {
            const { roleId, groupId } = req.params;
            const roleGroup = await getRoleGroupById(roleId, groupId);

            new __RESPONSE.OK({
                message: "Retrieved Role group",
                metadata: roleGroup,
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error retrieving Role group:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    createRoleGroup: async (req, res, next) => {
        try {
            new __RESPONSE.CREATED({
                message: "Created new Role group",
                metadata: await createRoleGroup(req),
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error creating Role group:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    updateRoleGroup: async (req, res, next) => {
        try {
            new __RESPONSE.OK({
                message: "Role group updated successfully",
                metadata: await updateRoleGroup(req),
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error updating Role group:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    deleteRoleGroup: async (req, res, next) => {
        try {
            new __RESPONSE.OK({
                message: "Role group deleted successfully",
                metadata: await updateRoleGroup(req),
                request: req,
            }).send(res);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = __ROLE_GROUP_CONTROLLER;