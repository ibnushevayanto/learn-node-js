const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");
const isAuth = require("../middleware/is-auth");

router.post(
  "/signup",
  body("email")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom((value, { req }) =>
      User.findOne({ where: { email: value } }).then((data) => {
        if (data) {
          return Promise.reject("Email sudah digunakan");
        }
      })
    )
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password minimal 5 karakter"),
  body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong"),
  authController.signUp
);
router.post("/login", authController.login);

router.get("/status", isAuth, authController.getStatus);
router.post(
  "/status/change",
  isAuth,
  body("status").notEmpty().withMessage("Tidak boleh kosong"),
  authController.changeStatus
);

module.exports = router;
