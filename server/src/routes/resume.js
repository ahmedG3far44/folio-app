import express from "express";
import checkAccessUser from "../middlewares/checkAccessUser.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import prisma from "../database/db.js";
import s3Client from "../s3/s3Client.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { upload } from "./skills.js";
import dotenv from "dotenv";
import Exceptions from "../handlers/Exceptions.js";
dotenv.config();

const router = express.Router();
router.get("/:userId/resume", async (req, res) => {
  try {
    const { userId } = req.params;
    const resumeUrl = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        resume: true,
      },
    });
    if (!resumeUrl.resume) {
      return res.status(404).json(new Exceptions(404, "not found item"));
    }
    return res.status(200).json({
      resume: `${process.env.AWS_S3_BUCKET_DOMAIN}/${resumeUrl.resume}`,
    });
  } catch (error) {
    return res.status(200).json(new Exceptions(500, error.message));
  }
});
router.post(
  "/:userId/resume",
  checkAccessUser,
  upload.single("cv-file"),
  async (req, res) => {
    const { userId } = req.params;
    const resumeFile = req.file;
    let resumeKeyName;
    console.log(resumeFile);
    if (!validResumeFile(resumeFile)) {
      return res
        .status(400)
        .json(
          new Exceptions(
            400,
            "file type that you uploaded not accepted, maybe the type file not supported or the file size is more than 4MB."
          )
        );
    }
    resumeKeyName = `${userId}/cv/${crypto.randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: resumeKeyName,
      Body: resumeFile.buffer,
      ContentType: resumeFile.mimetype,
    });
    try {
      await s3Client
        .send(command)
        .then(() => {
          console.log("uploaded cv success");
        })
        .catch((error) => {
          console.log("cv file not uploaded");
          return res
            .status(200)
            .send({ error: "not upload", message: error.message });
        });

      const resume = await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          resume: resumeKeyName,
        },
        select: {
          id: true,
          resume: true,
        },
      });
      const url = `${process.env.AWS_S3_BUCKET_DOMAIN}/${resumeKeyName}`;
      console.log("updated cv key in db");
      console.log(url);
      return res.status(201).json({
        success: "a cv file uploaded successfully",
        ...resume,
        url,
      });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.put(
  "/:userId/resume",
  checkAccessUser,
  upload.single("cv-file"),
  async (req, res) => {
    const { userId } = req.params;
    const newCvFile = req.file;

    let newKey;
    console.log(newCvFile);
    if (!validResumeFile(newCvFile)) {
      return res
        .status(400)
        .json(
          new Exceptions(
            400,
            "file type that you uploaded not accepted, maybe the type file not supported or the file size is more than 4MB."
          )
        );
    }
    console.log("accepted file type");
    const userCvKeyName = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        resume: true,
      },
    });
    newKey = userCvKeyName.resume;
    console.log(newKey, "old cv key");

    if (!userCvKeyName.resume) {
      return res
        .status(404)
        .json(new Exceptions(404, "this file doesn't found"));
    }

    const updateResumeCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: newKey,
      Body: newCvFile.buffer,
      ContentType: newCvFile.mimetype,
    });
    try {
      await s3Client
        .send(updateResumeCommand)
        .then(() => {
          console.log(`updated cv ${newKey} success`);
        })
        .catch((error) => {
          console.log("error cv file not updated");
          return res
            .status(200)
            .send({ error: "not upload", message: error.message });
        });

      const url = `${process.env.AWS_S3_BUCKET_DOMAIN}/${newKey}`;
      console.log(url);
      return res.status(201).json({
        success: "a cv file updated",
        url,
      });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

export default router;

export function validResumeFile(file) {
  const supportedFilesTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];
  if (supportedFilesTypes.includes(file.mimetype)) {
    if (file.size > 4000000) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}
