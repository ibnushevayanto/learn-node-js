const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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

app.use((req, res, next) => {
  console.log(req?.session, "ada session bro");
  if (req?.session?.user?.id) {
    User.findByPk(req?.session?.user?.id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.error(err));
  } else {
    next();
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

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
    app.listen(3000);
  })
  .catch((err) => console.error(err));
