import express from "express";
import prisma from "../database/db.js";
import checkUser from "../middlewares/checkUser.js";
import Exceptions from "../handlers/Exceptions.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/user", checkUser, async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    const userInfo = await prisma.users.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        ExperiencesList: true,
        ProjectsList: true,
        SkillsList: true,
      },
    });
    const bio = await prisma.bio.findFirst({
      where: {
        usersId: payload.id,
      },
    });
    const contacts = await prisma.contacts.findFirst({
      where: {
        usersId: payload.id,
      },
    });
    const layouts = await prisma.layouts.findFirst({
      where: {
        usersId: payload.id,
      },
    });
    const newToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("accessToken", newToken, { maxAge: 604800000 }); // expires in 7 days

    return res.status(200).json({ ...userInfo, bio, layouts, contacts });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.get("/:userId/user", async (req, res) => {
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
        ProjectsList: true,
        SkillsList: true,
        Testimonials: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json(new Exceptions(404, "this user doesn't exist"));
    } else {
      const bioInfo = await prisma.bio.findFirst({
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

      const bio = {
        ...bioInfo,
        heroImage: `${process.env.AWS_S3_BUCKET_DOMAIN}/${bioInfo.heroImage}`,
      };

      const newToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("accessToken", newToken, { maxAge: 604800000 }); // expires in 7 days

      return res.status(200).json({ ...user, bio, contacts, layouts });
    }
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
