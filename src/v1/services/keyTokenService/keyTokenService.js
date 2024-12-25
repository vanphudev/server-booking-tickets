"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");

const createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
   return await db.KeyStoreEmployee.upsert({
      employee_id: userId,
      public_key_employee: publicKey,
      private_key_employee: privateKey,
      refresh_token_key_employee: refreshToken,
   })
      .then(([keyStore, created]) => {
         if (!keyStore) {
            throw new __RESPONSE.BadRequestError({
               message: "Lỗi tạo token - Error creating token",
               suggestion: "Please check again your request",
            });
         }
         return {
            keyStore,
            created,
         };
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.BadRequestError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi tạo token - Error creating token - " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

const findTokenByEmployeeId = async (employeeId) => {
   return await db.KeyStoreEmployee.findOne({where: {employee_id: employeeId}})
      .then((keyStore) => {
         return keyStore;
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi tìm token - Error finding token - " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

const removeKeyByEmployeeId = async (employeeId) => {
   return await db.KeyStoreEmployee.destroy({where: {employee_id: employeeId}})
      .then((deletedCount) => {
         if (deletedCount === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy token - Token not found",
               suggestion: "Please check again your request",
            });
         }
         return {deletedCount};
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi xóa token - Error deleting token - " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

const findRefreshTokenUsed = async (refreshToken, employeeId) => {
   const keyStore = await db.KeyStoreEmployee.findOne({where: {employee_id: employeeId}});
   if (!keyStore) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy token - Token not found - Employee",
         suggestion: "Please check again your request",
      });
   }

   return await db.RefreshKeyUsedEmployee.findOne({
      where: {refreshkey_used_employee_key: refreshToken, key_store_employee_id: keyStore.key_store_employee_id},
   })
      .then((refreshTokenUsed) => {
         if (!refreshTokenUsed) {
            return null;
         }
         return refreshTokenUsed;
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi tìm refresh token đã dùng - Error finding refresh token used - " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

module.exports = {
   createKeyToken,
   findTokenByEmployeeId,
   removeKeyByEmployeeId,
   findRefreshTokenUsed,
};
