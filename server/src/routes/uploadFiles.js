import sharp from "sharp";
import crypto from "crypto";
import express from "express";
import s3Client from "../s3/s3Client.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

import { upload } from "./skills.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

router.post(
  "/upload",
  verifyAccessToken,
  upload.array("file", 5),
  async (req, res) => {
    try {
      const files = req.files;
      const uploadedFiles = [];

      if (files.length > 1) {
        for (const file of files) {
          const fileKey = `${crypto.randomUUID()}`;
          const removedBgImage = await removeBg(file.buffer);
          const compressedFileBuffer = await sharp(removedBgImage)
            .toFormat("webp", {
              quality: 80,
              mozjpeg: true,
              progressive: true,
            })
            .toBuffer();

          const commnad = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: compressedFileBuffer,
            ContentType: file.mimetype,
          });

          await s3Client.send(commnad);

          const fileInfo = {
            url: `${BUCKET_DOMAIN}/${fileKey}`,
            size: file.size,
            name: file.originalname,
            type: file.mimetype,
          };
          uploadedFiles.push(fileInfo);
        }
      } else {
        const file = files[0];
        const fileKey = `${crypto.randomUUID()}`;
        const compressedFileBuffer = await sharp(file.buffer)
          .toFormat("webp", {
            quality: 80,
            mozjpeg: true,
            progressive: true,
          })
          .toBuffer();

        const commnad = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
          Body: compressedFileBuffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(commnad);

        const fileInfo = {
          url: `${BUCKET_DOMAIN}/${fileKey}`,
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
