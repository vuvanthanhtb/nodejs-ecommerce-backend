'use strict'

const { default: mongoose } = require('mongoose');
const { db: { username, password }, app: { appName } } = require('../configs/config.mongodb');
// const { countConnect } = require('../helpers/check.connect');

const connectStr = `mongodb+srv://${username}:${password}@cluster0.h2bqi.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;

class Database {
  constructor() {
    this.connect()
  }

  connect() {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose.connect(connectStr)
      .then(() => {
        console.log("Connected to database");
        // countConnect();
      })
      .catch(err => console.log({ err }))
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
