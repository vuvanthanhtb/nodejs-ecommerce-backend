"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Clothing", "Electronics", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_rating_average: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variation: {
      type: Array,
      default: [],
    },
    is_draft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    is_published: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before save to database
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define the product type = Clothing
const clothingSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

// define the product type = Electronics
const electronicsSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

// define the product type = Furniture
const furnitureSchema = new Schema(
  {
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collection: "furniture",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronics: model("Electronics", electronicsSchema),
  furniture: model("Furniture", furnitureSchema),
};
