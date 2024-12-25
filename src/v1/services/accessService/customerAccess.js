"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const bycrypt = require("bcrypt");
const crypto = require("crypto");
const {createTokenPair, verifyToken} = require("../../middlewares/Auth/authCusUtils");
const {validationResult} = require("express-validator");
const {
   createKeyToken,
   findTokenByCustomerId,
   removeKeyByCustomerId,
   findRefreshTokenUsed,
} = require("../keyTokenService/keyTokenCusService");
const getInfoCustomer = require("../../utils/getInforCustomer");
const sendVoucher = require("../../utils/sendVoucher");
const sendEmailClock = require("../../utils/sendEmailClock");
const sendEmailUnClock = require("../../utils/sendEmailUnClock");
const validatePassword = (password) => {
   const errors = [];
   const minLength = 6;
   if (password.length < minLength) {
      errors.push(`Mật khẩu phải có ít nhất ${minLength} ký tự. \n`);
   }
   if (!/[A-Z]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ hoa. \n");
   }
   if (!/[a-z]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 chữ thường. \n");
   }
   if (!/[0-9]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 số. \n");
   }
   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt. \n");
   }
   return errors;
};

const handlerRefreshTokenCustomer = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {refreshToken, customerId} = req.body;
   const foundKeyTokenUsed = await findRefreshTokenUsed(refreshToken, customerId);
   if (foundKeyTokenUsed) {
      const keyToken = await removeKeyByCustomerId(customerId);
      if (keyToken.deletedCount === 0) {
         throw new __RESPONSE.BadRequestError({
            message: "Token not found - Token không tồn tại !",
            suggestion: "Please check again your request",
            request: req,
         });
      }
      throw new __RESPONSE.UnauthorizedError({
         message: "Token đã được sử dụng! Vui lòng đăng nhập lại!",
         suggestion: "Please check again your request",
         request: req,
      });
   }

   const keyToken = await findTokenByCustomerId(customerId);
   if (!keyToken) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Token không tồn tại! - Đăng nhập lại!",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const {user_id} = verifyToken(refreshToken, keyToken.private_key_customer);
   if (user_id !== customerId) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Token không hợp lệ! - Đăng nhập lại!",
         suggestion: "Please check again your request",
         request: req,
      });
   }

   const customer = await db.Customer.findOne({
      where: {customer_id: user_id},
   });

   if (!customer) {
      throw new __RESPONSE.BadRequestError({
         message: "Customer not found with id " + user_id,
         suggestion: "Please try again with correct id",
         request: req,
      });
   }

   const payLoad = {
      user_id: customer.customer_id,
      phone: customer.customer_phone,
      name: customer.customer_full_name,
      gender: customer.customer_gender,
      avatar: customer.customer_avatar_url,
      destination_address: customer.customer_destination_address,
      birthday: customer.customer_birthday,
   };

   const tokens = await createTokenPair(payLoad, keyToken.public_key_customer, keyToken.private_key_customer);
   await keyToken
      .update(
         {
            refresh_token_key_customer: tokens.refreshToken,
         },
         {where: {customer_id: customer.customer_id}}
      )
      .then((keyToken) => {
         if (!keyToken) {
            throw new __RESPONSE.BadRequestError({
               message: "Update token failed",
               suggestion: "Please try again",
            });
         }
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Update token failed " + error.message,
            suggestion: "Please try again " + error.message,
         });
      });

   await db.RefreshKeyUsedCustomer.create({
      refreshkey_used_customer_key: refreshToken,
      key_store_customer_id: keyToken.key_store_customer_id,
   })
      .then((refreshTokenUsed) => {
         if (!refreshTokenUsed) {
            throw new __RESPONSE.BadRequestError({
               message: "Create refresh token used failed",
               suggestion: "Please try again",
            });
         }
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Create refresh token used failed " + error.message,
            suggestion: "Please try again " + error.message,
         });
      });

   return {
      tokens,
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

const logOutCustomer = async ({keyStore}) => {
   if (!keyStore) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy token - Token not found",
         suggestion: "Please check again your request",
      });
   }
   try {
      const keyToken = await removeKeyByCustomerId(keyStore.customer_id);
      if (!keyToken) {
         throw new __RESPONSE.BadRequestError({
            message: "Logout failed",
            suggestion: "Please try again",
         });
      }
      return {
         message: "Logout success",
         suggestion: "Please login again",
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Logout failed " + error.message,
         suggestion: "Please try again " + error.message,
      });
   }
};

