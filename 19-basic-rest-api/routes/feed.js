const express = require("express");
const feedContoller = require("../controllers/feed");

const router = express.Router();
router.get("/posts", feedContoller.getPosts);
router.post("/posts", feedContoller.postPost);

module.exports = router;
