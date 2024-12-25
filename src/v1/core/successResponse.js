"use strict";
const geoip = require("geoip-lite");

const StatusCode = {
   OK: 200, // OK
   SUCCESS: 200, // OK
   GET: 200, // OK
   UPDATE: 200, // OK
   DELETE: 200, // OK
   CREATED: 201, // Created
   ACCEPTED: 202, // Accepted
   NO_CONTENT: 204, // No Content
   RESET_CONTENT: 205, // Reset Content
};

const ReasonStatusCode = {
   OK: "OK",
   SUCCESS: "Success",
   CREATED: "Created",
   ACCEPTED: "Accepted",
   NO_CONTENT: "No Content",
   RESET_CONTENT: "Reset Content",
   DELETE: "Deleted",
   UPDATE: "Updated",
   GET: "Data Fetched",
};

class SuccessResponse {
   constructor({
      statusCode = StatusCode.OK,
      reasonStatusCode = ReasonStatusCode.OK,
      message,
      metadata,
      suggestion,
      redirectTo,
      request,
   }) {
      this.status = statusCode || StatusCode.OK;
      this.reason = reasonStatusCode || ReasonStatusCode.OK;
      this.message = message || reasonStatusCode;
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
      this.metadata = metadata || {};
      this.success = true;
      this.responeTime = new Date();
   }
   send(res, headers = {}) {
      return res.status(this.status).json(this);
   }
}

class OK extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.OK,
         reasonStatusCode: ReasonStatusCode.OK,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class SUCCESS extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.SUCCESS,
         reasonStatusCode: ReasonStatusCode.SUCCESS,
      });
   }
}

class CREATED extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.CREATED,
         reasonStatusCode: ReasonStatusCode.CREATED,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class ACCEPTED extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.ACCEPTED,
         reasonStatusCode: ReasonStatusCode.ACCEPTED,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class NO_CONTENT extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.NO_CONTENT,
         reasonStatusCode: ReasonStatusCode.NO_CONTENT,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class RESET_CONTENT extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.RESET_CONTENT,
         reasonStatusCode: ReasonStatusCode.RESET_CONTENT,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class UPDATE extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.UPDATE,
         reasonStatusCode: ReasonStatusCode.UPDATE,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class DELETE extends SuccessResponse {
   constructor({message, metadata, suggestion, redirectTo, request}) {
      super({
         statusCode: StatusCode.DELETE,
         reasonStatusCode: ReasonStatusCode.DELETE,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

class GET extends SuccessResponse {
   constructor({
      statusCode = StatusCode.GET,
      reasonStatusCode = ReasonStatusCode.GET,
      message,
      metadata,
      suggestion,
      redirectTo,
      request,
   }) {
      super({
         statusCode,
         reasonStatusCode,
         message,
         metadata,
         suggestion,
         redirectTo,
         request,
      });
   }
}

module.exports = {
   OK,
   CREATED,
   SUCCESS,
   ACCEPTED,
   NO_CONTENT,
   RESET_CONTENT,
   UPDATE,
   DELETE,
   GET,
};