const signInCustomer = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {phone, password} = req.body;
   const customer = await db.Customer.findOne({
      where: {customer_phone: phone},
   });

   if (!customer) {
      throw new __RESPONSE.BadRequestError({
         message: "Customer not found with phone " + phone,
         suggestion: "Please try again with correct phone",
         request: req,
      });
   }
   const isPasswordMatch = await bycrypt.compare(password, customer.customer_password);
   if (!isPasswordMatch) {
      throw new __RESPONSE.BadRequestError({
         message: "Password not match with phone " + phone,
         suggestion: "Please try again with correct password",
         request: req,
      });
   }
   const privateKey = crypto.randomBytes(64).toString("hex");
   const publicKey = crypto.randomBytes(64).toString("hex");

   const payLoad = {
      user_id: customer.customer_id,
      phone: customer.customer_phone,
      name: customer.customer_full_name,
      gender: customer.customer_gender,
      avatar: customer.customer_avatar_url,
      destination_address: customer.customer_destination_address,
      birthday: customer.customer_birthday,
   };

   const tokens = await createTokenPair(payLoad, publicKey, privateKey);
   const keyToken = await createKeyToken({
      userId: customer.customer_id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
   });

   if (!keyToken) {
      throw new __RESPONSE.BadRequestError({
         message: "Create key token failed",
         suggestion: "Please try again",
         request: req,
      });
   }

   return {
      tokens,
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

const signUpCustomer = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }

   const {password, name, phone, gender, email} = req.body;
   const errorsPassword = validatePassword(password);
   if (errorsPassword.length > 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errorsPassword.join(" ") + " !",
         suggestion: errorsPassword,
         request: req,
      });
   }

   const customerGender = parseInt(gender, 10);
   if (![0, 1, -1].includes(customerGender)) {
      throw new __RESPONSE.BadRequestError({
         message: "Invalid gender value!",
         suggestion: "Gender must be 0, 1, or -1.",
         request: req,
      });
   }
   const hashPassword = await bycrypt.hash(password, 10);
   return await db.Customer.create({
      customer_full_name: name,
      customer_phone: phone,
      customer_email: email,
      customer_password: hashPassword,
      customer_gender: customerGender,
   })
      .then(async (customer) => {
         if (!customer) {
            throw new __RESPONSE.BadRequestError({
               message: "Create Account customer failed !",
               suggestion: "Please try again with correct data",
               request: req,
            });
         }

         // Tạo mã voucher: DDMMYYYY_TENNGUOIDUNG_XXXX
         const today = new Date();
         const expiryDate = new Date(today.getTime());
         expiryDate.setMonth(expiryDate.getMonth() + 1);
         const dateStr = today
            .toLocaleDateString("vi-VN", {
               day: "2-digit",
               month: "2-digit",
               year: "numeric",
            })
            .replace(/\//g, "");
         const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
         const voucherCode = `${dateStr}_${removeVietnameseAccents(name)
            .toUpperCase()
            .replace(/\s+/g, "")}_${randomStr}`;

         const voucher = await db.Voucher.create({
            voucher_code: voucherCode,
            voucher_discount_percentage: 15.0,
            voucher_discount_max_amount: 0.0,
            voucher_usage_limit: 1,
            voucher_valid_from: today,
            voucher_valid_to: expiryDate,
         });

         await db.VoucherCustomer.create({
            voucher_id: voucher?.voucher_id,
            customer_id: customer?.customer_id,
         });

         await sendVoucher({
            to: customer?.customer_email,
            subject: `[FUTA Bus Lines] - Kết nối với chúng tôi - Khuyến mãi đặc biệt dành cho Anh/chị ${customer?.customer_full_name}`,
            template: "voucher",
            context: {
               ap_dung: "Khách hàng mở tài khoản mới",
               name_voucher: "Mở tài khoản mới",
               customerName: customer?.customer_full_name,
               voucherCode: voucherCode,
               voucherDiscount: `${voucher?.voucher_discount_percentage.toFixed(2)}`,
               voucherSDate: today.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
               }),
               voucherEDate: expiryDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
               }),
            },
         });

         customer.customer_destination_address = customer.customer_destination_address
            ? JSON.parse(customer.customer_destination_address)
            : {};

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
            voucher: {
               code: voucherCode,
               discount: "15%",
               validTo: expiryDate,
            },
         };
      })
      .catch((error) => {
         if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
            const field = error.fields || {};
            let errorMessage = "Đã tồn tại ";
            if (field.customer_phone) {
               errorMessage += "số điện thoại này trong hệ thống";
            } else if (field.customer_email) {
               errorMessage += "email này trong hệ thống";
            } else {
               errorMessage += "thông tin này trong hệ thống";
            }
            throw new __RESPONSE.BadRequestError({
               message: errorMessage,
               suggestion: "Vui lòng thử lại với thông tin khác",
               request: req,
               field: field,
            });
         }

         throw new __RESPONSE.BadRequestError({
            message: "Tạo tài khoản thất bại " + error.message,
            suggestion: "Vui lòng thử lại với thông tin hợp lệ " + error.message,
            request: req,
         });
      });
};

