"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const bycrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const crypto = require("crypto");
const {createTokenPair, verifyToken} = require("../../middlewares/Auth/authUtils");

const {
   createKeyToken,
   findTokenByEmployeeId,
   removeKeyByEmployeeId,
   findRefreshTokenUsed,
} = require("../keyTokenService/keyTokenService");
const getInfoEmployee = require("../../utils/getInforEmployee");

const handlerRefreshToken = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {refreshToken, employeeId} = req.body;
   console.log("refreshToken mà nó truyền vào: ", refreshToken);
   const foundKeyTokenUsed = await findRefreshTokenUsed(refreshToken, employeeId);
   console.log("foundKeyTokenUsed mà nó tìm được ở trong database: ", foundKeyTokenUsed);
   if (foundKeyTokenUsed) {
      const foundKeyToken = await db.KeyStoreEmployee.findOne({
         where: {key_store_employee_id: foundKeyTokenUsed.key_store_employee_id},
      });
      console.log("foundKeyToken mà nó tìm được ở trong database: ", foundKeyToken);
      const {userId} = verifyToken(refreshToken, foundKeyToken.private_key_employee);
      console.log("userId mà nó tìm được ở trong token: ", userId);
      if (!userId) {
         throw new __RESPONSE.UnauthorizedError({
            message: "Token không hợp lệ! Vui lòng đăng nhập lại!",
            suggestion: "Please check again your request",
            request: req,
         });
      }
      await removeKeyByEmployeeId(userId);
      throw new __RESPONSE.UnauthorizedError({
         message: "Token đã được sử dụng trước đó! Vui lòng đăng nhập lại!",
         suggestion: "Please check again your request",
         request: req,
      });
   }
   const foundKeyToken = await findTokenByEmployeeId(employeeId);
   if (foundKeyToken) {
      const {userId} = verifyToken(refreshToken, foundKeyToken.private_key_employee);
      if (!userId) {
         throw new __RESPONSE.UnauthorizedError({
            message: "Token không hợp lệ! Vui lòng đăng nhập lại!",
            suggestion: "Please check again your request",
            request: req,
         });
      }
      const employee = await db.Employee.findOne({where: {employee_id: userId}});
      if (!employee) {
         throw new __RESPONSE.UnauthorizedError({
            message: "Nhân viên không tồn tại! - Đăng nhập lại!",
            suggestion: "Please check again your request",
            request: req,
         });
      }
      const tokens = await createTokenPair(
         {
            userId: employee.employee_id,
            email: employee.employee_email,
            phone: employee.employee_phone,
            fullName: employee.employee_full_name,
            gender: employee.employee_gender,
            birthday: employee.employee_birthday,
            username: employee.employee_username,
         },
         foundKeyToken.public_key_employee,
         foundKeyToken.private_key_employee
      );

      await foundKeyToken
         .update(
            {
               refresh_token_key_employee: tokens.refreshToken,
            },
            {where: {employee_id: employee.employee_id}}
         )
         .then((keyToken) => {
            if (!keyToken) {
               throw new __RESPONSE.UnauthorizedError({
                  message: "Lỗi cập nhật token - Error updating token",
                  suggestion: "Please check again your request",
               });
            }
         });

      await db.RefreshKeyUsedEmployee.create({
         key_store_employee_id: foundKeyToken.key_store_employee_id,
         refreshkey_used_employee_key: refreshToken,
      }).then((refreshKeyUsed) => {
         if (!refreshKeyUsed) {
            throw new __RESPONSE.UnauthorizedError({
               message: "Lỗi thêm token vào danh sách đã sử dụng - Error adding token to used list",
               suggestion: "Please check again your request",
            });
         }
      });

      return {
         employee: getInfoEmployee({
            fileds: [
               "employee_id",
               "employee_email",
               "employee_phone",
               "employee_birthday",
               "employee_username",
               "employee_profile_image",
               "employee_gender",
               "employee_full_name",
            ],
            object: employee,
         }),
         tokens,
      };
   } else {
      throw new __RESPONSE.UnauthorizedError({
         message: "Token không tồn tại! - Đăng nhập lại!",
         suggestion: "Please check again your request",
         request: req,
      });
   }
};

