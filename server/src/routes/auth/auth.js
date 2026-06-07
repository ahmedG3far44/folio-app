import crypto from "crypto";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../../configs/db.js";
import { env } from "../../configs/env.js";

import { upload } from "../../configs/multer.js";
import { uploadImage } from "../../utils/upload.js";

const router = express.Router();

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = 10;

    if (!email || !password)
      throw new Error("The email or password is wrong!!");

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        password: true,
        role: true,
        resume: true,
        activeTheme: true,
      },
    });

    if (!user) throw new Error("this user not found!!");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw new Error("wrong email or password !!");

    const payload = {
      id: user.id,
      name: user.name,
      email,
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE_IN });

    return res
      .status(200)
      .json({ data: { user, token }, message: "a user login success" });
  } catch (err) {
    return res.status(500).json({ data: "Error", message: err.message });
  }
});

router.post("/auth/register", upload.single("profile"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const file = req.file;

    const salt = 10;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        resume: true,
        activeTheme: true,
      },
    });

    if (user) throw new Error("This user already exist!!");

    const hashedPassword = await bcrypt.hash(password, salt);

    const pictureKey = `${crypto.randomUUID()}`;
    let pictureUrl;

    try {
      const result = await uploadImage(file.buffer, {
        folder: "folio/profiles",
        publicId: pictureKey,
      });
      pictureUrl = result.url;
    } catch (err) {
      return res.status(500).json({ data: "error", message: err.message });
    }

    const themes = await prisma.theme.findMany();

    if (themes.length === 0) {
      await prisma.theme.create({
        data: {
          themeName: "Midnight",
          backgroundColor: "#0c0a0e",
          cardColor: "#17131a",
          primaryText: "#f5f3f7",
          secondaryText: "#9a94a3",
          borderColor: "#2a2530",
        },
      });
    }

    const allThemes = await prisma.theme.findMany();

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        picture: pictureUrl,
        activeTheme: allThemes[0].id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        resume: true,
        activeTheme: true,
      },
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      picture: pictureUrl,
      role: newUser.role,
      email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE_IN });

    await prisma.bio.create({
      data: {
        bio: "update your bio info...",
        bioName: newUser.name,
        jobTitle: "update your job title...",
        heroImage: pictureUrl,
        usersId: newUser.id,
      },
    });

    await prisma.contacts.create({
      data: {
        usersId: newUser.id,
      },
    });

    await prisma.layouts.create({
      data: {
        usersId: newUser.id,
      },
    });

    return res.status(201).json({
      data: { user: newUser, token },
      message: "a new user was created!",
    });
  } catch (err) {
    return res.status(500).json({ data: "Error", message: err.message });
  }
});

export default router;
