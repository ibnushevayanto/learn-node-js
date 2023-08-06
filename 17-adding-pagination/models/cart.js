const Sequlize = require("sequelize");
const sequelize = require("../util/database");

// You can read more properties documentation to use in column definiiton below this.
// https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
const Cart = sequelize.define("cart", {
  id: {
    type: Sequlize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