const logOut = async ({keyStore}) => {
   if (!keyStore) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy token - Token not found",
         suggestion: "Please check again your request",
      });
   }
   const keyToken = await removeKeyByEmployeeId(keyStore.employee_id);
   if (!keyToken) {
      throw new __RESPONSE.BadRequestError({
         message: "Lỗi xóa token - Error deleting token",
         suggestion: "Please check again your request",
      });
   }
   return {keyToken};
};

const signIn = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {username, password} = req.body;
   const employee = await db.Employee.findOne({where: {employee_username: username}});
   if (!employee) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy nhân viên - Employee not found",
         suggestion: "Please check again your request",
      });
   }

   const isPasswordValid = await bycrypt.compare(password, employee.employee_password);
   if (!isPasswordValid) {
      throw new __RESPONSE.BadRequestError({
         message: "Mật khẩu không đúng - Invalid password",
         suggestion: "Please check again your request",
      });
   }

   const privateKey = crypto.randomBytes(64).toString("hex");
   const publicKey = crypto.randomBytes(64).toString("hex");

   const tokens = await createTokenPair(
      {
         userId: employee.employee_id,
         email: employee.employee_email,
         phone: employee.employee_phone,
         fullName: employee.employee_full_name,
         gender: employee.employee_gender,
         birthday: employee.employee_birthday,
         username: employee.employee_username,
      },
      publicKey,
      privateKey
   );

   await createKeyToken({userId: employee.employee_id, publicKey, privateKey, refreshToken: tokens.refreshToken})
      .then((keyToken) => {
         if (!keyToken) {
            throw new __RESPONSE.BadRequestError({
               message: "Lỗi tạo token - Error creating token",
               suggestion: "Please check again your request",
            });
         }
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.BadRequestError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi tạo token - Error creating token",
            suggestion: "Please check again your request",
         });
      });
   return {
      employee: getInfoEmployee({
         fileds: [
            "employee_id",
            "employee_email",
            "employee_phone",
            "employee_birthday",
            "employee_username",
            "employee_profile_image",
            "employee_gender",
            "employee_full_name",
         ],
         object: employee,
      }),
      tokens,
   };
};

const getEmployeeById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {employeeId} = req.params;
   const employee = await db.Employee.findOne({where: {employee_id: employeeId}});
   if (!employee) {
      throw new __RESPONSE.UnauthorizedError({
         message: "Không tìm thấy nhân viên - Employee not found",
         suggestion: "Please check again your request",
      });
   }
   return {
      employee: getInfoEmployee({
         fileds: [
            "employee_id",
            "employee_email",
            "employee_phone",
            "employee_birthday",
            "employee_username",
            "employee_profile_image",
            "employee_gender",
            "employee_full_name",
         ],
         object: employee,
      }),
   };
};

// const updateEmployee = async (req) => {
//    const {employee_id} = req.params;
//    const {
//       employee_email,
//       employee_phone,
//       employee_birthday,
//       employee_username,
//       employee_profile_image,
//       employee_gender,
//       employee_full_name,
//    } = req.body;

//    if (
//       !employee_email ||
//       !employee_phone ||
//       !employee_birthday ||
//       !employee_username ||
//       !employee_profile_image ||
//       !employee_gender ||
//       !employee_full_name
//    ) {
//       throw new __RESPONSE.BadRequestError({
//          message: "Vui lòng điền đẩy đủ thông tin - Please fill in all the information",
//          suggestion: "Please check again your request",
//       });
//    }

//    return await db.Employee.update(
//       {
//          employee_email,
//          employee_phone,
//          employee_birthday,
//          employee_username,
//          employee_profile_image,
//          employee_gender,
//          employee_full_name,
//       },
//       {where: {employee_id: employee_id}}
//    )
//       .then((employee) => {
//          if (!employee) {
//             throw new __RESPONSE.NotFoundError({
//                message: "Không tìm thấy nhân viên - Employee not found",
//             });
//          }
//          return {employee};
//       })
//       .catch((error) => {
//          if (error.name === "SequelizeValidationError") {
//             throw new __RESPONSE.BadRequestError({
//                message: "Lỗi cập nhật nhân viên - Error updating employee",
//                suggestion: "Please check again your request",
//             });
//          }
//          throw new __RESPONSE.BadRequestError({
//             message: "Lỗi cập nhật nhân viên - Error updating employee",
//          });
//       });
// };

module.exports = {logOut, signIn, handlerRefreshToken, getEmployeeById};
