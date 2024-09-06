"use strict";

const dev = {
  app: {
    appName: process.env.DEV_APP_NAME,
  },
  db: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
  },
};

const prod = {
  app: {
    appName: process.env.PROD_APP_NAME,
  },
  db: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
  },
};

const config = {
  dev,
  prod,
};

const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
