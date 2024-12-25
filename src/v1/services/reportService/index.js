"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const {QueryTypes} = require("sequelize");

const getReportByTrip = async (req) => {
   const {startDate, endDate, routeId} = req.body;
   if (!routeId) {
      throw new __RESPONSE.BAD_REQUEST("Mã tuyến đường là bắt buộc!");
   }
   if (!startDate || !endDate) {
      throw new __RESPONSE.BAD_REQUEST("Ngày bắt đầu và ngày kết thúc là bắt buộc!");
   }
   if (new Date(endDate) <= new Date(startDate)) {
      throw new __RESPONSE.BAD_REQUEST("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
   }

   const query = `
      SELECT 
         r.route_name,
         t.trip_departure_time as start_time,
         t.trip_arrival_time as end_time,
         vt.vehicle_type_name as vehicle_type,
         
         -- Số ghế trống (status = 0)
         SUM(CASE WHEN bs.booking_seat_status = 0 THEN 1 ELSE 0 END) as total_empty_seats,
         
         -- Số ghế đã đặt (status = 1)
         SUM(CASE WHEN bs.booking_seat_status = 1 THEN 1 ELSE 0 END) as total_booked_seats,
         
         -- Số lượng vé hoàn (lấy từ subquery)
         COALESCE(refund_stats.total_refunded_tickets, 0) as total_refunded_tickets,
         
         -- Tổng tiền hoàn vé
         COALESCE(refund_stats.total_refunded_amount, 0) as total_refunded_amount,
         
         -- Tổng tiền giảm giá và doanh thu
         COALESCE(booking_stats.total_discount_amount, 0) as total_discount_amount,
         COALESCE(booking_stats.total_trips, 0) as total_trips,
         COALESCE(booking_stats.total_actual_trips, 0) as total_actual_trips,
         
         -- Doanh thu thực tế
         (COALESCE(booking_stats.total_actual_trips, 0) - COALESCE(refund_stats.total_refunded_amount, 0)) as total_revenue

      FROM trips t
      INNER JOIN routes r ON t.route_id = r.route_id
      INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id 
      INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
      INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id
      LEFT JOIN booking_seats bs ON t.trip_id = bs.trip_id AND bs.deleted_at IS NULL
      LEFT JOIN tickets tk ON bs.booking_seat_id = tk.booking_seat_id

      -- Subquery tính tổng tiền hoàn vé và số lượng vé hoàn
      LEFT JOIN (
         SELECT 
            t3.trip_id,
            COUNT(DISTINCT rf3.refund_id) as total_refunded_tickets,
            SUM(rf3.refund_amount) as total_refunded_amount
         FROM trips t3
         LEFT JOIN booking_seats bs3 ON t3.trip_id = bs3.trip_id
         LEFT JOIN tickets tk3 ON bs3.booking_seat_id = tk3.booking_seat_id
         LEFT JOIN refunds rf3 ON tk3.ticket_id = rf3.ticket_id
         WHERE bs3.deleted_at IS NULL
         GROUP BY t3.trip_id
      ) refund_stats ON t.trip_id = refund_stats.trip_id

      -- Subquery tính thông tin booking
      LEFT JOIN (
         SELECT 
            t2.trip_id,
            SUM(DISTINCT bt.discount_amount) as total_discount_amount,
            SUM(DISTINCT bt.booking_total_price) as total_trips,
            SUM(DISTINCT bt.booking_total_payment) as total_actual_trips
         FROM trips t2
         LEFT JOIN booking_seats bs2 ON t2.trip_id = bs2.trip_id
         LEFT JOIN tickets tk2 ON bs2.booking_seat_id = tk2.booking_seat_id
         LEFT JOIN booking_ticket_details btd ON tk2.ticket_id = btd.ticket_id
         LEFT JOIN booking_tickets bt ON btd.booking_id = bt.booking_id 
            AND bt.booking_status = 'confirmed' 
            AND bt.payment_status = 'completed'
         WHERE bs2.deleted_at IS NULL
         GROUP BY t2.trip_id
      ) booking_stats ON t.trip_id = booking_stats.trip_id

      WHERE t.trip_departure_time BETWEEN :startDate AND :endDate
      ${routeId ? "AND t.route_id = :routeId" : ""}
      AND t.deleted_at IS NULL
      
      GROUP BY 
         t.trip_id, 
         r.route_name, 
         t.trip_departure_time, 
         t.trip_arrival_time,
         vt.vehicle_type_name,
         refund_stats.total_refunded_tickets,
         refund_stats.total_refunded_amount,
         booking_stats.total_discount_amount,
         booking_stats.total_trips,
         booking_stats.total_actual_trips
      
      ORDER BY t.trip_departure_time DESC
   `;

   return await db.sequelize
      .query(query, {
         replacements: {
            startDate,
            endDate,
            routeId,
         },
         type: QueryTypes.SELECT,
      })
      .then((result) => {
         return {
            data: result,
            total: result.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi lấy báo cáo theo tuyến đường " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      });
};

const getBookingStatusStatsByMonth = async () => {
   try {
      const query = `
        WITH RECURSIVE months AS (
            SELECT 1 as month_number
            UNION ALL
            SELECT month_number + 1
            FROM months
            WHERE month_number < 12
         ),
         statuses AS (
            SELECT 'pending' as status
            UNION ALL SELECT 'confirmed'
            UNION ALL SELECT 'cancelled'
         )
         SELECT 
            DATE_FORMAT(STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-', months.month_number, '-01'), '%Y-%m-%d'), '%Y-%m') as month,
            statuses.status as booking_status,
            COALESCE(stats.total_bookings, 0) as total_bookings
         FROM months
         CROSS JOIN statuses
         LEFT JOIN (
            SELECT 
               DATE_FORMAT(bt.created_at, '%Y-%m') as booking_month,
               bt.booking_status,
               COUNT(*) as total_bookings
            FROM booking_tickets bt
            WHERE 
               YEAR(bt.created_at) = YEAR(CURDATE())
               AND bt.deleted_at IS NULL
            GROUP BY 
               DATE_FORMAT(bt.created_at, '%Y-%m'),
               bt.booking_status
         ) stats ON DATE_FORMAT(STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-', months.month_number, '-01'), '%Y-%m-%d'), '%Y-%m') = stats.booking_month
            AND statuses.status = stats.booking_status
         ORDER BY month ASC, booking_status
      `;

      const result = await db.sequelize.query(query, {
         type: QueryTypes.SELECT,
      });

      return {
         data: result,
         total: result.length,
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy thống kê đơn đặt vé: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

// Thống kê số lượng khách hàng đăng ký tài khoản theo từng tháng trong năm
const getCustomerRegistrationStatsByMonth = async () => {
   try {
      const query = `
         WITH RECURSIVE months AS (
            SELECT 1 as month_number
            UNION ALL
            SELECT month_number + 1
            FROM months
            WHERE month_number < 12
         )
         SELECT 
            DATE_FORMAT(STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-', months.month_number, '-01'), '%Y-%m-%d'), '%Y-%m') as month,
            COALESCE(COUNT(c.customer_id), 0) as total_registrations
         FROM months
         LEFT JOIN customers c ON 
            MONTH(c.created_at) = months.month_number
            AND YEAR(c.created_at) = YEAR(CURDATE())
            AND c.deleted_at IS NULL
         GROUP BY months.month_number
         ORDER BY months.month_number ASC
      `;

      const result = await db.sequelize.query(query, {
         type: QueryTypes.SELECT,
      });

      return result;
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy thống kê đăng ký khách hàng: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

const getCustomerTypeStatsByMonth = async () => {
   try {
      const query = `
         WITH RECURSIVE months AS (
            SELECT 
               DATE_FORMAT(CURDATE() - INTERVAL 11 MONTH, '%Y-%m-01') as first_date
            UNION ALL
            SELECT 
               DATE_ADD(first_date, INTERVAL 1 MONTH)
            FROM months
            WHERE first_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
         )
         SELECT 
            DATE_FORMAT(months.first_date, '%Y-%m') as month,
            COUNT(DISTINCT CASE WHEN bt.customer_id IS NULL THEN bt.booking_id END) as guest_customers,
            COUNT(DISTINCT CASE WHEN bt.customer_id IS NOT NULL THEN bt.booking_id END) as registered_customers
         FROM months
         LEFT JOIN booking_tickets bt ON 
            DATE_FORMAT(bt.created_at, '%Y-%m') = DATE_FORMAT(months.first_date, '%Y-%m')
            AND bt.booking_status = 'confirmed'
            AND bt.payment_status = 'completed'
            AND bt.deleted_at IS NULL
         GROUP BY months.first_date
         ORDER BY months.first_date ASC
      `;

      const result = await db.sequelize.query(query, {
         type: QueryTypes.SELECT,
      });

      return result;
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy thống kê loại khách hàng: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

const getMonthlyRevenueStats = async (year = new Date().getFullYear()) => {
   try {
      const query = `
         WITH RECURSIVE months AS (
            SELECT 1 as month_number
            UNION ALL
            SELECT month_number + 1
            FROM months
            WHERE month_number < 12
         )
         SELECT 
            DATE_FORMAT(STR_TO_DATE(CONCAT(:year, '-', months.month_number, '-01'), '%Y-%m-%d'), '%Y-%m') as month,
            COALESCE(SUM(bt.booking_total_payment), 0) as total_revenue,
            COALESCE(SUM(bt.discount_amount), 0) as total_discount
         FROM months
         LEFT JOIN booking_tickets bt ON 
            MONTH(bt.created_at) = months.month_number
            AND YEAR(bt.created_at) = :year
            AND bt.booking_status = 'confirmed'
            AND bt.payment_status = 'completed'
            AND bt.deleted_at IS NULL
         GROUP BY months.month_number
         ORDER BY months.month_number ASC
      `;

      const result = await db.sequelize.query(query, {
         replacements: {year},
         type: QueryTypes.SELECT,
      });

      return result;
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy thống kê doanh thu theo tháng: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

const getMonthlyRefundStats = async (year = new Date().getFullYear()) => {
   try {
      const query = `
         WITH RECURSIVE months AS (
            SELECT 1 as month_number
            UNION ALL
            SELECT month_number + 1
            FROM months
            WHERE month_number < 12
         )
         SELECT 
            DATE_FORMAT(STR_TO_DATE(CONCAT(:year, '-', months.month_number, '-01'), '%Y-%m-%d'), '%Y-%m') as month,
            COUNT(r.refund_id) as total_refunds,
            COALESCE(SUM(r.refund_amount), 0) as total_refund_amount,
            COUNT(CASE WHEN r.is_refunded = 1 THEN 1 END) as completed_refunds,
            COUNT(CASE WHEN r.is_approved = 1 THEN 1 END) as approved_refunds,
            AVG(r.refund_percentage) as avg_refund_percentage
         FROM months
         LEFT JOIN refunds r ON 
            MONTH(r.created_at) = months.month_number
            AND YEAR(r.created_at) = :year
            AND r.deleted_at IS NULL
         GROUP BY months.month_number
         ORDER BY months.month_number ASC
      `;

      const result = await db.sequelize.query(query, {
         replacements: {year},
         type: QueryTypes.SELECT,
      });

      return result;
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy thống kê vé hoàn theo tháng: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

module.exports = {
   getReportByTrip,
   getBookingStatusStatsByMonth,
   getCustomerRegistrationStatsByMonth,
   getCustomerTypeStatsByMonth,
   getMonthlyRevenueStats,
   getMonthlyRefundStats,
};
