"use strict";
const jwt = require("jsonwebtoken");
const asyncHandler = require("../handleError");
const crypto = require("crypto");
const __RESPONSE = require("../../core");
const db = require("../../models");

const EXPIRES_IN_ACCESS_TOKEN = "30d";
const EXPIRES_IN_REFRESH_TOKEN = "30d";

const createTokenPair = async (payload, publicKey, privateKey) => {
   const jti = crypto.randomBytes(32).toString("hex");
   const tokenPayload = {
      ...payload,
      jti,
      iat: Math.floor(Date.now() / 1000),
   };
   try {
      const accessToken = jwt.sign(tokenPayload, publicKey, {expiresIn: EXPIRES_IN_ACCESS_TOKEN});
      const refreshToken = jwt.sign(tokenPayload, privateKey, {expiresIn: EXPIRES_IN_REFRESH_TOKEN});
      return {accessToken, refreshToken};
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Lỗi tạo token - Error creating token - " + error.message,
         suggestion: "Please check again your request",
         request: req,
      });
   }
};

const authentication = asyncHandler(async (req, res, next) => {
   if (!req.headers || Object.keys(req.headers).length === 0) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Không tìm thấy headers - Headers not found",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   if (!req.headers.client_id || !req.headers.authorization) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Tham số client_id và authorization là bắt buộc - client_id and authorization are required",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const client_id = req.headers.client_id;
   if (!client_id) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Client id is required",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const keyStore = await db.KeyStoreEmployee.findOne({
      where: {
         employee_id: client_id,
      },
      attributes: ["public_key_employee", "private_key_employee", "refresh_token_key_employee", "employee_id"],
   });
   if (!keyStore) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Không tìm thấy người dùng trong Token - User not found in Token",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const accessToken = req.headers.authorization;
   if (!accessToken) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Access token is required",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   jwt.verify(accessToken, keyStore.public_key_employee, (error, decoded) => {
      if (error) {
         if (error instanceof jwt.TokenExpiredError) {
            throw new __RESPONSE.RefreshToken({
               message: "Access token hết hạn - Access token expired",
               suggestion: "Please check again your request",
               request: req,
            });
         }
         if (error instanceof jwt.JsonWebTokenError) {
            throw new __RESPONSE.UnauthorizedError({
               message: "Access token giải mã không hợp lệ - Access token is invalid" + error.message,
               suggestion: "Please check again your request",
               request: req,
            });
         }
      }
      if (decoded.userId != client_id) {
         throw new __RESPONSE.UnauthorizedError({
            message: "User không hợp lệ với token - User is invalid with token - client_id # userId",
            suggestion: "Please check again your request",
            request: req,
         });
      }
      req.keyStore = keyStore;
      return next();
   });
});

const verifyToken = (token, keySecret) => {
   return jwt.verify(token, keySecret, (err, decoded) => {
      if (err) {
         return null;
      }
      return decoded;
   });
};

module.exports = {
   createTokenPair,
   authentication,
   verifyToken,
};
