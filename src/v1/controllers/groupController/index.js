"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");
const { getAllGroup, getGroupById, createGroup, updateGroup, deleteGroup } = require("../../services/groupService");

const __GROUP_CONTROLLER = {
    getAllGroup: async (req, res, next) => {
        try {
            const group = await getAllGroup(); // Gọi phương thức từ service
            new __RESPONSE.OK({
                message: "Retrieved all Group",
                metadata: group,
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error retrieving Group:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    getGroupById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const group = await getGroupById(id); // Gọi phương thức từ service

            new __RESPONSE.OK({
                message: "Retrieved Group",
                metadata: group,
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error retrieving Group:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    createGroup: async (req, res, next) => {
        try {
           new __RESPONSE.CREATED({
              message: "Create new Group",
              metadata: await createGroup(req),
              request: req,
           }).send(res);
        } catch (error) {
           console.error("Error creating Group:", error); // Ghi log lỗi
           res.status(500).json({
              error: true,
              message: "Internal Server Error",
              details: error.message,
           });
        }
     },
   
   updateGroup: async (req, res, next) => {
      try {
         new __RESPONSE.OK({
            message: "Group updated successfully",
            metadata: await updateGroup(req),
            request: req,
         }).send(res);
      } catch (error) {
         console.error("Error updating Group:", error);
         res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: error.message,
         });
      }
   },

   deleteGroup: async (req, res, next) => {
      try {
         new __RESPONSE.OK({
            message: "Group deleted successfully",
            metadata: await deleteGroup(req),
            request: req,
         }).send(res);
      } catch (error) {
         next(error);
      }
   },
};

module.exports = __GROUP_CONTROLLER;