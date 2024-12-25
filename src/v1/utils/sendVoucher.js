const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const createTransporter = async () => {
   try {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
         },
      });
      const hbs = await import("nodemailer-express-handlebars");
      const handlebarOptions = {
         viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve("./views/voucher"),
            defaultLayout: false,
         },
         viewPath: path.resolve("./views/voucher"),
         extName: ".handlebars",
      };
      transporter.use("compile", hbs.default(handlebarOptions));
      await transporter.verify();
      console.log("Voucher transporter is ready");
      return transporter;
   } catch (error) {
      console.error("Error creating transporter:", error);
      throw error;
   }
};

const sendVoucher = async ({to, subject, template, context}) => {
   try {
      const transporter = await createTransporter();
      const mailOptions = {
         from: process.env.MAIL_FROM_ADDRESS,
         to: to,
         subject: subject,
         template: template,
         context: context,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("Voucher sent successfully:", info.messageId);
      return info;
   } catch (error) {
      console.error("Error sending voucher:", error);
      throw error;
   }
};

module.exports = sendVoucher;
