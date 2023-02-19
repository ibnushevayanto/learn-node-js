const Sequelize = require("sequelize");

const sequelize = new Sequelize("learn-nodejs", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  storage: "./session.mysql",
});

module.exports = sequelize;
