const User = require("../models/user");

class Auth {
  getLogin = (req, res, next) => {
    const isAuthenticated = req.session.isLoggedIn;

    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated,
    });
  };
  postLogin = (req, res, next) => {
    User.findByPk(1)
      .then((user) => {
        if (!user) {
          return User.create({
            name: "Ibnu Shevayanto",
            email: "ibnushevayanto@gmail.com",
          });
        }
        return user;
      })
      .then((user) => {
        return user
          .getCart()
          .then((cart) => {
            if (!cart) {
              return user.createCart();
            }
            return cart;
          })
          .then(() => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              res.redirect("/");
            });
          });
      });
  };
  postLogout = (req, res, next) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  };
}

module.exports = new Auth();
