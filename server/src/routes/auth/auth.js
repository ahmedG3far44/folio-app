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

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        password: true,
        role: true,
        resume: true,
        activeTheme: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email,
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE_IN,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      data: { user: userWithoutPassword, token },
      message: "Login successful",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/auth/register", upload.single("profile"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let pictureUrl = null;
    const file = req.file;

    if (file) {
      try {
        const pictureKey = `${crypto.randomUUID()}`;
        const result = await uploadImage(file.buffer, {
          folder: "folio/profiles",
          publicId: pictureKey,
        });
        pictureUrl = result.url;
      } catch (err) {
        return res.status(500).json({ message: "Failed to upload profile picture." });
      }
    }

    const themes = await prisma.theme.findMany();

    if (themes.length === 0) {
      await prisma.theme.create({
        data: {
          themeName: "Midnight",
          backgroundColor: "#0a0a0a",
          cardColor: "#171717",
          primaryText: "#fafafa",
          secondaryText: "#a3a3a3",
          borderColor: "#262626",
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

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE_IN,
    });

    await prisma.bio.create({
      data: {
        bio: "update your bio info...",
        bioName: newUser.name,
        jobTitle: "update your job title...",
        heroImage: pictureUrl || "",
        usersId: newUser.id,
      },
    });

    await prisma.contacts.create({
      data: { usersId: newUser.id },
    });

    await prisma.layouts.create({
      data: { usersId: newUser.id },
    });

    return res.status(201).json({
      data: { user: newUser, token },
      message: "Account created successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
