const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fileHelper = require("../util/file");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
  const page = req.query.page || 1;
  const limit = 2;
  let jumlahData = 0;

  req.user
    .countPosts()
    .then((jumlahPost) => {
      jumlahData = jumlahPost;

      return req.user.getPosts({
        offset: (page - 1) * limit,
        limit,
        include: User,
      });
    })
    .then((posts) => {
      res.status(200).json({
        message: "Berhasil mendapatkan data",
        totalItems: jumlahData,
        posts: posts.map((data) => ({
          ...data.dataValues,
          creator: data.user,
        })),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length) {
    const error = new Error(`${errors[0].path} ${errors[0].msg}`);
    error.statusCode = 422;
    next(error);
    return;
  }

  if (!req.file) {
    const error = new Error(`Gambar wajib diisi`);
    error.statusCode = 422;
    next(error);
    return;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  Post.create({ title, content, imageUrl, userId: req.user.id })
    .then((data) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: {
          id: data.id,
          title,
          content,
          creator: { name: req.user.name },
          createdAt: new Date(),
        },
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.id;
  Post.findOne({ where: { id: postId, userId: req.user.id }, include: User })
    .then((data) => {
      if (!data) {
        const error = new Error("Data tidak ditemukan");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Berhasil mendapatkan data",
        post: { ...data.dataValues, creator: data.user },
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const id = req.params.id;

  const errors = validationResult(req).array();

  if (errors.length) {
    const error = new Error(`${errors[0].path} ${errors[0].msg}`);
    error.statusCode = 422;
    next(error);
    return;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("Gambar wajib diisi");
    error.statusCode = 422;
    throw error;
  }

  Post.findOne({ where: { id, userId: req.user.id } })
    .then((post) => {
      if (!post) {
        const err = new Error("Post tidak ditemukan");
        err.statusCode = 404;
        throw err;
      }

      post.title = title;
      post.content = content;

      if (req.file) {
        fileHelper.deleteFile(post.imageUrl);
        post.imageUrl = imageUrl;
      }

      return post.save();
    })
    .then((post) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          creator: { name: req.user.name },
          createdAt: post.updatedAt,
        },
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.findOne({ where: { id, userId: req.user.id } })
    .then((post) => {
      if (!post) {
        const err = new Error("Post tidak ditemukan");
        err.statusCode = 404;
        throw err;
      }

      if (post.imageUrl) {
        fileHelper.deleteFile(post.imageUrl);
      }

      return post.destroy();
    })
    .then(() => {
      res.status(201).json({
        message: "Post success to delete",
      });
    })
    .catch((err) => {
      next(err);
    });
};
