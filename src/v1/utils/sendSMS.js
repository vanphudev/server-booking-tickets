require("dotenv").config();
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
   throw new Error("Thiếu thông tin xác thực Twilio trong file .env");
}
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
   .create({
      body: `\nHÓA ĐƠN THANH TOÁN FUTA BUS LINES\n
      MÃ HÓA ĐƠN: HDHRH727SHHS1717\n
      Ngày thanh toán: 03/12/2024\n
      Khách hàng: Nguyễn Văn Phú.\n
      Tổng tiền: 100.000 VNĐ\n
      Số vé: 1 vé.\n
      Số lượng ghế: 1 ghế.\n
      Số ghế: A1, B2, C3.\n
      Điểm đi: Hà Nội\n
      Điểm đến: Hải Phòng\n
      Thời gian: 12:00\n
      Xem chi tiết tại: https://futabus.vn/invoice/HDHRH727SHHS1717\n
      Nếu có thắc mắc vui lòng liên hệ hotline: 0906969696\n
      Futa Bus Lines cảm ơn quý khách!
      `,
      from: "+16812434122",
      to: "+84377985402",
   })
   .then((message) => console.log(message.sid));
