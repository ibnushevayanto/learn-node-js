
# 🦧 Conclusion of section 6


## Dynamic Routes Params
First, register the routes with dynamic parameter like this
```
const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

router.get("/products/:id", shopController.getDetailProduct); // This

module.exports = router
```
The ":id" is variable for dynamic value. \
\
And in the controller "getDetailProduct" you can access the ":id".
```
getDetailProduct = (req, res, next) => {
  console.log(req.params.id);
  res.redirect("/");
};
```

## Dynamic Routes Query
Get the query of url, example url
```
www.test.com/test?id=10
```
How to fetch the "id=10", to fetch it follow this example code
```
getEditProduct = (req, res, next) => {
  console.log(req.query.id)
}
```
