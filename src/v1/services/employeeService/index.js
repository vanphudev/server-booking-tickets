"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const getInfoEmployee = require("../../utils/getInforEmployee");
const sendEmailReset = require("../../utils/sendEmailReset");
const bycrypt = require("bcrypt");

const getAllEmployee = async () => {
   return await db.Employee.findAll({
      include: [
         {
            model: db.EmployeeType,
            as: "employee_belongto_employeeType",
         },
         {
            model: db.Office,
            as: "employee_belongto_office",
         },
         {
            model: db.Driver,
            as: "employee_onetoOne_driver",
         },
      ],
      nest: true,
      raw: true,
   })
      .then((employees) => {
         if (!employees) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy nhân viên nào!",
               suggestion: "Vui lòng kiểm tra lại",
            });
         }
         const employeesData = employees?.map((employee) => {
            return {
               ...employee,
               employee_password: "*********",
               employee_type: employee.employee_belongto_employeeType,
               office: employee.employee_belongto_office,
               driver: employee.employee_onetoOne_driver?.driver_id ? employee.employee_onetoOne_driver : null,
               employee_belongto_employeeType: undefined,
               employee_belongto_office: undefined,
               employee_onetoOne_driver: undefined,
            };
         });
         return {
            employees: employeesData,
            total: employees.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra!" + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

const getEmployeeByIdE = async (req) => {
   try {
      const {employeeId} = req.query;
      const employee = await db.Employee.findOne({
         where: {employee_id: employeeId},
         include: [
            {
               model: db.EmployeeType,
               as: "employee_belongto_employeeType",
               attributes: ["employee_type_id", "employee_type_name", "employee_type_description"],
            },
            {
               model: db.Office,
               as: "employee_belongto_office",
               attributes: ["office_id"],
            },
         ],
         attributes: [
            "employee_id",
            "employee_full_name",
            "employee_email",
            "employee_phone",
            "employee_username",
            "employee_birthday",
            "employee_profile_image",
            "employee_profile_image_public_id",
            "employee_gender",
            "is_first_activation",
            "is_locked",
            "last_lock_at",
            "office_id",
            "employee_type_id",
         ],
         nest: true,
         raw: true,
      });

      if (!employee) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy nhân viên!",
            suggestion: "Vui lòng kiểm tra lại ID nhân viên",
            request: req,
         });
      }

      return {employee};
   } catch (error) {
      throw error;
   }
};

