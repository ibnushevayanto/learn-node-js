const Sequelize = require("sequelize");

const sequelize = new Sequelize("learn-nodejs", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
