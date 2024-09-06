"use strict";

const apiKeyModel = require("../models/apiKey.model");
const crypto = require("node:crypto");

const findByKey = async (key) => {
  // const newKey = await apiKeyModel.create({
  //   key: crypto.randomBytes(64).toString("HEX"),
  //   permissions: ['0000'],
  // });

  // console.log(newKey);
  
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findByKey,
};