const createEmployee = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg,
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }

   const {
      employee_full_name,
      employee_email,
      employee_phone,
      employee_username,
      employee_birthday,
      employee_gender,
      is_locked,
      office_id,
      employee_type_id,
   } = req.body;

   const hashedPassword = await bcrypt.hash("Pass@123456", 10); // Mật khẩu mặc định.

   let {employee_profile_image} = req.body;

   await db.Employee.create({
      employee_full_name,
      employee_email,
      employee_phone,
      employee_username,
      employee_birthday: new Date(employee_birthday),
      employee_password: hashedPassword,
      employee_gender: parseInt(employee_gender),
      office_id: parseInt(office_id),
      employee_type_id: parseInt(employee_type_id),
      is_first_activation: 1,
      is_locked: 0,
      employee_profile_image: employee_profile_image,
      last_lock_at: is_locked === 1 ? new Date() : null,
   })
      .then((employee) => {
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
                  "office_id",
                  "employee_type_id",
               ],
               object: employee,
            }),
         };
      })
      .catch((error) => {
         if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
            const field = error.fields || {};
            let errorMessage = "Đã tồn tại ";
            if (field.employee_email) {
               errorMessage += "email này trong hệ thống";
            } else if (field.employee_phone) {
               errorMessage += "số điện thoại này trong hệ thống";
            } else if (field.employee_username) {
               errorMessage += "tên đăng nhập này trong hệ thống";
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

const updateEmployee = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg,
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }

   const {
      employee_id,
      employee_full_name,
      employee_email,
      employee_phone,
      employee_username,
      employee_birthday,
      employee_gender,
      office_id,
      employee_type_id,
      is_locked,
   } = req.body;

   let {employee_profile_image} = req.body;

   const employee = await db.Employee.findByPk(employee_id);
   if (!employee) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy nhân viên cần cập nhật!",
         suggestion: "Vui lòng kiểm tra lại ID nhân viên",
         request: req,
      });
   }

   await employee
      .update({
         employee_full_name,
         employee_email,
         employee_phone,
         employee_username,
         employee_birthday: new Date(employee_birthday),
         employee_gender: parseInt(employee_gender),
         office_id: parseInt(office_id),
         employee_type_id: parseInt(employee_type_id),
         is_locked: parseInt(is_locked || 0),
         employee_profile_image: employee_profile_image || null,
         last_lock_at: parseInt(is_locked || 0) === 1 ? new Date() : null,
      })
      .then((employee) => {
         if (!employee) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy nhân viên cần cập nhật!",
               suggestion: "Vui lòng kiểm tra lại ID nhân viên",
               request: req,
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
                  "office_id",
                  "employee_type_id",
                  "is_locked",
                  "last_lock_at",
               ],
               object: employee,
            }),
         };
      })
      .catch((error) => {
         console.log(error);
         if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
            const field = error.fields || {};
            let errorMessage = "Đã tồn tại ";
            if (field.employee_email) {
               errorMessage += "email này trong hệ thống";
            } else if (field.employee_phone) {
               errorMessage += "số điện thoại này trong hệ thống";
            } else if (field.employee_username) {
               errorMessage += "tên đăng nhập này trong hệ thống";
            }
         }
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra!" + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

const deleteEmployee = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg,
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }

   const {employee_id} = req.params;

   if (!employee_id) {
      throw new __RESPONSE.BadRequestError({
         message: "ID nhân viên không được để trống",
         suggestion: "Vui lòng cung cấp ID nhân viên",
         request: req,
      });
   }

   const employee = await db.Employee.findByPk(employee_id);
   if (!employee) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy nhân viên!",
         suggestion: "Vui lòng kiểm tra lại ID nhân viên",
         request: req,
      });
   }

   await employee
      .destroy()
      .then((employee) => {
         if (!employee) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy nhân viên!",
               suggestion: "Vui lòng kiểm tra lại ID nhân viên",
               request: req,
            });
         }
         return {
            employee: getInfoEmployee({
               fileds: ["employee_id"],
               object: employee,
            }),
         };
      })
      .catch((error) => {
         if (error.name === "ForeignKeyConstraintError" || error.code === "ER_ROW_IS_REFERENCED_2") {
            throw new __RESPONSE.BadRequestError({
               message: "Không thể xóa nhân viên này!",
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

const resetPassword = async (req) => {
   const {employee_id} = req.body;
   if (!employee_id) {
      throw new __RESPONSE.BadRequestError({
         message: "ID nhân viên không được để trống",
         suggestion: "Vui lòng cung cấp ID nhân viên",
         request: req,
      });
   }
   const hashedPassword = await bcrypt.hash("Pass@123456", 10);

   const employee = await db.Employee.findByPk(employee_id);
   if (!employee) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy nhân viên!",
         suggestion: "Vui lòng kiểm tra lại ID nhân viên",
         request: req,
      });
   }

   await employee
      .update(
         {
            employee_password: hashedPassword,
         },
         {where: {employee_id}}
      )
      .then(async (employee) => {
         if (!employee) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy nhân viên!",
               suggestion: "Vui lòng kiểm tra lại ID nhân viên",
               request: req,
            });
         }
         console.log("employee", employee);
         await sendEmailReset({
            to: employee?.employee_email || "",
            subject: "[FUTA BUS LINES - SYSTEM] Thông báo mật khẩu mới",
            template: "reset",
            context: {
               name: employee?.employee_full_name || "",
               newPassword: "Pass@123456",
            },
         });
         return {
            employee: getInfoEmployee({
               fileds: ["employee_id"],
               object: employee,
            }),
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra!" + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

const updateInfoEmployee = async (req) => {
   const {
      employee_email,
      employee_phone,
      employee_birthday,
      employee_profile_image,
      employee_gender,
      employee_full_name,
      employee_id,
   } = req.body;

   if (!employee_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp mã nhân viên",
         suggestion: "Kiểm tra lại mã nhân viên",
      });
   }

   if (!employee_email) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp email nhân viên",
         suggestion: "Kiểm tra lại email",
      });
   }

   // Kiểm tra email hợp lệ
   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
   if (!emailRegex.test(employee_email)) {
      throw new __RESPONSE.BadRequestError({
         message: "Email không hợp lệ",
         suggestion: "Vui lòng nhập đúng định dạng email",
      });
   }

   if (!employee_phone) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp số điện thoại",
         suggestion: "Kiểm tra lại số điện thoại",
      });
   }

   // Kiểm tra số điện thoại Việt Nam hợp lệ
   const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
   if (!phoneRegex.test(employee_phone)) {
      throw new __RESPONSE.BadRequestError({
         message: "Số điện thoại không hợp lệ",
         suggestion: "Vui lòng nhập đúng định dạng số điện thoại Việt Nam",
      });
   }

   if (!employee_birthday) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp ngày sinh",
         suggestion: "Kiểm tra lại ngày sinh",
      });
   }

   const birthDate = new Date(employee_birthday);
   const today = new Date();
   const age = today.getFullYear() - birthDate.getFullYear();

   if (employee_gender === 1 && age < 18) {
      throw new __RESPONSE.BadRequestError({
         message: "Nhân viên nữ phải đủ 18 tuổi trở lên",
         suggestion: "Vui lòng kiểm tra lại ngày sinh",
      });
   }

   if (!employee_profile_image) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp ảnh đại diện",
         suggestion: "Kiểm tra lại ảnh đại diện",
      });
   }

   if (!employee_gender && employee_gender !== 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp giới tính - Please provide gender",
         suggestion: "Kiểm tra lại giới tính",
      });
   }

   if (!employee_full_name) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng cung cấp họ tên đầy đủ",
         suggestion: "Kiểm tra lại họ tên",
      });
   }
   return await db.Employee.update(
      {
         employee_email,
         employee_phone,
         employee_birthday,
         employee_profile_image,
         employee_gender,
         employee_full_name,
      },
      {where: {employee_id: employee_id}}
   )
      .then((employee) => {
         if (!employee) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy nhân viên - Employee not found",
            });
         }
         return {employee};
      })
      .catch((error) => {
         if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
            const field = error.errors?.[0]?.path || "";
            let message = "";
            if (field === "employee_email") {
               message = "Email này đã được sử dụng trong hệ thống";
            } else if (field === "employee_phone") {
               message = "Số điện thoại này đã được sử dụng trong hệ thống";
            } else {
               message = "Thông tin này đã tồn tại trong hệ thống";
            }
            throw new __RESPONSE.BadRequestError({
               message: message,
               suggestion: "Vui lòng thử lại với thông tin khác",
            });
         }
         if (error.name === "SequelizeValidationError") {
            throw new __RESPONSE.BadRequestError({
               message: "Lỗi cập nhật nhân viên - Error updating employee",
               suggestion: "Please check again your request",
            });
         }
      });
};

