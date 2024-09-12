"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inventory_product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inventory_location: {
      type: String,
      default: "unknown",
    },
    inventory_stock: {
      type: Number,
      required: true,
    },
    inventory_shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inventory_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = {
  Inventory: model(DOCUMENT_NAME, inventorySchema),
};
