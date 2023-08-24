const fs = require("fs");

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      err.statusCode = 500;
      throw err;
    }
  });
};
