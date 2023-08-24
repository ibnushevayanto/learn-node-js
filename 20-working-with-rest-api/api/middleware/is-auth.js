const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  let decodedToken;
  try {
    const token = req.get("Authorization").split(" ")[1];
    decodedToken = jwt.verify(token, "super-secret-token");
  } catch (err) {
    const error = new Error("Mohon masukkan token");
    error.statusCode = 401;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Anda belum login");
    error.statusCode = 401;
    throw error;
  }

  if (req.user) {
    next();
    return;
  }

  User.findByPk(decodedToken.id)
    .then((dataUser) => {
      if (!dataUser) {
        const error = new Error("Data user tidak ditemukan");
        error.statusCode = 422;
        throw error;
      }

      req.user = dataUser;
      next();
    })
    .catch((err) => next(err));
};
