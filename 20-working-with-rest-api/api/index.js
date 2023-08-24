const express = require("express");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error?.statusCode || 500;
  const message = error?.message || "Failed to process api";
  res.status(status).json({ message });
});

const sequelize = require("./util/database");
const Post = require("./models/post");
const User = require("./models/user");

Post.belongsTo(User, { constraints: true });
User.hasMany(Post);

sequelize
  .sync()
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.error(err));
