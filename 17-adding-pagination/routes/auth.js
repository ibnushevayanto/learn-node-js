const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please input valid email"),
    body("password")
      .isLength({ min: 5 })
      .trim()
      .withMessage("Password must have minimum 5 charachter"),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Tolong masukkan email yang valid")
      .custom((value, _) => {
        return User.findAll({ where: { email: value } }).then((users) => {
          if (users.length) {
            return Promise.reject(
              "Email exists already, please pick a different one"
            );
          }
        });
      }),
    body("password", "The password must have 5 charachter")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error("Confirm password not same with the password");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
