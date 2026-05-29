import crypto from "crypto";
import express from "express";
import prisma from "../configs/db.js";
import resizedImage from "../utils/resizeImage.js";
import getImageKey from "../utils/getImageKey.js";
import Exceptions from "../utils/Exceptions.js";
import authenticated from "../middlewares/authenticated.js";
import verifyUploading from "../middlewares/verifyUploading.js";

import { upload } from "../configs/multer.js";
import { uploadImage, deleteImage } from "../utils/upload.js";
import { experienceSchema } from "../utils/schemas.js";

const router = express.Router();

router.get("/experiences", authenticated, async (req, res) => {
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
  authenticated,
  verifyUploading,
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

      const resizedCompanyLogoImage = await resizedImage(
        image.buffer,
        50,
        50,
        80
      );

      const result = await uploadImage(resizedCompanyLogoImage, {
        folder: "folio/experiences",
        publicId: crypto.randomUUID(),
      });

      await prisma.experiences.create({
        data: {
          ...validExperiencePayload.data,
          cLogo: result.url,
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
  authenticated,
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
        const publicId = getImageKey(experience.cLogo);
        const resizedExperienceImage = await resizedImage(
          image.buffer,
          50,
          50,
          80
        );

        await uploadImage(resizedExperienceImage, {
          folder: "folio/experiences",
          publicId,
        });
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
  authenticated,
  async (req, res) => {
    try {
      const user = req.user;
      const { experience_id } = req.params;

      const experience = await prisma.experiences.findUnique({
        where: { id: experience_id, usersId: user.id },
      });

      if (!experience) throw new Error("This experience doesn't exist!!");

      if (experience.cLogo) {
        const publicId = getImageKey(experience.cLogo);
        try {
          await deleteImage(publicId);
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
