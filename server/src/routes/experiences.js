
import crypto from "crypto";
import express from "express";
import prisma from "../database/db.js";
import s3Client from "../s3/s3Client.js";
import resizedImage from "../utils/resizeImage.js";
import getImageKey from "../utils/getImageKey.js";
import Exceptions from "../utils/Exceptions.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";

import { upload } from "./skills.js";
import { experienceSchema } from "../utils/schemas.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

router.get("/experiences", verifyAccessToken, async (req, res) => {
  try {
    const user = req.user;
    const experiencesList = await prisma.experiences.findMany({
      where: {
        usersId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!experiencesList) {
      return res.status(200).json({ experiencesList: "not items found" });
    }
    return res.status(200).json(experiencesList);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});
router.get("/experiences/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const experiencesList = await prisma.experiences.findMany({
      where: {
        usersId: userId,
      },
    });
    if (!experiencesList) {
      return res.status(200).json({ experiencesList: "not items found" });
    }
    return res.status(200).json(experiencesList);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.post(
  "/experiences",
  upload.single("file"),
  verifyAccessToken,
  checkUploadImageFormat,
  async (req, res) => {
    try {
      const user = req.user;
      const payload = req.body;
      const image = req.file;

      const validExperiencePayload = experienceSchema.safeParse(payload);

      if (!validExperiencePayload.success) {
        const error = validExperiencePayload.error.flatten().fieldErrors;

        return res.status(400).json(new Exceptions(400, error));
      }

      const uploadImgPath = `${crypto.randomUUID()}.${
        image.mimetype.split("/")[1]
      }`;

      const resizedCompanyLogoImage = await resizedImage(
        image.buffer,
        50,
        50,
        80
      );

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uploadImgPath,
        Body: resizedCompanyLogoImage,
        ContentType: image.mimetype,
      });

      const uploadCompanyLogoResult = await s3Client.send(command);

      if (uploadCompanyLogoResult.$metadata.httpStatusCode !== 200)
        throw new Error("upload company logo error!!");

      await prisma.experiences.create({
        data: {
          ...validExperiencePayload.data,
          cLogo: `${BUCKET_DOMAIN}/${uploadImgPath}`,
          usersId: user.id,
        },
      });

      const newExperiences = await prisma.experiences.findMany({
        where: {
          usersId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(201).json({
        data: newExperiences,
        message: "a new experiences was added.",
      });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);
router.put(
  "/experiences/:experience_id",
  upload.single("file"),
  verifyAccessToken,
  async (req, res) => {
    try {
      const { experience_id } = req.params;
      const user = req.user;
      const payload = req.body;
      const image = req.file;

      const experience = await prisma.experiences.findUnique({
        where: {
          id: experience_id,
          usersId: user.id,
        },
      });

      if (!experience) throw new Error("This experience not exist");

      if (image) {
        const experienceImageKey = getImageKey(experience.cLogo);
        const resizedExperienceImage = await resizedImage(
          image.buffer,
          50,
          50,
          80
        );

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: experienceImageKey,
          Body: resizedExperienceImage,
          ContentType: image.mimetype,
        });

        const uploadResult = await s3Client.send(command);

        if (uploadResult.$metadata.httpStatusCode !== 200)
          throw new Error("upload new company image failed!!");
      }

      const validExperiencePayload = experienceSchema.safeParse(payload);

      if (!validExperiencePayload.success) {
        throw new Error("not a valid experience data");
      }

      await prisma.experiences.update({
        where: {
          id: experience_id,
          usersId: user.id,
        },
        data: { ...validExperiencePayload.data },
      });
      const newExperience = await prisma.experiences.findMany({
        where: {
          usersId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json({
        data: newExperience,
        message: "experience information was updated successfully",
      });
    } catch (error) {
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.delete(
  "/experiences/:experience_id",
  verifyAccessToken,
  async (req, res) => {
    try {
      const user = req.user;
      const { experience_id } = req.params;

      const experience = await prisma.experiences.findUnique({
        where: { id: experience_id, usersId: user.id },
      });

      if (!experience) throw new Error("This experience doesn't exist!!");

      if (experience.cLogo) {
        const companyImageKey = getImageKey(experience.cLogo);

        const command = new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: companyImageKey,
        });
        try {
          await s3Client.send(command);
        } catch (err) {
          throw new Error(err.message);
        }
      }

      await prisma.experiences.delete({
        where: {
          id: experience_id,
          usersId: user.id,
        },
      });
      const newExperience = await prisma.experiences.findMany({
        where: {
          usersId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json({
        data: newExperience,
        message: "experience was deleted successfully.",
      });
    } catch (error) {
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

export default router;
