const Sequlize = require("sequelize");
const sequelize = require("../util/database");

// You can read more properties documentation to use in column definiiton below this.
// https://sequelize.org/api/v6/class/src/model.js~model#static-method-init
const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequlize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: Sequlize.INTEGER,
});

module.exports = CartItem;
