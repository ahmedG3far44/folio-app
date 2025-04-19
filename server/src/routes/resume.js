import express from "express";
import prisma from "../database/db.js";
import s3Client from "../s3/s3Client.js";
import Exceptions from "../utils/Exceptions.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

import { upload } from "./skills.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

router.get("/resume", verifyAccessToken, async (req, res) => {
  try {
    const user = req.user;
    const resumeUrl = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      select: {
        resume: true,
      },
    });
    if (!resumeUrl.resume) {
      return res.status(404).json(new Exceptions(404, "not found item"));
    }
    return res.status(200).json({
      resume: `${BUCKET_DOMAIN}/${resumeUrl.resume}`,
    });
  } catch (error) {
    return res.status(200).json(new Exceptions(500, error.message));
  }
});

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
  "/resume",
  verifyAccessToken,
  upload.single("resume"),
  async (req, res) => {
    const user = req.user;
    const resumeFile = req.file;
    let resumeKeyName;

    console.log(resumeFile);

    if (!validResumeFile(resumeFile)) {
      throw new Error("resume format not accepted!!");
    }
    resumeKeyName = `resume-${crypto.randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: resumeKeyName,
      Body: resumeFile.buffer,
      ContentType: resumeFile.mimetype,
    });
    try {
      await s3Client.send(command);
      console.log("uploaded cv success");

      const resume = await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          resume: resumeKeyName,
        },
        select: {
          id: true,
          resume: true,
        },
      });
      const url = `${BUCKET_DOMAIN}/${resumeKeyName}`;
      console.log("updated cv key in db");
      console.log(url);
      res.status(201).json({
        success: "a cv file uploaded successfully",
        ...resume,
        url,
      });
    } catch (error) {
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.put(
  "/resume",
  verifyAccessToken,
  upload.single("resume"),
  async (req, res) => {
    const user = req.user;
    const newCvFile = req.file;

    let newKey;

    console.log(newCvFile);

    if (!validResumeFile(newCvFile)) {
      throw new Error("resume format not accepted!!");
    }

    console.log("accepted file type");

    const userCvKeyName = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      select: {
        resume: true,
      },
    });
    newKey = userCvKeyName.resume;

    if (!userCvKeyName.resume) {
      throw new Error("user cv not found");
    }

    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: newKey,
        Body: newCvFile.buffer,
        ContentType: newCvFile.mimetype,
      });
      await s3Client
        .send(command)
        .then(() => {
          console.log(`updated cv ${newKey} success`);
        })
        .catch((error) => {
          return res
            .status(200)
            .send({ error: "not upload", message: error.message });
        });

      const url = `${BUCKET_DOMAIN}/${newKey}`;

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
