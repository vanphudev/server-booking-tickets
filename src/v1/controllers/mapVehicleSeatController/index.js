"use strict";

const __RESPONSE = require("../../core");
const { getAllMapVehicleSeat, getMapVehicleSeatById, createMapVehicleSeat, updateMapVehicleSeat, deleteMapVehicleSeat} = require("../../services/mapVehicleSeatService");
const __MAP_VEHICLE_SEAT_CONTROLLER = {
    getAllMapVehicleSeat: async (req, res, next) => {
        try {
            const mapVehicleSeat = await getAllMapVehicleSeat(); // Gọi phương thức từ service
            new __RESPONSE.OK({
                message: "Retrieved all Payment Types",
                metadata: mapVehicleSeat,
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error retrieving Map Vehicle Seat:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    getMapVehicleSeatById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const mapVehicleSeat = await getMapVehicleSeatById(id); // Gọi phương thức từ service

            new __RESPONSE.OK({
                message: "Retrieved Map Vehicle Seat",
                metadata: mapVehicleSeat,
                request: req,
            }).send(res);
        } catch (error) {
            console.error("Error retrieving Map Vehicle Seat:", error);
            res.status(500).json({
                error: true,
                message: "Internal Server Error",
                details: error.message,
            });
        }
    },

    createMapVehicleSeat: async (req, res, next) => {
       try {
          const metadata = await createMapVehicleSeat(req);
          new __RESPONSE.CREATED({
             message: "Create new map vehicle seat",
             metadata: metadata,
             request: req,
          }).send(res);
       } catch (error) {
          next(error); 
       }
    },
    updateMapVehicleSeat: async (req, res, next) => {
        try {
            const seatId = req.params.id;
            const metadata = await updateMapVehicleSeat(seatId, req.body); 
            new __RESPONSE.SUCCESS({
                message: "Update map vehicle seat successfully",
                metadata: metadata,
                request: req,
            }).send(res);
        } catch (error) {
            next(error);
        }
    },

    deleteMapVehicleSeat: async (req, res, next) => {
        try {
           new __RESPONSE.OK({
              message: "Map Vehicle Seat deleted successfully",
              metadata: await deleteMapVehicleSeat(req),
              request: req,
           }).send(res);
        } catch (error) {
           next(error);
        }
     },
 };
module.exports = __MAP_VEHICLE_SEAT_CONTROLLER;
