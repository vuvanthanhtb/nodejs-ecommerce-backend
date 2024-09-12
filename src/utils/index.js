"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefined = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") {
      removeUndefined(obj[key]);
    } else if (obj[key] === null) {
      delete obj[key];
    } else {
      obj[key];
    }
  });
  return obj;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
};
