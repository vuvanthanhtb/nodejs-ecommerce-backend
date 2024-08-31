'use strict'

const { default: mongoose } = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

const connectStr = "";

class Database {
  constructor(parameters) {
    this.connect()
  }

  connect() {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }
    mongoose.connect(connectStr)
              .then(() => {
                console.log("Connected to database, count connect::", countConnect);
              })
              .catch(err => console.log(err))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
