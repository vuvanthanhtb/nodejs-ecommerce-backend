"use strict";

const { BadRequestError } = require("../core/error.reponse");
const {
  product,
  clothing,
  electronics,
  furnitures,
} = require("../models/product.model");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
} = require("../models/repositories/product.repo");

// define Factory class to create product
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid product type::${type}`);
    }

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid product type::${type}`);
    }

    return new productClass(payload).createProduct();
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // Query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_draft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_published: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts(keySearch) {
    return await searchProductsByUser(keySearch);
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { is_published: true },
    select = ["product_name", "product_price", "product_thumb"],
  }) {
    return await findAllProducts({ limit, sort, page, filter, select });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v", "product_variation"] });
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
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for different products type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("create new clothing error");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("create new product error");
    }
    return newProduct;
  }
}

// define sub-class for different products type Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("create new electronics error");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("create new product error");
    }
    return newProduct;
  }
}

// define sub-class for different products type Furniture
class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furnitures.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("create new furniture error");
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("create new product error");
    }
    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furnitures", Furnitures);

module.exports = ProductFactory;
