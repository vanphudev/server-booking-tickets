"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const getInfoCustomer = require("../../utils/getInforCustomer");

const updateProfileCustomer = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {keyStore} = req;
   if (!keyStore) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Unauthorized - Customer - Key store is required",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const {customer_id} = keyStore;
   const {name, email, avatar, phone, gender, date_of_birth} = req.body;
   const customer = await db.Customer.findOne({
      where: {
         customer_id: customer_id,
         customer_phone: phone,
      },
   });
   if (!customer) {
      throw new __RESPONSE.NotFoundError({
         message: "Customer not found",
         suggestion: "Please check again your request",
         request: req,
      });
   }

   await db.Customer.update(
      {
         customer_full_name: name,
         customer_email: email,
         customer_avatar: avatar,
         customer_gender: gender,
         customer_birthday: date_of_birth,
      },
      {
         where: {
            customer_id: customer_id,
            customer_phone: phone,
         },
      }
   );

   return {
      customer: getInfoCustomer({
         fileds: [
            "customer_id",
            "customer_full_name",
            "customer_email",
            "customer_phone",
            "customer_gender",
            "customer_birthday",
            "customer_avatar",
            "customer_destination_address",
         ],
         object: customer,
      }),
   };
};

const updateAddressCustomer = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {keyStore} = req;
   if (!keyStore) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Unauthorized - Customer - Key store is required",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const {customer_id} = keyStore;
   const {province_id, district_id, ward_id, address} = req.body;
   const addressDetail = {
      province_id: province_id,
      district_id: district_id,
      ward_id: ward_id,
      address: address,
   };
   const customer = await db.Customer.findOne({
      where: {
         customer_id: customer_id,
      },
   });
   if (!customer) {
      throw new __RESPONSE.NotFoundError({
         message: "Customer not found",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   return await db.Customer.update(
      {
         customer_destination_address: JSON.stringify(addressDetail),
      },
      {where: {customer_id: customer_id}}
   )
      .then((Customer) => {
         if (!Customer) {
            throw new __RESPONSE.NotFoundError({
               message: "Customer not found",
               suggestion: "Please check again your request",
               request: req,
            });
         }
         return {
            message: "Update address successfully",
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Update address failed",
            suggestion: "Please check again your request",
            request: req,
         });
      });
};

const resetPasswordCustomer = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {keyStore} = req;
   if (!keyStore) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Unauthorized - Customer - Key store is required",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const {customer_id} = keyStore;
   const {old_password, new_password} = req.body;
   const customer = await db.Customer.findOne({
      where: {
         customer_id: customer_id,
      },
   });
   if (!customer) {
      throw new __RESPONSE.NotFoundError({
         message: "Customer not found",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const isMatch = await bcrypt.compare(old_password, customer.customer_password);
   if (!isMatch) {
      throw new __RESPONSE.BadRequestError({
         message: "Old password is incorrect",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const hashedPassword = await bcrypt.hash(new_password, 10);
   await db.Customer.update({customer_password: hashedPassword}, {where: {customer_id: customer_id}});
   return {
      message: "Reset password successfully",
   };
};

const countCustomer = async () => {
   return await db.Customer.count().then((count) => {
      return {
         count: count,
      };
   }).catch((error) => {
      throw new __RESPONSE.BadRequestError({
         message: "Count customer failed",
         suggestion: "Please check again your request",
         request: req,
      });
   });
};

module.exports = {
   updateProfileCustomer,
   updateAddressCustomer,
   resetPasswordCustomer,
   countCustomer,
};
