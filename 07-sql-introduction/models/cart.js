const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

class Cart {
  static addProduct(id, productPrice, cb) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const indexExistingProduct = cart.products.findIndex(
        (res) => +res.id === +id
      );

      if (indexExistingProduct >= 0) {
        cart.products[indexExistingProduct].qty += 1;
      } else {
        cart.products.push({ id, qty: 1 });
      }
      cart.totalPrice += +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          cb({ status: false, message: "Gagal menyimpan data" });
        } else {
          cb({ status: true, message: "Berhasil menyimpan data" });
        }
      });
    });
  }
  static deleteProduct(id, productPrice, cb) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const indexProduct = cart.products.findIndex((res) => +res.id === +id);
      if (indexProduct >= 0) {
        cart.totalPrice =
          cart.totalPrice - +productPrice * cart.products[indexProduct].qty;
        cart.products.splice(indexProduct, 1);
      }
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          cb({ status: false });
        } else {
          cb({ status: true });
        }
      });
    });
  }
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      cb(cart);
    });
  }
}

module.exports = Cart;
