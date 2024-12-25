"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const validator = require("validator");

const createRole = async (req) => {
   const {name, description, url, locked} = req.body;

   if (!name || !url || typeof locked !== "number") {
      throw new Error("Invalid input data");
   }

   const role = await db.Role.create({
      role_name: name,
      role_description: description,
      role_value_url: url,
      is_locked: locked,
   });

   return {
      id: role.role_id,
      name: role.role_name,
      description: role.role_description,
      url: role.role_value_url,
      locked: role.is_locked,
   };
};

const updateRole = async (req) => {
   const {id} = req.params;
   const {name, description, url, locked} = req.body;

   const role = await db.Role.findByPk(id);
   if (!role) {
      throw new Error("Role not found");
   }

   // Cập nhật thông tin
   role.role_name = name;
   role.role_description = description;
   role.role_value_url = url;
   role.is_locked = locked;
   await role.save();

   return {
      id: role.role_id,
      name: role.role_name,
      description: role.role_description,
      url: role.role_value_url,
      locked: role.is_locked,
   };
};

const deleteRole = async (req) => {
   const {id} = req.params;

   const role = await db.Role.findByPk(id);
   if (!role) {
      throw new Error("Role not found");
   }

   await role.destroy();
   return {message: "Role deleted successfully"};
};

module.exports = {
   createRole,
   updateRole,
   deleteRole,
};
