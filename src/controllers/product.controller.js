"use strict";

const { SuccessResponse } = require("../core/success.response");
const { param } = require("../routes");
const ProductService = require("../services/product.service.v2");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Publish product by shop
   * @method POST
   * @param {String} product_id
   * @return {JSON}
   */
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product published successfully",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Unpublish product by shop
   * @method POST
   * @param {String} product_id
   * @return {JSON}
   */
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product unpublished successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all drafts for shop
   * @method GET
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts for shop successfully",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all publish for shop
   * @method GET
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish for shop successfully",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get list search products
   * @method GET
   * @param {String} keySearch
   * @return {JSON}
   */
  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search products successfully",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
