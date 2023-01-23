const express = require("express");
const bodyParser = require("body-parser");
const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require("path");
const rootDir = require("./utils/path");
// const expressHbs = require("express-handlebars");

const app = express();

// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use("/", (req, res, next) => {
  res.status(404).render("404");
});

app.listen(3000);
