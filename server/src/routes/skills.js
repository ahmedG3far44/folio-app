import express from "express";
import multer from "multer";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";
import s3Client from "../s3/s3Client.js";

import getImageKey from "../utils/getImageKey.js";
import resizedImage from "../utils/resizeImage.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";

import { skillsSchema } from "../utils/schemas.js";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

export const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/skills", verifyAccessToken, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json(new Exceptions(404, "user not found"));
    }
    const skillsList = await prisma.skills.findMany({
      where: {
        usersId: id,
      },
    });

    return res.status(200).json(skillsList);
  } catch (err) {
    return res.status(500).json({ data: "error", message: err.message });
  }
});
router.get("/skills/:userId", verifyAccessToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json(new Exceptions(404, "user not found"));
    }
    const skillsList = await prisma.skills.findMany({
      where: {
        usersId: userId,
      },
    });

    return res.status(200).json(skillsList);
  } catch (err) {
    return res.status(500).json({ data: "error", message: err.message });
  }
});

router.post(
  "/skills",
  verifyAccessToken,
  upload.single("file"),
  checkUploadImageFormat,
  async (req, res) => {
    try {
      const user = req.user;
      const image = req.file;
      const payload = req.body;
      const validSkillsPayload = skillsSchema.safeParse(payload);

      if (!validSkillsPayload.success) {
        return res.json(
          new Exceptions(400, "Bad request the data isn't valid")
        );
      }

      const nameKey = `${crypto.randomUUID()}.${image.mimetype.split("/")[1]}`;

      const resizedSkillImage = await resizedImage(image.buffer, 50, 50, 10);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: nameKey,
        Body: resizedSkillImage,
        ContentType: image.mimetype,
      });

      const uploadImageResult = await s3Client.send(command);
      if (uploadImageResult.$metadata.httpStatusCode !== 200)
        throw new Error("upload skill image error !!");
      console.log("uploaded success");
      const newSkill = await prisma.skills.create({
        data: {
          skillName: payload.skillName,
          skillLogo: `${BUCKET_DOMAIN}/${nameKey}`,
          usersId: user.id,
        },
      });
      return res.status(201).json({ newSkill, success: "a new skill added" });
    } catch (err) {
      console.log(err.message);
      return res
        .status(200)
        .json({ data: "failed not upload", message: err.message });
    }
  }
);

router.put(
  "/skills/:skillId",
  verifyAccessToken,
  upload.single("file"), // Multer middleware (handles file upload)
  checkUploadImageFormat, // Middleware to check image format
  async (req, res) => {
    try {
      const { skillId } = req.params;
      const user = req.user;
      const payload = req.body;
      const image = req.file; // Will be `undefined` if no file is uploaded

      // Check if the skill exists and belongs to the user
      const skill = await prisma.skills.findUnique({
        where: {
          id: skillId,
          usersId: user.id,
        },
      });

      if (!skill) {
        return res
          .status(404)
          .json(new Exceptions(404, "This skill doesn't exist"));
      }

      const validSkillsPayload = skillsSchema.safeParse(payload);

      if (!validSkillsPayload.success) {
        return res
          .status(400)
          .json(new Exceptions(400, "Bad request: Invalid data"));
      }

      const { skillName } = validSkillsPayload.data;
      let skillLogoKey;
      if (image) {
        skillLogoKey = getImageKey(skill.skillLogo); // Reuse the same S3 key

        const resizedSkillImage = await resizedImage(image.buffer, 50, 50, 80);

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: skillLogoKey,
          Body: resizedSkillImage,
          ContentType: image.mimetype,
        });

        const updateUploadResult = await s3Client.send(command);

        if (updateUploadResult.$metadata.httpStatusCode !== 200) {
          throw new Error("Failed to update skill image in S3");
        }
        console.log("Skill image updated successfully");
      }

      const skills = await prisma.skills.update({
        where: {
          id: skillId,
          usersId: user.id,
        },
        data: {
          skillName,
          skillLogo: `${BUCKET_DOMAIN}/${skillLogoKey}`,
        },
      });

      return res.status(200).json({ data: skills });
    } catch (err) {
      console.error("Error updating skill:", err);
      return res.status(500).json(new Exceptions(500, err.message));
    }
  }
);

router.delete("/skills/:skillId", verifyAccessToken, async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = req.user;

    const skill = await prisma.skills.findUnique({
      where: {
        id: skillId,
        usersId: user.id,
      },
    });

    if (!skill) throw new Error("this skill not exist !!");

    if (skill.skillLogo) {
      const skillLogoKey = getImageKey(skill.skillLogo);

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: skillLogoKey,
      });

      try {
        await s3Client.send(command);
        console.log("Skill image was deleted from S3");
      } catch (s3Error) {
        console.error("Failed to delete image from S3:", s3Error);
      }
    }

    const skillDelete = await prisma.skills.delete({
      where: {
        id: skillId,
        usersId: user.id,
      },
    });

    console.log(skillDelete);

    return res.status(200).json({ data: skillDelete });
  } catch (err) {
    return res.status(500).json(new Exceptions(500, err.message));
  }
});

export default router;
