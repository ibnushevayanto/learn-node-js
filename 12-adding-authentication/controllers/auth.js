const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

class Auth {
  getLogin = (req, res, next) => {
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: req.flash("error"),
    });
  };
  postLogin = (req, res, next) => {
    const { email, password } = req.body;
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
  };
  postLogout = (req, res, next) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  };
  getSignUp = (req, res, next) => {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Sign Up",
    });
  };
  postSignup = (req, res, next) => {
    const { email, password, name } = req.body;
    User.findAll({ where: { email } })
      .then((users) => {
        if (users.length) {
          throw new Error("User is registered");
        } else {
          return bcryptjs.hash(password, 12);
        }
      })
      .then((encryptedPassword) => {
        User.create({ email, name, password: encryptedPassword }).then(
          (resultUser) => {
            resultUser.createCart().then(() => {
              const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                name: 'ethereal.email',
                secure: false, // true for 465, false for other ports
                auth: {
                  user: 'troy64@ethereal.email', // generated ethereal user
                  pass: 'PAVGpWnVMKkyC9tsB7', // generated ethereal password
                },
              });
              transporter
                .sendMail({
                  from: `"Troy Rath" <troy64@ethereal.email>`, // sender address
                  to: email, // list of receivers
                  subject: "Signup Success", // Subject line
                  html: "<b>Success to signup</b>", // html body
                })
                .then((_) => {
                  res.redirect("/login");
                })
                .catch((err) => console.error(err));
            });
          }
        );
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/signup");
      });
  };
}

module.exports = new Auth();
