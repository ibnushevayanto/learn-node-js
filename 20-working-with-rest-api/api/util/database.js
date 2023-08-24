const Sequelize = require("sequelize");

module.exports = new Sequelize("learn-nodejs-api", "root", "", {
  dialect: "mariadb",
  host: "localhost",
});
