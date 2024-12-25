"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");
const { validationResult } = require("express-validator");

const getAllTypeEmployee = async () => {
   return await db.EmployeeType.findAll({
      raw: true,
      nest: true,
   }).then(employeeTypes => {
      if (!employeeTypes) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy loại nhân viên!",
            suggestion: "Vui lòng kiểm tra lại",
         });
      }
      return {
         employeeTypes: employeeTypes,
         total: employeeTypes.length,
      };
   }).catch(error => {
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra!" + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   });
};

const createEmployeeType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg,
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }
   const { employee_type_name, employee_type_description } = req.body;
   await db.EmployeeType.create({
      employee_type_name,
      employee_type_description
   }).then(employeeType => {

      if (!employeeType) {
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra - Tạo loại nhân viên thất bại!",
            suggestion: "Vui lòng thử lại sau",
         });
      }
      return {
         employeeType,
         message: "Tạo loại nhân viên thành công!",
      };
   }).catch(error => {
      if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
         const field = error.fields || {};
         let errorMessage = "Đã tồn tại ";
         if (field.employee_type_name) {
            errorMessage += "tên loại nhân viên này trong hệ thống";
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
         message: "Đã có lỗi xảy ra!" + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   });
};

const updateEmployeeType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg,
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }
   const { employee_type_id, employee_type_name, employee_type_description } = req.body;
   const employeeType = await db.EmployeeType.findByPk(employee_type_id);
   if (!employeeType) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy loại nhân viên - Cập nhật thất bại!",
         suggestion: "Vui lòng kiểm tra lại ID Loại Nhân Viên",
         request: req,
      });
   }


   await employeeType.update({
      ...(employee_type_name && { employee_type_name }),
      ...(employee_type_description && { employee_type_description })
   }).then(employeeType => {
      if (!employeeType) {
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra - Cập nhật loại nhân viên thất bại!",
            suggestion: "Vui lòng thử lại sau",
         });
      }
      return {
         employeeType,
         message: "Cập nhật loại nhân viên thành công!",
      };
   }).catch(error => {
      if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
         const field = error.fields || {};
         let errorMessage = "Đã tồn tại ";
         if (field.employee_type_name) {
            errorMessage += "tên loại nhân viên này trong hệ thống";
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
         message: "Đã có lỗi xảy ra!" + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   });
};

const deleteEmployeeType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg,
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }
   const { employee_type_id } = req.body;
   const employeeType = await db.EmployeeType.findByPk(employee_type_id);
   if (!employeeType) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy loại nhân viên!",
         suggestion: "Vui lòng kiểm tra lại ID",
         request: req,
      });
   }

   await employeeType.destroy().then(employeeType => {
      if (!employeeType) {
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra - Xóa loại nhân viên thất bại!",
            suggestion: "Vui lòng thử lại sau",
         });
      }
      return {
         employeeType,
         message: "Xóa loại nhân viên thành công!",
      };
   }).catch(error => {
      if (error.name === "ForeignKeyConstraintError") {
         throw new __RESPONSE.BadRequestError({
            message: "Không thể xóa loại nhân viên này!",
            suggestion: "Vẫn còn nhân viên thuộc loại này",
            request: req,
         });
      }
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra!" + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   });
};

module.exports = {
   getAllTypeEmployee,
   createEmployeeType,
   updateEmployeeType,
   deleteEmployeeType
};