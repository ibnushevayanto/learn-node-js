const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images"); // ! First parameter is error handler, whichh is function for handling an error
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

module.exports = (allowedFormatFile = []) => {
  return multer({
    storage: fileStorage,
    fileFilter(req, file, cb) {
      if (allowedFormatFile.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  });
};
