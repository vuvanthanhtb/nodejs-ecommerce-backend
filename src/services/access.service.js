"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.reponse");

const RolesShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // 1. check email exists?
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Error: Email already exists");
    }
    // 2. hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 3. create shop in database
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [RolesShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey });

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: Error generating token");
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      console.log(`publicKeyObject::${publicKeyObject}`);

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );
      console.log(`Created Token Success::${tokens}`);

      return {
        code: "2001",
        metadata: {
          shop: getInfoData({
            fields: ["_id", "email", "name"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: "2000",
      metadata: null,
    };
  };
}

module.exports = AccessService;
