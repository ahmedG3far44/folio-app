import crypto from "crypto";
import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";

import getImageKey from "../utils/getImageKey.js";
import resizedImage from "../utils/resizeImage.js";
import authenticated from "../middlewares/authenticated.js";
import verifyUploading from "../middlewares/verifyUploading.js";

import { upload } from "../configs/multer.js";
import { uploadImage, deleteImage } from "../utils/upload.js";
import { skillsSchema } from "../utils/schemas.js";

const router = express.Router();

router.get("/skills", authenticated, async (req, res) => {
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
router.get("/skills/:userId", authenticated, async (req, res) => {
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
  authenticated,
  upload.single("file"),
  verifyUploading,
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

      const resizedSkillImage = await resizedImage(image.buffer, 50, 50, 10);

      const result = await uploadImage(resizedSkillImage, {
        folder: "folio/skills",
        publicId: crypto.randomUUID(),
      });

      await prisma.skills.create({
        data: {
          skillName: payload.skillName,
          skillLogo: result.url,
          usersId: user.id,
        },
      });
      const newSkill = await prisma.skills.findMany({
        where: {
          usersId: user.id,
        },
      });
      res.status(201).json({ data: newSkill, message: "a new skill added" });
    } catch (err) {
      res.status(200).json({ data: "failed not upload", message: err.message });
    }
  }
);

router.put(
  "/skills/:skillId",
  authenticated,
  upload.single("file"),
  verifyUploading,
  async (req, res) => {
    try {
      const { skillId } = req.params;
      const user = req.user;
      const payload = req.body;
      const image = req.file;

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
      let skillLogoUrl = skill.skillLogo;
      if (image) {
        const publicId = getImageKey(skill.skillLogo);
        const resizedSkillImage = await resizedImage(image.buffer, 50, 50, 80);

        const result = await uploadImage(resizedSkillImage, {
          folder: "folio/skills",
          publicId,
        });
        skillLogoUrl = result.url;
      }

      await prisma.skills.update({
        where: {
          id: skillId,
          usersId: user.id,
        },
        data: {
          skillName,
          skillLogo: skillLogoUrl,
        },
      });

      const newSkill = await prisma.skills.findMany({
        where: {
          usersId: user.id,
        },
      });

      return res.status(200).json({ data: newSkill });
    } catch (err) {
      console.error("Error updating skill:", err);
      return res.status(500).json(new Exceptions(500, err.message));
    }
  }
);

router.delete("/skills/:skillId", authenticated, async (req, res) => {
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
      const publicId = getImageKey(skill.skillLogo);
      try {
        await deleteImage(publicId);
      } catch (err) {
        throw new Error("Failed to delete image from Cloudinary");
      }
    }

    await prisma.skills.delete({
      where: {
        id: skillId,
        usersId: user.id,
      },
    });
    const newSkill = await prisma.skills.findMany({
      where: {
        usersId: user.id,
      },
    });

    return res.status(200).json({ data: newSkill });
  } catch (err) {
    return res.status(500).json(new Exceptions(500, err.message));
  }
});

export default router;