const updatePassword = async (req) => {
   const {password_old, password_new, employee_id} = req.body;

   if (!password_old) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng nhập mật khẩu cũ - Please enter old password",
         suggestion: "Vui lòng kiểm tra lại thông tin",
      });
   }

   if (!password_new) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng nhập mật khẩu mới - Please enter new password",
         suggestion: "Vui lòng kiểm tra lại thông tin",
      });
   }

   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
   if (!passwordRegex.test(password_new)) {
      throw new __RESPONSE.BadRequestError({
         message: "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
         suggestion: "Vui lòng nhập mật khẩu đúng định dạng yêu cầu",
      });
   }

   if (!employee_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu mã nhân viên - Missing employee ID",
         suggestion: "Vui lòng kiểm tra lại thông tin",
      });
   }
   const employee = await db.Employee.findOne({where: {employee_id: employee_id}});
   if (!employee) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy nhân viên - Employee not found",
      });
   }
   const isPasswordValid = await bycrypt.compare(password_old, employee.employee_password);
   if (!isPasswordValid) {
      throw new __RESPONSE.BadRequestError({
         message: "Mật khẩu cũ không đúng - Old password is incorrect",
      });
   }
   const hashedPassword = await bycrypt.hash(password_new, 10);
   return await db.Employee.update({employee_password: hashedPassword}, {where: {employee_id: employee_id}}).then(
      (employee) => {
         if (!employee) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy nhân viên - Employee not found",
            });
         }
      }
   );
};

const countEmployee = async () => {
   return await db.Employee.count()
      .then((count) => {
         return {
            count: count,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Đã có lỗi xảy ra!" + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

module.exports = {
   getAllEmployee,
   getEmployeeByIdE,
   createEmployee,
   updateEmployee,
   deleteEmployee,
   resetPassword,
   updateInfoEmployee,
   updatePassword,
   countEmployee,
};
