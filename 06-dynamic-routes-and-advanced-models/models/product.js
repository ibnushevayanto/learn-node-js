const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const indexItemProduct = products.findIndex(
          (res) => res.id === this.id
        );
        if (indexItemProduct >= 0) {
          products[indexItemProduct] = this;
        }
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }

      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static delete(id, cb = () => {}) {
    getProductsFromFile((products) => {
      const inisiateNewProducts = products.filter((res) => res.id !== id);
      fs.writeFile(p, JSON.stringify(inisiateNewProducts), (err) => {
        if (err) {
          cb({ status: false });
        } else {
          cb({ status: true });
        }
      });
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const itemProduct = products.find((res) => res.id === id);
      cb(itemProduct);
    });
  }
};
