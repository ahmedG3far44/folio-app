import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const router = express.Router();

router.post("/user", verifyAccessToken, async (req, res) => {
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

export default router;
