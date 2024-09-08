"use strict";

const { findByKey } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    // check objKey
    const objKey = await findByKey(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    req["objKey"] = objKey;
    return next();
  } catch (error) {}
};

const permission = (permiss) => {
  return (req, res, next) => {
    const objKey = req["objKey"];
    if (!objKey.permissions) {
      return res.status(403).json({ message: "Permission Denied" });
    }

    if (!objKey.permissions.includes(permiss)) {
      return res.status(403).json({ message: "Permission Denied" });
    }

    console.log(`Permissons::${objKey.permissions}`);

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
