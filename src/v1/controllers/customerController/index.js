"use strict";
const __RESPONSE = require("../../core");
const {
   logOutCustomer,
   signInCustomer,
   signUpCustomer,
   handlerRefreshTokenCustomer,
   getCustomerById,
   getAllCustomer,
   lockAccountCustomer,
   unlockAccountCustomer,
   countCustomer,
} = require("../../services/accessService/customerAccess");

const { updateProfileCustomer, updateAddressCustomer, resetPasswordCustomer } = require("../../services/customerService");

const __CUSTOMER_CONTROLLER = {
   logOut: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Logout successfully !",
         metadata: await logOutCustomer(req),
         request: req,
      }).send(res);
   },
   signIn: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Login successfully !",
         metadata: await signInCustomer(req),
         request: req,
      }).send(res);
   },
   signUp: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Sign up successfully !",
         metadata: await signUpCustomer(req),
         request: req,
      }).send(res);
   },
   handlerRefreshToken: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Refresh token successfully !",
         metadata: await handlerRefreshTokenCustomer(req),
         request: req,
      }).send(res);
   },
   getCustomerById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get customer successfully !",
         metadata: await getCustomerById(req),
         request: req,
      }).send(res);
   },
   updateProfile: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Update profile successfully !",
         metadata: await updateProfileCustomer(req),
         request: req,
      }).send(res);
   },
   updateAddress: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Update address successfully !",
         metadata: await updateAddressCustomer(req),
         request: req,
      }).send(res);
   },
   resetPassword: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Reset password successfully !",
         metadata: await resetPasswordCustomer(req),
         request: req,
      }).send(res);
   },
   getAllCustomer: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get all customer successfully !",
         metadata: await getAllCustomer(req),
         request: req,
      }).send(res);
   },
   lockAccountCustomer: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Lock account successfully !",
         metadata: await lockAccountCustomer(req),
         request: req,
      }).send(res);
   },
   unlockAccountCustomer: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Unlock account successfully !",
         metadata: await unlockAccountCustomer(req),
         request: req,
      }).send(res);
   },
   countCustomer: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Count of customers",
         metadata: await countCustomer(),
         request: req,
      }).send(res);
   },
};

module.exports = __CUSTOMER_CONTROLLER;
