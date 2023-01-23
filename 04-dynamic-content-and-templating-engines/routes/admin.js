const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../utils/path");
const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

module.exports = {
  routes: router,
  products,
};
