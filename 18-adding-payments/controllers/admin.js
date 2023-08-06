const cookie = require("../util/cookie");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");

const ITEMS_PER_PAGE = 2;

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
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);

    if (!image) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
        hasError: true,
        product: {
          title: title,
          price: price,
          description: description,
        },
        errorMessage: "Wrong file type",
        validationErrors: [],
      });
    }

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
        hasError: true,
        product: {
          title: title,
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
        imageUrl: image.path,
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
    const page = +req.query.page || 1;
    let totalItems = 0;

    Product.count()
      .then((amount) => {
        totalItems = amount;
        return req.user.getProducts({
          limit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE,
        });
      })
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
          isAuthenticated,
          currentPage: page,
          totalProducts: totalItems,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    const { productId, title, price, description } = req.body;
    const image = req.file;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        hasError: true,
        product: {
          title,
          price,
          description,
          id: productId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    Product.findByPk(productId)
      .then((product) => {
        if (product) {
          if (product.userId?.toString() !== req.user.id.toString()) {
            return res.redirect("/");
          }

          product.title = title;
          if (image) {
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
          }
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
          fileHelper.deleteFile(product.imageUrl);
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
