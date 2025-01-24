import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../handlers/Exceptions.js";
import checkAccessUser from "../middlewares/checkAccessUser.js";
import { skillsSchema } from "../schemas/validationSchemas.js";
import s3Client from "../s3/s3Client.js";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import dotenv from "dotenv";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import resizedImage from "../handlers/resizeImage.js";
import getImageKey from "../handlers/getImageKey.js";

dotenv.config();

export const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get("/:userId/skills", checkAccessUser, async (req, res) => {
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
  console.log("get skills list");
  return res.status(202).json(skillsList);
});

router.post(
  "/:userId/skills",
  checkAccessUser,
  upload.single("file"),
  checkUploadImageFormat,
  async (req, res) => {
    const { userId } = req.params;
    const image = req.file;
    const payload = req.body;

    const validSkillsPayload = skillsSchema.safeParse(payload);
    if (!validSkillsPayload.success) {
      return res.json(new Exceptions(400, "Bad request the data isn't valid"));
    }

    let nameKey;

    nameKey = `${userId}/skills/${crypto.randomUUID()}`;

    const resizedSkillImage = await resizedImage(image.buffer, 50, 50, 10);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: nameKey,
      Body: resizedSkillImage,
      ContentType: "image/webp",
    });

    await s3Client
      .send(command)
      .then(async () => {
        console.log("uploaded success");
        const newSkill = await prisma.skills.create({
          data: {
            skillName: payload.skillName,
            skillLogo: `https://presento-app.s3.amazonaws.com/${nameKey}`,
            usersId: userId,
          },
        });
        return res.status(201).json({ newSkill, success: "a new skill added" });
      })
      .catch((error) => {
        console.log("not uploaded");
        return res
          .status(200)
          .json({ error: "failed not upload", message: error.message });
      });
  }
);

router.put(
  "/:userId/skills/:skillId",
  checkAccessUser,
  upload.single("file"),
  checkUploadImageFormat,
  async (req, res) => {
    const { skillId, userId } = req.params;
    const payload = req.body;
    const skillLogoImage = req.file;

    
    console.log(payload)

    const updateSkill = await prisma.skills.findUnique({
      where: {
        id: skillId,
        usersId: userId,
      },
    });

    if (!updateSkill) {
      return res
        .status(404)
        .json(new Exceptions(404, "this skill doesn't exist"));
    }

    const validSkillsPayload = skillsSchema.safeParse(payload);

    if (!validSkillsPayload.success) {
      return res
        .status(400)
        .json(new Exceptions(400, "Bad request the data isn't valid"));
    }

    const { data } = validSkillsPayload;

    const skillImageKey = getImageKey(updateSkill.skillLogo);

    const resizedSkillImage = await resizedImage(
      skillLogoImage.buffer,
      50,
      50,
      80
    );

    const updateSkillLogoCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: skillImageKey,
      Body: resizedSkillImage,
      ContentType: "image/webp",
    });

    await s3Client
      .send(updateSkillLogoCommand)
      .then(async (response) => {
        console.log("skill image updated success");
        if (response.$metadata.httpStatusCode === 200) {
          await prisma.skills.update({
            where: {
              id: skillId,
              usersId: userId,
            },
            data: {
              skillName: data.skillName,
            },
          });
          return res
            .status(200)
            .json(new Exceptions(200, "skill info updated successfully"));
        }
      })
      .catch((error) => {
        console.log("skill image not updated");
        return res.status(500).json(new Exceptions(500, error.message));
      });
  }
);

router.delete("/:userId/skills/:id", checkAccessUser, async (req, res) => {
  const { id, userId } = req.params;
  const deletedSkill = await prisma.skills.findUnique({
    where: {
      id,
      usersId: userId,
    },
  });
  if (!deletedSkill) {
    return res
      .status(404)
      .json(new Exceptions(404, "this skill doesn't exist error delete"));
  }
  console.log(deletedSkill);
  const skillLogoKey = deletedSkill.skillLogo.split(".com/")[1];
  console.log(skillLogoKey);
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: skillLogoKey,
  });

  await s3Client
    .send(deleteCommand)
    .then(async () => {
      console.log("skill image was deleted from s3");
      await prisma.skills.delete({
        where: {
          id,
          usersId: userId,
        },
      });
      console.log("all skill info was deleted");
      return res.status(200).json(new Exceptions(200, "skills was deleted "));
    })
    .catch((error) => {
      return res.status(500).json(new Exceptions(500, error.message));
    });
});

export default router;

export function changeToSlug(text) {
  const newText = text.split(" ").join("");
  return newText;
}
