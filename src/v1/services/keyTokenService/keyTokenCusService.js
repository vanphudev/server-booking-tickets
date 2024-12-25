"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");

const createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
   return await db.KeyStoreCustomer.upsert({
      customer_id: userId,
      public_key_customer: publicKey,
      private_key_customer: privateKey,
      refresh_token_key_customer: refreshToken,
   })
      .then(([keyStore, created]) => {
         if (!keyStore) {
            throw new __RESPONSE.BadRequestError({
               message: "Lỗi tạo token - Error creating token - Customer key store not found",
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

const findTokenByCustomerId = async (customerId) => {
   return await db.KeyStoreCustomer.findOne({where: {customer_id: customerId}})
      .then((keyStore) => {
         if (!keyStore) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy token - Token not found",
               suggestion: "Please check again your request",
            });
         }
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

const removeKeyByCustomerId = async (customerId) => {
   return await db.KeyStoreCustomer.destroy({where: {customer_id: customerId}})
      .then((deletedCount) => {
         if (deletedCount === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy token - Token not found",
               suggestion: "Please check again your request",
            });
         }
         return {
            deletedCount,
            message: "Xóa token thành công - Token deleted successfully",
         };
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

const findRefreshTokenUsed = async (refreshToken, customerId) => {
   const keyStore = await db.KeyStoreCustomer.findOne({where: {customer_id: customerId}});
   if (!keyStore) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy token - Token not found - Customer",
         suggestion: "Please check again your request",
      });
   }

   return await db.RefreshKeyUsedCustomer.findOne({
      where: {refreshkey_used_customer_key: refreshToken, key_store_customer_id: keyStore.key_store_customer_id},
   })
      .then((refreshTokenUsed) => {
         return refreshTokenUsed;
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi tìm refresh token đã dùng - Error finding refresh token used - " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

module.exports = {
   createKeyToken,
   findTokenByCustomerId,
   removeKeyByCustomerId,
   findRefreshTokenUsed,
};
