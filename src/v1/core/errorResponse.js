"use strict";

const geoip = require("geoip-lite");

const StatusCode = {
   BAD_REQUEST: 400, // Yêu cầu không hợp lệ.
   UNAUTHORIZED: 401, // Cần xác thực để truy cập tài nguyên.
   FORBIDDEN: 403, // Không được phép truy cập tài nguyên.
   NOT_FOUND: 404, // Không tìm thấy tài nguyên.
   REFRESH_TOKEN: 419, // Cần cung cấp mã thông báo mới để truy cập tài nguyên.
   CONFLICT: 409, // Xung đột với tài nguyên hiện tại của máy chủ.
   METHOD_NOT_ALLOWED: 405, // Phương thức không được phép.
   INTERNAL_SERVER_ERROR: 500, // Lỗi xảy ra trên máy chủ.
   NOT_IMPLEMENTED: 501, // Chưa được triển khai.
   BAD_GATEWAY: 502, // Cổng không hợp lệ.
   SERVICE_UNAVAILABLE: 503, // Dịch vụ không khả dụng.
};

const ReasonStatus = {
   BAD_REQUEST: "Bad Request",
   UNAUTHORIZED: "Unauthorized",
   FORBIDDEN: "Forbidden",
   NOT_FOUND: "Not Found",
   CONFLICT: "Conflict",
   INTERNAL_SERVER_ERROR: "Internal Server Error",
   METHOD_NOT_ALLOWED: "Method Not Allowed",
   NOT_IMPLEMENTED: "Not Implemented",
   REFRESH_TOKEN: "Refresh Token",
   BAD_GATEWAY: "Bad Gateway",
   SERVICE_UNAVAILABLE: "Service Unavailable",
};

class ErrorResponse extends Error {
   constructor(message, status, error_code, reason, suggestion, redirectTo, request) {
      super(message || reason);
      this.status = status;
      this.error = true;
      this.error_code = error_code;
      this.reason = reason;
      this.message = message || reason;
      this.timestamp = new Date();
      this.details = request
         ? {
              requestedUrl: request?.originalUrl || "",
              suggestion: suggestion || "",
              requestTime: request?.requestTime || "",
              redirectTo: redirectTo || "",
              browser:
                 {
                    userAgent: request?.headers["user-agent"] || "",
                    ip: request?.ip || "",
                    ipInfo: request?.ipInfo || "",
                    host: request?.hostname || "",
                    origin: request?.headers.origin || "",
                    referer: request?.headers.referer || "",
                    location: request?.headers.location || "",
                    device: request?.device.type || "",
                    browser_details: {
                       name: request?.useragent?.browser || "",
                       version: request?.useragent?.version || "",
                       os: request?.useragent?.os || "",
                       platform: request?.useragent?.platform || "",
                       source: request?.useragent?.source || "",
                    },
                    geo: geoip.lookup(request?.ip),
                 } || "",
           }
         : {};
   }
}

class BadRequestError extends ErrorResponse {
   constructor({message, suggestion, error_code, redirectTo, request}) {
      super(message, StatusCode.BAD_REQUEST, ReasonStatus.BAD_REQUEST, error_code, suggestion, redirectTo, request);
   }
}

class UnauthorizedError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.UNAUTHORIZED, ReasonStatus.UNAUTHORIZED, suggestion, redirectTo, request);
   }
}

class ForbiddenError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.FORBIDDEN, ReasonStatus.FORBIDDEN, suggestion, redirectTo, request);
   }
}

class RefreshToken extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.REFRESH_TOKEN, ReasonStatus.REFRESH_TOKEN, suggestion, redirectTo, request);
   }
}

class NotFoundError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.NOT_FOUND, ReasonStatus.NOT_FOUND, suggestion, redirectTo, request);
   }
}

class ConflictError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.CONFLICT, ReasonStatus.CONFLICT, suggestion, redirectTo, request);
   }
}

class MethodNotAllowedError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.METHOD_NOT_ALLOWED, ReasonStatus.METHOD_NOT_ALLOWED, suggestion, redirectTo, request);
   }
}

class InternalServerError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(
         message,
         StatusCode.INTERNAL_SERVER_ERROR,
         ReasonStatus.INTERNAL_SERVER_ERROR,
         suggestion,
         redirectTo,
         request
      );
   }
}

class NotImplementedError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.NOT_IMPLEMENTED, ReasonStatus.NOT_IMPLEMENTED, {suggestion, redirectTo, request});
   }
}

class BadGatewayError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.BAD_GATEWAY, ReasonStatus.BAD_GATEWAY, {suggestion, redirectTo, request});
   }
}

class ServiceUnavailableError extends ErrorResponse {
   constructor({message, suggestion, redirectTo, request}) {
      super(message, StatusCode.SERVICE_UNAVAILABLE, ReasonStatus.SERVICE_UNAVAILABLE, {
         suggestion,
         redirectTo,
         request,
      });
   }
}

module.exports = {
   ErrorResponse,
   NotFoundError,
   InternalServerError,
   BadRequestError,
   UnauthorizedError,
   RefreshToken,
   ForbiddenError,
   ConflictError,
   MethodNotAllowedError,
   NotImplementedError,
   BadGatewayError,
   ServiceUnavailableError,
};
