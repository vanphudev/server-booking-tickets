"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");

const { createMapVehicleLayout, updateMapVehicleLayout, deleteMapVehicleLayout } = require("../../services/mapVehicleLayoutService");


const __MAP_VEHICLElAYOUT = {
    createMapVehicleLayout: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Create new Map Vehicle Layout",
         metadata: await createMapVehicleLayout(req),
         request: req,
      }).send(res);
   },
   updateMapVehicleLayout: async (req, res, next) => {
    try {
       const { id } = req.params;
       const { name } = req.body;
 
       const mapVehicleLayout = await db.MapVehicleLayout.findByPk(id);
       if (!mapVehicleLayout) {
          return res.status(404).json({ error: "Map Vehicle Layout not found" });
       }
 
       // Cập nhật thông tin
       mapVehicleLayout.layout_name = name;
       await mapVehicleLayout.save();
 
       new __RESPONSE.OK({
          message: "Map Vehicle Layout updated successfully",
          metadata: {
             id: mapVehicleLayout.map_vehicle_layout_id,
             name: mapVehicleLayout.layout_name,
          },
          request: req,
       }).send(res);
 
    } catch (error) {
       console.error("Error updating Map Vehicle Layout:", error);
       res.status(500).json({
          error: true,
          message: "Internal Server Error",
          details: error.message,
       });
    }
 },
 

 deleteMapVehicleLayout: async (req, res, next) => {
    new __RESPONSE.OK({
       message: "Map Vehicle Layout deleted successfully",
       metadata: await deleteMapVehicleLayout(req),
       request: req,
    }).send(res);
 },

};

module.exports = __MAP_VEHICLElAYOUT;
