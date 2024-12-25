"use strict";
const moment = require("moment");
const {GoogleSpreadsheet} = require("google-spreadsheet");
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");

const PRIVATE_KEY =
   "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQChQ9w4YXCaVrtJ\n2Ws2T7mX6fjmcrV4gW1aHRuT91dqm+939F2gsAeGQb78c7mG8xPq9udmSqq4Qo/9\nsebz94+3SarGQu9d4AwxcZHblEcvD9WKGhdWmQ6OordrSI6bNwrusnFczX48krAf\nHd4wRFGq8vF6binI217XQnw31uX585wnpz4yhoDRH0KNKyQiG+kmmyhY+KeIR6K2\nQWdujKIyijaQOS4qaTkCB1y5erxAQGm4qt5qhe/NX0Cth7klLENAr9UCidkz1vhb\nkKDyHOkIlz43bulyAWLp/qesaY5JK3q8ROiSwFXS1BFGHzOgn1Pa+Wa+Wv+ucfpy\n08swf8CPAgMBAAECggEAKG66trobgN7RC2WDP3VCu6dye9jzzdhpgef9Y55moPii\n1EkE9oZcBJnUWDhtojus2UL5Zoi+//7UWk+x76Y4tsQ2GIpsuHU1qWnnn42wQUjv\nibYb9t7eKv36DeB9vMXSrGE6EgIFrgs7NDoJXMGsVjeeOsuHF3CE+WSWf2uWcpHv\nK5N6ARt7ORpsydZpiEK0W1t8kO0kI9drrbd6qhDHCsncwD7jJjkv+SVa/sfPbCib\nDRTzxhR8BwwOf7f2PVkOQDQl4guqvu2D02XD7AZ2r17YrOnJa5L8Y2QEhVHYjP17\nZGO1cJccj0akjyv0gr7L85RUIcVy39SRzLpIOagVAQKBgQDU+XWZATR3TJ30l276\nUoS85THRWLVatOzBvEC9S4UoUXC5zRDnlqvbtMzUWzmZaj8KawjFATPI+YQIZ576\nXc7z67++wdwNXacZXVGzyJRnQwPXpm0WBH74PBhjAQhkvnEux4wNbjtJgs8HeEm+\nK6YTEfxq8qvKbbDY9gp3uvQNjwKBgQDB2BzyO85P9eKQNYQF/3qu7i29ioHeH5YO\n+VCLU7eSwGAoJ4U8ASTRu3tjqvL+BXQLWzAGpx1Bp9GRQMS3r2PsB5nj4UpkcorI\ngUlOLl1g8JtWfeYooNSzwiechtLTsxg0unmutkylkri5GniFtB0pWOERqw0a+yMG\nT8RpS5WdAQKBgHgEbGTg7PQd1RW1EPE3912Lu1tCJlELjDBRKhqCqHNkEaZjDZe0\nrPyPEq7JCdiOqx/v2W1LlCc5lVI3MrvciXej7tZM4PkXQcdlc1lhO2BFv7CTNP4n\nYnX5R7TjLBu5xoaaJS6cZAS1Fn4bJ1NnvZsZk6mhP3ZAAl0Bqjx2unm5AoGAf175\nDjY8B5CC8c0oViScQYuhpJT5ZrIMkQRDZ3l3+0bLKDdntZjuz51Io6H1jvKYYMnn\nUcfHUpfp/W64lBX8K2CHPxSPJFebV8qUF3ohw4v2Fiwd6v5bJU7jZle0+oQI2MTb\nJfEFhhpVpNN+9CP4sW2EXm6t6tewGPqbDbEruwECgYAvlYxkOYQOM+QTQrVpMg2u\nHH5CoQhfKZTZuTHQvWpKc0uz2NkyOQCvQsBm7gOVo5NMUTz6eo9BUlvctd98Zhd2\n7t64cWngqxB/0Y2LVK61KLkOf9w9XWAlEJlaJSqj/rNcnL8Wnz0HVT54nuSxAo8o\nx3sWBduhllqbYcgKPL42Fw==\n-----END PRIVATE KEY-----\n";
const CLIENT_EMAIL = "bookingtickets@doantlweb.iam.gserviceaccount.com";
const SHEET_ID = "1XeRO8QlgYrTpaZDhBKRsz9i1B0epZG7IdAEs4pRhy3I";

const createContact = async (req) => {
   try {
      let currentDate = new Date();
      const format = "HH:mm DD/MM/YYYY";
      let formatedDate = moment(currentDate).format(format);
      const doc = new GoogleSpreadsheet(SHEET_ID);
      await doc.useServiceAccountAuth({
         client_email: CLIENT_EMAIL,
         private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      await sheet.addRow({
         busLine: req.body.busLine.toString() == 1 ? "FuTA Bus Lines Option 1" : "FuTA Bus Lines Option 2",
         name: req.body.name.toString() || "",
         phone: req.body.phone.toString() || "",
         email: req.body.email.toString() || "",
         title: req.body.title.toString() || "",
         notes: req.body.notes.toString() || "",
         timestamp: formatedDate,
      });
      if (sheet.rowCount > 0) {
         return {
            message: "Writing data to Google Sheet succeeds!",
            success: true,
         };
      }
      throw new __RESPONSE.BadRequestError({
         message: "Oops! Something wrongs, check logs console for detail ... ",
      });
   } catch (e) {
      throw new __RESPONSE.BadRequestError({
         message: "Oops! Something wrongs, check logs console for detail ... " + e.message,
      });
   }
};

module.exports = createContact;
