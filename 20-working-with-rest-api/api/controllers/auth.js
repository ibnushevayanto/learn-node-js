const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    const error = new Error(`${errors[0].path} ${errors[0].msg}`);
    error.statusCode = 422;
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcryptjs
    .hash(password, 12)
    .then((hashedPw) => {
      return User.create({
        email,
        name,
        password: hashedPw,
        status: "Offline",
      });
    })
    .then((post) => res.json({ message: "User created", userId: post.id }))
    .catch((err) => {
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let dataUser = null;

  User.findOne({ where: { email } })
    .then((resultUser) => {
      if (!resultUser) {
        const error = new Error("Pengguna belum terdaftar");
        error.statusCode = 422;
        throw error;
      }

      dataUser = resultUser;
      return bcryptjs.compare(password, resultUser.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password salah");
        error.statusCode = 422;
        throw error;
      }

      const token = jwt.sign(
        {
          email: dataUser.email,
          name: dataUser.name,
          id: dataUser.id.toString(),
        },
        "super-secret-token",
        { expiresIn: "1h" }
      );
      return res.status(200).json({ token, userId: dataUser.id.toString() });
    })
    .catch((err) => next(err));
};

exports.getStatus = (req, res, next) => {
  User.findOne({ where: { id: req.user.id }, attributes: ["status"] })
    .then((data) => res.json({ status: data.status }))
    .catch((err) => next(err));
};

exports.changeStatus = (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length) {
    const error = new Error(`${errors[0].path} ${errors[0].msg}`);
    error.statusCode = 422;
    next(error);
    return;
  }

  const status = req.body.status;

  User.findByPk(req.user.id)
    .then((data) => {
      data.status = status;
      return data.save();
    })
    .then(() => res.json({ message: "Berhasil mengubah status" }))
    .catch((err) => next(err));
};
