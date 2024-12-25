"use strict";
const _ = require("lodash");

const getInfoEmployee = ({fileds = [], object = {}}) => {
   return _.pick(object, fileds);
};

module.exports = getInfoEmployee;
