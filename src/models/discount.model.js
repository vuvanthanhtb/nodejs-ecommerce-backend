"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

var discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", // percentage
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    // Ngày bắt đầu
    discount_start_date: {
      type: Date,
      required: true,
    },
    // Ngày kết thúc
    discount_end_date: {
      type: Date,
      required: true,
    },
    // Số lượng discount được áp dụng
    discount_max_uses: {
      type: Number,
      required: true,
    },
    // Số lượng discount đã sử dụng
    discount_uses_count: {
      type: Number,
      default: 0,
    },
    // ai sử dụng
    discount_users_used: {
      type: Array,
      default: [],
    },
    // Số lượng cho phép tối đa được sử dụng mỗi user
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    // Số sản phẩm được áp dụng
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
