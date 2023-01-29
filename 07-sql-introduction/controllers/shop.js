const Product = require("../models/product");
const Cart = require("../models/cart");

class ShopController {
  getProducts = (req, res, next) => {
    Product.fetchAll()
      .then(([products, _]) => {
        res.render("shop/product-list", {
          prods: products,
          pageTitle: "All Products",
          path: "/products",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
      .then(([product]) => {
        res.render("shop/product-detail", {
          product: product[0],
          pageTitle: product[0].title,
          path: "/products",
        });
      })
      .catch((err) => console.error(err));
  };
  getIndex = (req, res, next) => {
    Product.fetchAll()
      .then(([products, _]) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "/",
        });
      })
      .catch((err) => console.error(err));
  };
  getCart = (req, res, next) => {
    Cart.getCart((cart) => {
      Product.fetchAll()
        .then(([itemsProduct, _]) => {
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
        })
        .catch((err) => console.error(err));
    });
  };
  postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(([product]) => {
        if (product.length) {
          Cart.addProduct(product[0].id, product[0].price, ({ status }) => {
            if (status) {
              res.redirect("/cart");
            }
          });
        }
      })
      .catch((err) => console.error(err));
  };
  postDeleteCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId)
      .then(([product]) => {
        Cart.deleteProduct(productId, product[0].price, ({ status }) => {
          if (status) {
            res.redirect("/cart");
          }
        });
      })
      .catch((err) => console.error(err));
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
