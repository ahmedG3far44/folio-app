import sharp from "sharp";
import crypto from "crypto";
import express from "express";
import authenticated from "../middlewares/authenticated.js";

import { upload } from "../configs/multer.js";
import { uploadImage } from "../utils/upload.js";

const router = express.Router();

router.post(
  "/upload",
  authenticated,
  upload.array("file", 5),
  async (req, res) => {
    try {
      const files = req.files;
      const uploadedFiles = [];

      for (const file of files) {
        const compressedFileBuffer = await sharp(file.buffer)
          .toFormat("webp", {
            quality: 80,
            mozjpeg: true,
            progressive: true,
          })
          .toBuffer();

        const result = await uploadImage(compressedFileBuffer, {
          folder: "folio/uploads",
          publicId: crypto.randomUUID(),
        });

        const fileInfo = {
          url: result.url,
          size: file.size,
          name: file.originalname,
          type: file.mimetype,
        };
        uploadedFiles.push(fileInfo);
      }

      res.status(200).json({ data: uploadedFiles, message: "upload success" });
    } catch (err) {
      res.status(500).json({ data: "error upload", message: err.message });
    }
  }
);

export default router;
