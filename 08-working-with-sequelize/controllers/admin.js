const Cart = require("../models/cart");
const Product = require("../models/product");

class AdminController {
  getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    });
  };
  postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    req.user
      .createProduct({
        title,
        imageUrl,
        price,
        description,
      })
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => console.error(err));
  };
  getProducts = (req, res, next) => {
    req.user
      .getProducts()
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
      .then((product) => {
        if (!product) {
          return res.redirect("/");
        }
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
          product: product,
        });
      })
      .catch((err) => console.error(err));
  };
  postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;

    Product.findByPk(productId)
      .then((product) => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save();
      })
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => console.error(err))
      .catch((err) => console.error(err));

    // new Product(productId, title, imageUrl, description, price)
    //   .save()
    //   .then(() =>
    //   .catch((err) => console.error(err));
  };
  postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findByPk(productId)
      .then((product) => product.destroy())
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => console.error(err))
      .catch((err) => console.error(err));
  };
}

module.exports = new AdminController();
