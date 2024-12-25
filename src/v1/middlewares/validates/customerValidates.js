const { body, param } = require("express-validator");

const validateCustomer = [
   body("customerId")
      .notEmpty()
      .withMessage("ID khách hàng không được để trống !")
      .isInt()
      .withMessage("ID khách hàng phải là số"),
];

const validateUpdateCustomer = [
   body("name").optional().isLength({ min: 2, max: 500 }).withMessage("Họ tên phải từ 2-500 ký tự"),
   body("email").optional().isEmail().withMessage("Email không hợp lệ"),
   body("phone").optional().isMobilePhone("vi-VN").withMessage("Số điện thoại không hợp lệ"),
   body("gender").optional().isIn([-1, 0, 1]).withMessage("Giới tính không hợp lệ"),
   body("date_of_birth")
      .optional()
      .custom((value) => {
         const date = new Date(value);
         return !isNaN(date.getTime());
      })
      .withMessage("Ngày sinh không hợp lệ"),
   body("avatar")
      .optional()
      .custom((value) => {
         if (value.startsWith('data:image/')) {
            const base64String = value.split(',')[1];
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            return base64Regex.test(base64String);
         }
         return false;
      })
      .withMessage("Avatar phải là base64 image URL hợp lệ"),
];

const validateResetPassword = [
   body("old_password").notEmpty().withMessage("Mật khẩu cũ không được để trống !"),
   body("new_password").notEmpty().withMessage("Mật khẩu mới không được để trống !"),
];

const validateUpdateAddress = [
   body("province_id").notEmpty().withMessage("Tỉnh/Thành phố không được để trống !"),
   body("district_id").notEmpty().withMessage("Quận/Huyện không được để trống !"),
   body("ward_id").notEmpty().withMessage("Phường/Xã không được để trống !"),
   body("address").notEmpty().withMessage("Địa chỉ không được để trống !"),
];

module.exports = {
   validateCustomer,
   validateUpdateCustomer,
   validateResetPassword,
   validateUpdateAddress,
};
