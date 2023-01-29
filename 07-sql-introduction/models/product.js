const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    if (this.id) {
      return db.execute(
        "UPDATE products SET title = ?, price = ?, imageurl = ?, description = ? WHERE id = ?",
        [this.title, this.price, this.imageUrl, this.description, this.id]
      );
    } else {
      return db.execute(
        "INSERT INTO products (title, price, imageurl, description) VALUES (?, ?, ?, ?)",
        [this.title, this.price, this.imageUrl, this.description]
      );
    }
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static delete(id) {
    return db.execute("DELETE FROM products WHERE id = ?", [id]);
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }
};
