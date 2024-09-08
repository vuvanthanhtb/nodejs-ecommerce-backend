"use strict";

const { BadRequestError } = require("../core/error.reponse");
const { product, clothing, electronics } = require("../models/product.model");

// define Factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronics":
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type::${type}`);
    }
  }
}

// define base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct() {
    return await product.create(this);
  }
}

// define sub-class for different products type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("create new clothing error");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("create new product error");
    }
    return newProduct;
  }
}

// define sub-class for different products type Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create(this.product_attributes);
    if (!newElectronics) {
      throw new BadRequestError("create new electronics error");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("create new product error");
    }
    return newProduct;
  }
}

module.exports = ProductFactory;
