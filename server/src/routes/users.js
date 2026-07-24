import crypto from "crypto";
import sharp from "sharp";
import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";
import authenticated from "../middlewares/authenticated.js";
import { upload } from "../configs/multer.js";
import { uploadImage } from "../utils/upload.js";

const router = express.Router();

router.post("/user", authenticated, async (req, res) => {
  try {
    const user = req.user;
    const userInfo = await prisma.users.findFirst({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        Bio: true,
        ExperiencesList: true,
        ProjectsList: true,
        activeTheme: true,
        SkillsList: true,
      },
    });

    const bio = await prisma.bio.findFirst({
      where: {
        usersId: user.id,
      },
    });

    const contacts = await prisma.contacts.findFirst({
      where: {
        usersId: user.id,
      },
    });

    const layouts = await prisma.layouts.findFirst({
      where: {
        usersId: user.id,
      },
    });

    return res.status(200).json({ ...userInfo, bio, layouts, contacts });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.users.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        picture: true,
        resume: true,
        role: true,
        ExperiencesList: true,
        ProjectsList: {
          select: {
            id: true,
            thumbnail: true,
            title: true,
            description: true,
            tags: true,
            ImagesList: true,
            source: true,
            updatedAt: true,
            createdAt: true,
          },
        },
        SkillsList: true,
        Testimonials: true,
        activeTheme: true,
        createdAt: true,
      },
    });
    const bio = await prisma.bio.findFirst({
      where: {
        usersId: userId,
      },
    });

    const contacts = await prisma.contacts.findFirst({
      where: {
        usersId: userId,
      },
    });
    const layouts = await prisma.layouts.findFirst({
      where: {
        usersId: userId,
      },
    });
    return res.status(200).json({
      data: { user, bio, layouts, contacts },
      message: "getting user data success ",
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.put(
  "/user/profile-picture",
  authenticated,
  upload.single("picture"),
  async (req, res) => {
    try {
      const user = req.user;
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      const compressed = await sharp(req.file.buffer)
        .resize(400, 400, { fit: "cover", position: "center" })
        .toFormat("webp", { quality: 85 })
        .toBuffer();

      const result = await uploadImage(compressed, {
        folder: "folio/profiles",
        publicId: crypto.randomUUID(),
      });

      const [updated] = await Promise.all([
        prisma.users.update({
          where: { id: user.id },
          data: { picture: result.url },
          select: { id: true, name: true, email: true, picture: true, role: true, resume: true, activeTheme: true },
        }),
        prisma.bio.updateMany({
          where: { usersId: user.id },
          data: { heroImage: result.url },
        }),
      ]);

      return res.status(200).json({ data: updated, message: "Profile picture updated" });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

export default router;
