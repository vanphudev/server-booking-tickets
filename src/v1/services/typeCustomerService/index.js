"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const validator = require("validator");

const createTypeCustomer = async (req) => {
   const {name, description} = req.body;
   // có tôn tại hong.
   // khác rỗng.
   // khác nulll và undefined và "" và 0 và false => empty
   const typeCustomer = await db.CustomerType.create({
      customer_type_name: name,
      customer_type_description: description,
   });
   return {
      id: typeCustomer.customer_type_id,
      name: typeCustomer.customer_type_name,
      description: typeCustomer.customer_type_description,
   };
};

// const updateTypeCustomer = async (req) => {
//    const {name, description} = req.body;
//    const typeCustomer = await db.TypeCustomer.create({
//       customer_type_name: name,
//       customer_type_description: description,
//    });
//    return typeCustomer;
// };

module.exports = {
   createTypeCustomer,
   // updateTypeCustomer,
};
