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
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect("/");
  };
  getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    });
  };
  getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        product,
      });
    });
  };
  postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body;
    new Product(productId, title, imageUrl, description, price).save();
    res.redirect("/admin/products");
  };
  postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
      Cart.deleteProduct(productId, product.price, ({ status }) => {
        if (status) {
          Product.delete(productId);
          res.redirect("/admin/products");
        }
      });
    });
  };
}

module.exports = new AdminController();
