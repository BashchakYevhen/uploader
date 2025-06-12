import multer from "multer";
import path from "path";

const storageEngine = multer.diskStorage({
  destination: "./upload",
  filename: function (req, file, fn) {
    fn(
      null,
      new Date().getTime().toString() +
        "-" +
        file.fieldname +
        path.extname(file.originalname)
    );
  },
});

const validateFile = function (file, cb) {
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only PDF, JPEG, PNG and GIF files are allowed.");
  }
};
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 200000 },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
});

export default upload;
