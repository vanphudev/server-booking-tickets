"use strict";
const { floor } = require("lodash");
const __RESPONSE = require("../../core");
const db = require("../../models");
const validator = require("validator");

const getAllMapVehicleSeat = async () => {
   const mapVehicleSeat = await db.MapVehicleSeat.findAll();
   return mapVehicleSeat;
};

// Phương thức lấy theo ID
const getMapVehicleSeatById = async (id) => {
   const mapVehicleSeat = await db.MapVehicleSeat.findByPk(id);
   if (!mapVehicleSeat) {
       throw new Error("Map Vehicle Seat not found");
   }
   return mapVehicleSeat;
};

const createMapVehicleSeat = async (req) => {
   const { code, col, row, floor, lock_chair, mapvehiclelayoutid } = req.body;

   // Kiểm tra xem có các trường cần thiết không
   if (!code || !col || !row || !floor || mapvehiclelayoutid === undefined) {
      throw new Error("Missing required fields");
   }

   // Thực hiện tạo mới ghế xe
   const mapVehicleSeat = await db.MapVehicleSeat.create({
      map_vehicle_seat_code: code,
      map_vehicle_seat_row_no: row,
      map_vehicle_seat_column_no: col,
      map_vehicle_seat_floor_no: floor,
      map_vehicle_seat_lock_chair: lock_chair,
      map_vehicle_layout_id: mapvehiclelayoutid,
   });

   return {
      id: mapVehicleSeat.map_vehicle_seat_id,
      code: mapVehicleSeat.map_vehicle_seat_code,
      row: mapVehicleSeat.map_vehicle_seat_row_no,
      col: mapVehicleSeat.map_vehicle_seat_column_no,
      floor: mapVehicleSeat.map_vehicle_seat_floor_no,
      lock_chair: mapVehicleSeat.map_vehicle_seat_lock_chair,
      mapvehiclelayoutid: mapVehicleSeat.map_vehicle_layout_id,
   };
};
// const updateMapVehicleSeat = async (seatId, data) => {
//    try {
//       console.log("Starting updateMapVehicleSeat...");
//       const seat = await db.MapVehicleSeat.findByPk(seatId);

//       if (!seat) {
//          console.log("Seat not found.");
//          throw new Error("Seat not found");
//       }

//       const { code, row, col, floor, lock_chair, mapvehiclelayoutid } = data;

//       console.log("Updating seat properties...");
//       seat.map_vehicle_seat_code = code;
//       seat.map_vehicle_seat_row_no = row;
//       seat.map_vehicle_seat_column_no = col;
//       seat.map_vehicle_seat_floor_no = floor;
//       seat.map_vehicle_seat_lock_chair = lock_chair;
//       seat.map_vehicle_layout_id = mapvehiclelayoutid;

//       console.log("Saving updated seat...");
//       await seat.save();

//       console.log("Seat updated successfully.");
//       return {
//          id: seat.map_vehicle_seat_id,
//          code: seat.map_vehicle_seat_code,
//          row: seat.map_vehicle_seat_row_no,
//          col: seat.map_vehicle_seat_column_no,
//          floor: seat.map_vehicle_seat_floor_no,
//          lock_chair: seat.map_vehicle_seat_lock_chair,
//          mapvehiclelayoutid: seat.map_vehicle_layout_id,
//       };
//    } catch (error) {
//       console.error("Error in updateMapVehicleSeat:", error);
//       throw new Error("Failed to update seat");
//    }
// };
const updateMapVehicleSeat = async (req) => {
   const { id } = req.params; 
   const { code} = req.body;
   const {row} =req.body;
   const {col} =req.body;
   const {floor} =req.body;
   const {lock_chair} =req.body;
   const {mapvehiclelayoutid} =req.body;
   const mapVehicleSeat = await db.MapVehicleSeat.findByPk(id);
   if (!mapVehicleSeat) {
       throw new Error("Group not found");
   }

   // Cập nhật thông tin
   mapVehicleSeat.map_vehicle_seat_code = code;
   mapVehicleSeat.map_vehicle_seat_row_no = row;
   mapVehicleSeat.map_vehicle_seat_column_no = col;
   mapVehicleSeat.map_vehicle_seat_floor_no = floor;
   mapVehicleSeat.map_vehicle_seat_lock_chair = lock_chair;
   mapVehicleSeat.map_vehicle_layout_id = mapvehiclelayoutid;
  
   await mapVehicleSeat.save();

   return {
      id: seat.map_vehicle_seat_id,
      code: seat.map_vehicle_seat_code,
      row: seat.map_vehicle_seat_row_no,
      col: seat.map_vehicle_seat_column_no,
      floor: seat.map_vehicle_seat_floor_no,
      lock_chair: seat.map_vehicle_seat_lock_chair,
      mapvehiclelayoutid: seat.map_vehicle_layout_id,
       
   };
};
const deleteMapVehicleSeat = async (req) => {
   const {id} = req.params;

   const mapVehicleSeat = await db.MapVehicleSeat.findByPk(id);
   if (!mapVehicleSeat) {
      throw new Error("Map Vehicle Seat not found");
   }

   await mapVehicleSeat.destroy();
   return { message: "Map Vehicle Seat deleted successfully" };
};

module.exports = {
   getAllMapVehicleSeat,
   getMapVehicleSeatById,
   createMapVehicleSeat,
   updateMapVehicleSeat,
   deleteMapVehicleSeat,
};
