const express = require("express");
const feedContoller = require("../controllers/feed");
const { body } = require("express-validator");
const upload = require("../util/upload");

const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/posts", isAuth, feedContoller.getPosts);
router.post(
  "/post",
  isAuth,
  upload(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  body("title")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Minimal 5 Karakter"),
  body("content")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Minimal 5 Karakter"),
  feedContoller.postPost
);
router.get("/posts/:id", isAuth, feedContoller.getPost);
router.put(
  "/post/:id",
  isAuth,
  upload(["image/png", "image/jpg", "image/jpeg"]).single("image"),
  body("title")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Minimal 5 Karakter"),
  body("content")
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Minimal 5 Karakter"),
  feedContoller.updatePost
);
router.delete("/post/:id", isAuth, feedContoller.deletePost);

module.exports = router;
