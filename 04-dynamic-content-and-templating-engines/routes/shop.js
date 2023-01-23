const express = require("express");
const router = express.Router();
const { products } = require("./admin");

router.get("/", (req, res, next) => {
  res.render("shop", {
    pageTitle: "List Products",
    prods: products,
    hasProducts: products.length > 0,
    path: "/",
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
