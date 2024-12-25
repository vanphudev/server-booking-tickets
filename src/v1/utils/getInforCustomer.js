"use strict";
const _ = require("lodash");

const getInfoCustomer = ({fileds = [], object = {}}) => {
   return _.pick(object, fileds);
};

module.exports = getInfoCustomer;