const getCustomerById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {customerId} = req.body;
   return await db.Customer.findOne({
      where: {customer_id: customerId},
   })
      .then((customer) => {
         if (!customer) {
            throw new __RESPONSE.NotFoundError({
               message: "Customer not found with id " + customerId,
               suggestion: "Please try again with correct id",
               request: req,
            });
         }
         customer.customer_destination_address = customer.customer_destination_address
            ? JSON.parse(customer.customer_destination_address)
            : {};
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
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Get customer failed " + error.message,
            suggestion: "Please try again with correct id " + error.message,
            request: req,
         });
      });
};

const removeVietnameseAccents = (str) => {
   return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
};

const getAllCustomer = async () => {
   return await db.Customer.findAll()
      .then((customers) => {
         if (!customers) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy khách hàng nào",
               suggestion: "Please try again",
            });
         }
         return {
            customers,
            total: customers.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lấy tất cả khách hàng thất bại " + error.message,
            suggestion: "Vui lòng thử lại " + error.message,
         });
      });
};

const lockAccountCustomer = async (req) => {
   const {customer_id} = req.body;
   if (!customer_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp id khách hàng",
         suggestion: "Please provide the customer id",
         request: req,
      });
   }
   const _customer = await db.Customer.findOne({where: {customer_id: customer_id}});
   if (!_customer) {
      throw new __RESPONSE.NotFoundError({
         message: "Khách hàng không tồn tại",
         suggestion: "Please try again with correct id",
         request: req,
      });
   }
   return await db.Customer.update({is_disabled: 1}, {where: {customer_id: customer_id}})
      .then(async (customer) => {
         if (!customer) {
            throw new __RESPONSE.NotFoundError({
               message: "Khách hàng không tồn tại",
               suggestion: "Please try again with correct id",
               request: req,
            });
         }
         await sendEmailClock({
            to: _customer?.customer_email,
            subject: `FUTA BUS LINE - Thông Báo Khóa Tài Khoản ${_customer?.customer_full_name}`,
            template: "clockAcc",
            context: {
               name: _customer?.customer_full_name,
               email: _customer?.customer_email,
            },
         });
         return {
            message: "Khóa tài khoản thành công",
            suggestion: "Please try again",
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Khóa tài khoản thất bại " + error.message,
            suggestion: "Vui lòng thử lại " + error.message,
         });
      });
};

const unlockAccountCustomer = async (req) => {
   const {customer_id} = req.body;
   if (!customer_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp id khách hàng",
         suggestion: "Please provide the customer id",
         request: req,
      });
   }
   const _customer = await db.Customer.findOne({where: {customer_id: customer_id}});
   if (!_customer) {
      throw new __RESPONSE.NotFoundError({
         message: "Khách hàng không tồn tại",
         suggestion: "Please try again with correct id",
         request: req,
      });
   }

   return await db.Customer.update({is_disabled: 0}, {where: {customer_id: customer_id}})
      .then(async (customer) => {
         if (!customer) {
            throw new __RESPONSE.NotFoundError({
               message: "Khách hàng không tồn tại",
               suggestion: "Please try again with correct id",
               request: req,
            });
         }
         await sendEmailUnClock({
            to: _customer?.customer_email,
            subject: `FUTA BUS LINE - Thông Báo Mở Khóa Tài Khoản ${_customer?.customer_full_name}`,
            template: "unclockAcc",
            context: {
               name: _customer?.customer_full_name,
               email: _customer?.customer_email,
            },
         });
         return {
            message: "Mở khóa tài khoản thành công",
            suggestion: "Please try again",
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Mở khóa tài khoản thất bại " + error.message,
            suggestion: "Vui lòng thử lại " + error.message,
         });
      });
};

const countCustomer = async () => {
   return await db.Customer.count()
      .then((count) => {
         return {
            count: count,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Count customer failed " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

module.exports = {
   logOutCustomer,
   signInCustomer,
   signUpCustomer,
   handlerRefreshTokenCustomer,
   getCustomerById,
   getAllCustomer,
   lockAccountCustomer,
   unlockAccountCustomer,
   countCustomer,
};
