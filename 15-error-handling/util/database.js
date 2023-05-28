const Sequelize = require("sequelize");

const sequelize = new Sequelize("learn-nodejs-2", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  storage: "./session.mysql",
});

module.exports = sequelize;
