"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RolesShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // 1. check email exists?
      const hodelShop = await shopModel.findOne({ email }).lean();
      if (hodelShop) {
        return {
          code: "xxxx",
          message: "Email already exists",
          status: "error",
        };
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
          return {
            code: "xxxx",
            message: "Error generating token",
            status: "error",
          };
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
    } catch (error) {
      return {
        code: "xxxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
