const cookie = require("../util/cookie");

class ErrorController {
  get404 = (req, res, next) => {
    res
      .status(404)
      .render("404", { pageTitle: "Page Not Found", path: "/404" });
  };
  get505 = (req, res, next) => {
    res
      .status(500)
      .render("500", { pageTitle: "Error Occured!", path: "/500" });
  };
}

module.exports = new ErrorController();
