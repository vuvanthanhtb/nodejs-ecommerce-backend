"use strict";

const ObjectId = require("mongoose").Types.ObjectId;
const { getSelectData, unGetSelectData } = require("../../utils");
const { product } = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  return await product
    .find(
      {
        is_draft: false,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    _id: new ObjectId(product_id),
    product_shop: new ObjectId(product_shop),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.is_draft = false;
  foundShop.is_published = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    _id: new ObjectId(product_id),
    product_shop: new ObjectId(product_shop),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.is_draft = true;
  foundShop.is_published = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
};
