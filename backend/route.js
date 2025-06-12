import express from "express";
import upload from "./upload-middleware.js";
import File from "./schema.js";

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = new File();
    file.title = req.file.originalname;
    file.url = req.file.path;
    const savedFile = await file.save();
    res.json({
      message: "file uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while uploading the file",
    });
  }
});

export default router;
