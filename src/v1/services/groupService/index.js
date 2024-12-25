"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const validator = require("validator");

// Phương thức lấy tất cả 
const getAllGroup = async () => {
    const group = await db.Group.findAll();
    return group;
};

// Phương thức lấy theo ID
const getGroupById = async (id) => {
    const group = await db.Group.findByPk(id);
    if (!group) {
        throw new Error("Group not found");
    }
    return group;
};

const createGroup = async (req) => {
    const {name,description,locked} = req.body;

    const group = await db.Group.create({
        group_name: name,
        group_description: description,
        is_locked:locked,
    });
    
    return {
       id: group.group_id,
       name: group.group_name,
       description: group.group_description,
       locked:group.is_locked,
    };
 };
 
 const updateGroup = async (req) => {
    const { id } = req.params; 
    const { name} = req.body;
    const {description} =req.body;
    const {locked} =req.body;

    const group = await db.Group.findByPk(id);
    if (!group) {
        throw new Error("Group not found");
    }

    // Cập nhật thông tin
    group.group_name = name;
    group.group_description=description;
    group.is_locked =locked;
   
    await group.save();

    return {
        id: group.group_id,
        name: group.group_name,
        description: group.group_description,
        locked: group.is_locked,
        
    };
};

  
 const deleteGroup = async (req) => {
     const {id} = req.params;
 
     const group = await db.Group.findByPk(id);
     if (!group) {
        throw new Error("Group not found");
     }
 
     await group.destroy();
     return { message: "Group deleted successfully" };
 };
 
 module.exports = {
    getAllGroup,
    getGroupById,
     createGroup,
     updateGroup,
     deleteGroup,
 };