const Product = require("../models/product");
const Cart = require("../models/cart");

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
  getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id, (product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
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
    Cart.getCart((cart) => {
      Product.fetchAll((itemsProduct) => {
        const mapCartProducts = cart.products.map((res) => res.id);
        const products = itemsProduct
          .filter((res) => mapCartProducts.includes(res.id))
          .map((res) => ({
            productData: res,
            qty:
              cart.products.find((cartProduct) => cartProduct.id === res.id)
                ?.qty || 0,
          }));

        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products,
        });
      });
    });
  };
  postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
      if (product) {
        Cart.addProduct(product.id, product.price, ({ status }) => {
          if (status) {
            res.redirect("/cart");
          }
        });
      }
    });
  };
  postDeleteCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
      Cart.deleteProduct(productId, product.price, ({ status }) => {
        if (status) {
          res.redirect("/cart");
        }
      });
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
