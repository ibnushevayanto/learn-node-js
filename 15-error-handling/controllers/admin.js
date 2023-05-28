const cookie = require("../util/cookie");
const Product = require("../models/product");
const { validationResult } = require("express-validator");

class AdminController {
  getAddProduct = (req, res, next) => {
    const isAuthenticated = req.session.isLoggedIn;

    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      formsCSS: true,
      productCSS: true,
      editing: false,
      activeAddProduct: true,
      isAuthenticated,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  };
  postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
        hasError: true,
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description,
        },
        errorMessage: errors.array().length
          ? `${errors.array()[0].msg}`
          : undefined,
        validationErrors: errors.array(),
      });
    }

    req.user
      .createProduct({
        title,
        imageUrl,
        price,
        description,
      })
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  getProducts = (req, res, next) => {
    const isAuthenticated = req.session.isLoggedIn;

    req.user
      .getProducts()
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
          isAuthenticated,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    const isAuthenticated = req.session.isLoggedIn;

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
          isAuthenticated,
          hasError: false,
          errorMessage: null,
          validationErrors: [],
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        hasError: true,
        product: {
          title,
          imageUrl,
          price,
          description,
          id: productId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    console.log(title, imageUrl, price, productId, description, "the input");

    Product.findByPk(productId)
      .then((product) => {
        if (product) {
          if (product.userId?.toString() !== req.user.id.toString()) {
            return res.redirect("/");
          }

          product.title = title;
          product.imageUrl = imageUrl;
          product.price = price;
          product.description = description;
          return product.save();
        } else {
          res.redirect("/");
        }
      })
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findOne({ where: { id: productId, userId: req.user.id } })
      .then((product) => {
        if (product) {
          product.destroy();
        } else {
          res.redirect("/admin/products");
        }
      })
      .then((response) => res.redirect("/admin/products"))
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
}

module.exports = new AdminController();
