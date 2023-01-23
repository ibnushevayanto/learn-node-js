
# 🦧 Conclusion of section 3

| Name| Example Code / The Code | Description |
| -   | - | - |
| Install express.js | npm install express --save | |
| Get file location | path.join(__dirname, "..", "views", "add-product.html")  | get file location dynamically cross system operation | 

## Simple Express Setup
App.js
```
const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  console.log("this always runs!");
  next(); // * Allows the request continue to the next middleware in line
});

app.get("/add-product", (req, res, next) => {
  res.send(`
    <form action="/product" method="POST">
        <input type="text" name="title">
        <button>Add</button>
    </form>
    `);
});

app.post("/product", (req, res, next) => {
  res.redirect("/");
});

app.get("/", (req, res, next) => {
  res.send("<h1>Hello from express</h1>");
});

app.listen(3000);

```
``Note: always put root path at bottom, if the code returns a response ``
## How To Get Request Body
First, you must install package ``body-parser``
```
npm i --save body-parser
```
Add ``body-parser`` package in express.js project
```
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
```
And this is example code for getting request body 
```
app.post("/product", (req, res, next) => {
  console.log(req.body); // * Show the request body
  res.redirect("/");
});
```
## Splitting Routes Expressjs
Setup Splitting Express, [Learn from this video](https://www.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11566296) \
if you want add extended routes add code like this 
```
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);
```
``access at http://localhost:3000/admin/add-product``

## Add 404 Not Found Pages

Make sure you set the method of root route is GET, like this
```
router.get("/", (req, res, next) => {
  res.send("<h1>Hello from express</h1>");
});
```
Next, you add code for 404 Pages at the bottom, like this.
```
app.use("/", (req, res, next) => {
  res.status(404).send("<h1>Page not found</h1>"); // * which mean if status 404, send a response like this
});
```
## How to serve html files

make utils to get rootPath of your file.  \
``utils/path.js``
```
const path = require("path");
module.exports = path.dirname(require.main.filename);
```
get root path from path.js, and get the html file. \
``routes/shop.js``
```
...

const path = require("path");
const rootDir = require("../utils/path");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

...
```

## Serve Static File 

we cant access resources file, because resource file not register as route. then we should register resource file to static file in express \
this is code you should write for that. \
``app.js``
```
const express = require("express");
const path = require("path");
const rootDir = require("./utils/path");

...

app.use(express.static(path.join(rootDir, "public")));

...
```
