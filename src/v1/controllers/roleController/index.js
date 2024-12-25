"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");


const { createRole, updateRole, deleteRole } = require("../../services/roleService");

const __ROLE_CONTROLLER = {
    createRole: async (req, res, next) => {
        try {
           new __RESPONSE.CREATED({
              message: "Create new Role",
              metadata: await createRole(req),
              request: req,
           }).send(res);
        } catch (error) {
           console.error("Error creating Role:", error); // Ghi log lỗi
           res.status(500).json({
              error: true,
              message: "Internal Server Error",
              details: error.message,
           });
        }
     },
   
   updateRole: async (req, res, next) => {
      try {
         new __RESPONSE.OK({
            message: "Role updated successfully",
            metadata: await updateRole(req),
            request: req,
         }).send(res);
      } catch (error) {
         console.error("Error updating Role:", error);
         res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: error.message,
         });
      }
   },

   deleteRole: async (req, res, next) => {
      try {
         new __RESPONSE.OK({
            message: "Role deleted successfully",
            metadata: await deleteRole(req),
            request: req,
         }).send(res);
      } catch (error) {
         next(error);
      }
   },
};

module.exports = __ROLE_CONTROLLER;