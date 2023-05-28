const Product = require("../models/product");
const Cart = require("../models/cart");

class ShopController {
  getProducts = (req, res, next) => {
    Product.findAll()
      .then((products) => {
        res.render("shop/product-list", {
          prods: products,
          pageTitle: "All Products",
          path: "/products",
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findByPk(id)
      .then((product) => {
        res.render("shop/product-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products",
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  getIndex = (req, res, next) => {
    Product.findAll({ limit: 3 })
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "/",
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  getCart = (req, res, next) => {
    req.user
      .getCart()
      .then((cart) => {
        return cart.getProducts();
      })
      .then((products) => {
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
        if (products.length) {
          newQuantity += +products[0].cartItem.quantity;
          return products[0];
        } else {
          return Product.findByPk(prodId);
        }
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });

    Product.findByPk(prodId)
      .then((product) => {
        if (product.length) {
          Cart.addProduct(product.id, product.price, ({ status }) => {
            if (status) {
              res.redirect("/cart");
            }
          });
        }
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  postDeleteCart = (req, res, next) => {
    const { productId } = req.body;

    req.user
      .getCart()
      .then((cart) => cart.getProducts({ where: { id: productId } }))
      .then((products) => {
        if (products.length) {
          return products[0].cartItem.destroy();
        }
        return false;
      })
      .then((status) => {
        if (status) {
          res.redirect("/cart");
        }
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
  getOrders = (req, res, next) => {
    req.user.getOrders({ include: ["products"] }).then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    });
  };
  postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then((products) =>
        req.user
          .createOrder()
          .then((order) =>
            order.addProducts(
              products.map((product) => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
            )
          )
          .then(() => fetchedCart.setProducts(null))
          .then(() => res.redirect("/orders"))
          .catch((err) => {
            const error = new Error(err);
            err.httpStatusCode = 500;
            next(error);
          })
      )
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
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
