"use strict";
const __RESPONSE = require("../../core");
const createContact = require("../../services/contactService");

const __CONTACT_CONTROLLER = {
   createContact: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Create contact successfully !",
         metadata: await createContact(req),
         request: req,
      }).send(res);
   },
};

module.exports = __CONTACT_CONTROLLER;
