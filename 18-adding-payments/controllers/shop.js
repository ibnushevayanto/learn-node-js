const Product = require("../models/product");
const Cart = require("../models/cart");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
  "SECRET_KEY_OF_STRIPE"
);

const ITEMS_PER_PAGE = 2;

class ShopController {
  getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems = 0;

    Product.count()
      .then((amount) => {
        totalItems = amount;

        return Product.findAll({
          limit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE,
        });
      })
      .then((products) => {
        res.render("shop/product-list", {
          prods: products,
          pageTitle: "All Products",
          path: "/products",
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
    const page = +req.query.page || 1;
    let totalItems = 0;

    Product.count()
      .then((amount) => {
        totalItems = amount;
        return Product.findAll({
          limit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE,
        });
      })
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          currentPage: page,
          totalProducts: totalItems,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
  getCheckoutSuccess = (req, res, next) => {
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
  getInvoices = (req, res, next) => {
    const fileName = `invoice-${req.params.orderId}.pdf`;
    const filePath = path.join("data", "invoices", fileName);

    req.user
      .getOrders({ where: { id: req.params.orderId }, include: ["products"] })
      .then((orders) => {
        if (orders.length === 0) {
          return next(new Error("No order found."));
        } else if (!req.user.id.toString() === orders[0].id.toString()) {
          return next(new Error("Unauthorized."));
        }

        const pdfDoc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=${fileName}`);
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text("Invoice", { underline: true });
        pdfDoc.text("-----------------------------------------");

        let totalPrice = 0;
        for (const product of orders[0].products) {
          const price = +product.price * +product.orderItem.quantity;
          pdfDoc
            .fontSize(14)
            .text(
              `${product.title} - ${product.orderItem.quantity} x $${product.price} = $${price}`
            );
          totalPrice += price;
        }

        pdfDoc.text("-----------------------------------------");
        pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);

        pdfDoc.end();
        // ! Cara Dibawah ini tidak recommended jika file yang dibuka ukurannya besar
        // fs.readFile(filePath, (err, data) => {
        //   if (err) {
        //     return next(err);
        //   }

        //   res.setHeader("Content-Type", "application/pdf");
        //   res.setHeader(
        //     "Content-Disposition",
        //     // `inline; filename=${fileName}` // ! Jika Ingin File Terbuka
        //     `attachment; filename=${fileName}` // ! Jika Ingin File Terdownload
        //   );
        //   res.send(data);
        // });

        // ? Cara yang di rekomendasikan untuk mendownload file
        // const file = fs.createReadStream(filePath);
        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader(
        //   "Content-Disposition",
        //   // `inline; filename=${fileName}` // ! Jika Ingin File Terbuka
        //   `attachment; filename=${fileName}` // ! Jika Ingin File Terdownload
        // );
        // file.pipe(res);
      })
      .catch((err) => console.error(err));
  };
  getCheckout = (req, res, next) => {
    let total = 0;
    let productsList = [];
    req.user
      .getCart()
      .then((cart) => {
        return cart.getProducts();
      })
      .then((products) => {
        productsList = products;
        for (const p of products) {
          total += +p.cartItem.quantity * +p.price;
        }

        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: products.map((p) => ({
            price_data: {
              product_data: {
                name: p.title,
                description: p.description,
              },
              unit_amount: p.price * 100,

              currency: "usd",
            },
            quantity: p.cartItem.quantity,
          })),
          success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
          cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
        });
      })
      .then((session) => {
        res.render("shop/checkout", {
          path: "/checkout",
          pageTitle: "Checkout",
          products: productsList,
          totalSum: total,
          sessionId: session.id,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        err.httpStatusCode = 500;
        next(error);
      });
  };
}

module.exports = new ShopController();
