const Product = require("../models/product");

class ShopController {
  getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    });
  };
  getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    });
  };
  getCart = (req, res, next) => {
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
    });
  };
  getOrders = (req, res, next) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
    });
  };
  getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
    });
  };
}

module.exports = new ShopController();
