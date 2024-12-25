const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");
const __RESPONSE = require("../core/");
require("dotenv").config();
const crypto = require("crypto");
const {normalizeVietnameseString} = require("./normalizeVietnameseString");

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploadMiddleware = ({maxFiles = 10, customFolder = "others"}) => {
   const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
         const dynamicFolder = process.env.CLOUDINARY_CLOUD_FOLDER + customFolder;
         let format = file.mimetype.split("/")[1];
         if (format === "svg+xml") {
            format = "svg";
         }
         return {
            folder: dynamicFolder,
            format: format,
            public_id: `${Date.now()}_${normalizeVietnameseString(
               decodeURIComponent(req.headers?.officename) || "error_name"
            )}_${normalizeVietnameseString(req.headers?.officeid || "error_id")}_${crypto
               .randomBytes(32)
               .toString("hex")}`,
            allowed_formats: ["jpg", "png", "jpeg", "svg", "webp", "ico", "gif", "tiff", "bmp", "avif", "svg+xml"],
         };
      },
   });

   const uploadMultiple = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
         if (file.mimetype.startsWith("image/")) {
            cb(null, true);
         } else {
            cb(new Error("Chỉ chấp nhận file hình ảnh!"), false);
         }
      },
      limits: {
         fileSize: 1024 * 1024 * 100,
      },
   }).array("images", maxFiles);

   return async (req, res, next) => {
      try {
         uploadMultiple(req, res, async function (err) {
            if (err) {
               throw new __RESPONSE.BadRequestError({
                  message: "Lỗi khi upload ảnh - " + err.message.toString(),
                  reason: err.message.toString(),
                  suggestion: "Vui lòng kiểm tra lại file upload",
                  request: req,
               });
            }
            const uploadedFiles = req.files;
            req.uploadedImages =
               uploadedFiles && uploadedFiles.length > 0
                  ? uploadedFiles.map((file) => ({
                       url: file.path,
                       public_id: file.filename,
                       original_name: file.originalname,
                    }))
                  : [];
            next();
         });
      } catch (error) {
         next(error);
      }
   };
};

const deleteImage = async (public_id) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
         if (error) {
            reject(error);
         } else {
            resolve(result);
         }
      });
   });
};

module.exports = {createUploadMiddleware, deleteImage};
