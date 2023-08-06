const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const sendMail = require("../util/sendMail");
const crypto = require("crypto");
const Sequlize = require("sequelize");
const { validationResult } = require("express-validator");

class Auth {
  getLogin = (req, res, next) => {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      oldInput: {
        email: "",
        password: "",
      },
      errorMessage: req.flash("error")?.length
        ? req.flash("error")[0]
        : undefined,
    });
  };
  postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errorResult = validationResult(req);

    if (!errorResult.isEmpty()) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        oldInput: {
          email,
          password,
        },
        errorMessage: errorResult.array().length
          ? `${errorResult.array()[0].msg}`
          : undefined,
      });
    } else {
      User.findOne({ where: { email } })
        .then((resultUser) => {
          if (!resultUser) {
            throw new Error("User tidak ditemukan");
          } else {
            return bcryptjs
              .compare(password, resultUser.password)
              .then((isValid) => {
                if (isValid) {
                  req.session.isLoggedIn = true;
                  req.session.user = resultUser;
                  req.session.save((err) => {
                    res.redirect("/");
                  });
                } else {
                  throw new Error("Password salah");
                }
              });
          }
        })
        .catch((err) => {
          req.flash("error", err.message);
          res.redirect("/login");
        });
    }
  };
  postLogout = (req, res, next) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  };
  getSignUp = (req, res, next) => {
    res.render("auth/signup", {
      path: "/signup",
      oldInput: {
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
      },
      pageTitle: "Sign Up",
      errorResults: [],
      errorMessage: req.flash("error")?.length
        ? req.flash("error")[0]
        : undefined,
    });
  };
  postSignup = (req, res, next) => {
    const { email, password, name, confirmPassword } = req.body;

    const errorResult = validationResult(req);

    if (!errorResult.isEmpty()) {
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Sign Up",
        oldInput: {
          email,
          name,
          password,
          confirmPassword,
        },
        errorMessage: errorResult.array().length
          ? `${errorResult.array()[0].msg}`
          : undefined,
        errorResults: errorResult.array(),
      });
    } else {
      bcryptjs
        .hash(password, 12)
        .then((encryptedPassword) => {
          User.create({ email, name, password: encryptedPassword }).then(
            (resultUser) => {
              resultUser.createCart().then(() => {
                sendMail("<b>Sign Up Success</b>", email);
                res.redirect("/login");
              });
            }
          );
        })
        .catch((err) => {
          console.error(err);
          res.redirect("/signup");
        });
    }
  };
  getReset = (req, res, next) => {
    res.render("auth/reset", {
      path: "/reset",
      pageTitle: "Reset Password",
      errorMessage: req.flash("error")?.length
        ? req.flash("error")[0]
        : undefined,
    });
  };
  postReset = (req, res, next) => {
    const { email } = req.body;

    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        return res.redirect("/reset");
      }
      const token = buffer.toString("hex");

      User.findOne({ where: { email } }).then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then((user) => {
          res.redirect("/login");
          sendMail(
            `
              <p>You requested a apassword reset</p>
              <p>Click this <a href="http://localhost:3001/reset/${token}">link</a></p>
            `,
            user.email
          );
        });
      });
    });
  };
  getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Sequlize.Op.gt]: Date.now() },
      },
    }).then((user) => {
      if (user) {
        return res.render("auth/new-password", {
          userId: user.id,
          path: "/reset",
          pageTitle: "Reset Password",
          errorMessage: req.flash("error")?.length
            ? req.flash("error")[0]
            : undefined,
        });
      } else {
        req.flash("error", "Tidak ditemukan user");
        return res.redirect("/login");
      }
    });
  };
  postNewPassword = (req, res, next) => {
    const { userId, password } = req.body;

    User.findOne({
      where: {
        id: userId,
        resetTokenExpiration: { [Sequlize.Op.gt]: Date.now() },
      },
    }).then((user) => {
      if (user) {
        bcryptjs.hash(password, 12).then((encryptedPassword) => {
          user.password = encryptedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save().then((userResult) => {
            res.redirect("/login");
          });
        });
      } else {
        req.flash("error", "Tidak ditemukan user");
        return res.redirect("/login");
      }
    });
  };
}

module.exports = new Auth();
