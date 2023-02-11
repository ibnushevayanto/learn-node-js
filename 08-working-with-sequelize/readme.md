
# 🦧 Conclusion of section 8

Sequelize is an Object Relational Mapping (ORM) library. To install sequelize in node project, we should install package 'sequelize' before.
```
npm install --save sequelize
```

## Sequelize Configuration
in the util/database.js we can create configuration for sequelize like this. for new connection.
```
const Sequelize = require("sequelize");

const sequelize = new Sequelize("learn-nodejs", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
```
## Sequelize Model Definition
in the model/product.js, we should definition the table with sequelize. like example code below this.
```
const Sequlize = require("sequelize");
const sequelize = require("../util/database");

// You can read more properties documentation to use in column definiiton below this.
// https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
const Product = sequelize.define("product", {
  id: {
    type: Sequlize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequlize.STRING,
  price: {
    type: Sequlize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequlize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequlize.STRING,
    allowNull: false,
  },
});

module.exports = Product;

```

## Sequelize auto create column
we can define a colum in database with sequelize, the sequlize can syncron with our model.
```
const sequelize = require("./util/database");

...

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.error(err));
```

## Sequelize Model Funtionality
What is model functionality, model functionality is like this code below.
```
Product.create({
      title,
      imageUrl,
      price,
      description,
    })
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => console.error(err));
```

Code above is about, the "create" functionality is about to insert data. and many functionality you can read in this [link](https://sequelize.org/api/v6/class/src/model.js~model) 

## Sequelize create relational tables One To Many

First you need two models sequelize, and then import it with "require" function. and follow code below.
```
const Product = require("./models/product");
const User = require("./models/user");

...

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
```
The result is, product table will add new column called "userId" 

## Middleware Explanation
app use execute after app.listen running, and then we can use middleware on the top of app.use, example in app.js this project 

```
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error(err));
});
```

## Create elegant way for belongsTo models only 
you can use special function when you use belongsTo model. in this example code, i want to add product, when product models belongs to user model. 
```
req.user
      .createProduct({
        title,
        imageUrl,
        price,
        description,
      })
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((err) => console.error(err));
```
check ``middleware explanation`` for know ``req.user`` come from \
you can learn about 'createProduct' in [here](https://sequelize.org/docs/v6/core-concepts/assocs/#note-method-names)

## Sequelize create relational tables many to many 

you need at least 3 table, 2 main table and 1 relational table, in this example cartItem table will become relational table, which is later in the table cartItem have column productId and cartId
```
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Product = require("./models/product");

...

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
```

## Sequilize many to many add data 
this is example code for add data / edit data with many to many, this code exist in the shop.js controller on the function postCart
```
product.addCart(fetchedCart, { // "fetchedCart" is model cart and "product" is the model product
  through: { quantity: newQuantity }, // property "quantity" according to column you need to fill in the table relational
});
```
you can use this method for add many data in one line of code, this code available in shop.js controll on the postOrder function
```
order.addProducts(
  products.map((product) => {
  product.orderItem = { quantity: product.cartItem.quantity };
  return product;
  })
)
```

## Get the response of associate table
```
req.user.getOrders({ include: ['products'] }).then(orders => {
  res.render("shop/orders", {
  path: "/orders",
  pageTitle: "Your Orders",
  orders
  });
})
```