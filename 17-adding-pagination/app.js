const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images"); // ! First parameter is error handler whichh is function for handling an error 
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(
  multer({
    storage: fileStorage,
    fileFilter(req, file, cb) {
      if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }).single("foto")
);

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (req?.session?.user?.id) {
    User.findByPk(req?.session?.user?.id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  } else {
    next();
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get505);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true }) // * Overwrite the table, can remove all data in the table
  .sync()
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => console.error(err));
