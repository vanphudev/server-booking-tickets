const { body, param } = require("express-validator");


const validateEmployee = [
   param("employeeId")
      .notEmpty()
      .withMessage("ID nhân viên không được để trống")
      .isInt()
      .withMessage("ID nhân viên phải là số"),
];

const validateCreateEmployee = [
   body("employee_full_name")
      .notEmpty()
      .withMessage("Họ tên nhân viên không được để trống")
      .isLength({ min: 2, max: 500 })
      .withMessage("Họ tên phải từ 2-500 ký tự"),

   body("employee_email")
      .notEmpty()
      .withMessage("Email không được để trống")
      .isEmail()
      .withMessage("Email không hợp lệ")
      .isLength({ max: 500 })
      .withMessage("Email không được vượt quá 500 ký tự"),

   body("employee_phone")
      .notEmpty()
      .withMessage("Số điện thoại không được để trống")
      .isMobilePhone("vi-VN")
      .withMessage("Số điện thoại không hợp lệ")
      .isLength({ max: 20 })
      .withMessage("Số điện thoại không được vượt quá 20 ký tự"),

   body("employee_username")
      .notEmpty()
      .withMessage("Tên đăng nhập không được để trống")
      .isLength({ min: 3, max: 255 })
      .withMessage("Tên đăng nhập phải từ 3-255 ký tự"),

   body("employee_birthday")
      .notEmpty()
      .withMessage("Ngày sinh không được để trống")
      .isDate()
      .withMessage("Ngày sinh không hợp lệ")
      .custom((value) => {
         if (value < "1900-01-01" || value > "2100-12-31") {
            throw new Error("Ngày sinh phải nằm trong khoảng 1900-01-01 đến 2100-12-31");
         }
         return true;
      }),

   body("employee_gender").notEmpty().withMessage("Giới tính không được để trống").isIn([-1, 0, 1]).withMessage("Giới tính không hợp lệ"),

   body("office_id")
      .notEmpty()
      .withMessage("ID văn phòng không được để trống")
      .isInt()
      .withMessage("ID văn phòng phải là số"),

   body("employee_type_id")
      .notEmpty()
      .withMessage("ID loại nhân viên không được để trống")
      .isInt()
      .withMessage("ID loại nhân viên phải là số"),
];

const validateUpdateEmployee = [
   body("employee_id")
      .notEmpty()
      .withMessage("ID nhân viên không được để trống")
      .isInt()
      .withMessage("ID nhân viên phải là số"),

   body("employee_full_name")
      .notEmpty()
      .withMessage("Họ tên nhân viên không được để trống")
      .isLength({ min: 2, max: 500 })
      .withMessage("Họ tên phải từ 2-500 ký tự"),

   body("employee_email")
      .notEmpty()
      .withMessage("Email không được để trống")
      .isEmail()
      .withMessage("Email không hợp lệ")
      .isLength({ max: 500 })
      .withMessage("Email không được vượt quá 500 ký tự"),

   body("employee_phone")
      .notEmpty()
      .withMessage("Số điện thoại không được để trống")
      .isMobilePhone("vi-VN")
      .withMessage("Số điện thoại không hợp lệ")
      .isLength({ max: 20 })
      .withMessage("Số điện thoại không được vượt quá 20 ký tự"),

   body("employee_username")
      .notEmpty()
      .withMessage("Tên đăng nhập không được để trống")
      .isLength({ min: 3, max: 255 })
      .withMessage("Tên đăng nhập phải từ 3-255 ký tự"),

   body("employee_birthday")
      .notEmpty()
      .withMessage("Ngày sinh không được để trống")
      .isDate()
      .withMessage("Ngày sinh không hợp lệ")
      .custom((value) => {
         if (value < "1900-01-01" || value > "2100-12-31") {
            throw new Error("Ngày sinh phải nằm trong khoảng 1900-01-01 đến 2100-12-31");
         }
         return true;
      }),

   body("employee_gender")
      .notEmpty()
      .withMessage("Giới tính không được để trống")
      .isIn([-1, 0, 1])
      .withMessage("Giới tính không hợp lệ"),

   body("office_id")
      .notEmpty()
      .withMessage("ID văn phòng không được để trống")
      .isInt()
      .withMessage("ID văn phòng phải là số"),

   body("employee_type_id")
      .notEmpty()
      .withMessage("ID loại nhân viên không được để trống")
      .isInt()
      .withMessage("ID loại nhân viên phải là số"),
];


const validateDeleteEmployee = [
   param("employee_id")
      .notEmpty()
      .withMessage("ID nhân viên không được để trống")
      .isInt()
      .withMessage("ID nhân viên phải là số"),
];


module.exports = {
   validateEmployee,
   validateCreateEmployee,
   validateUpdateEmployee,
   validateDeleteEmployee,
};
