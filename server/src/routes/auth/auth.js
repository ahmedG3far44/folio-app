import crypto from "crypto";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../../database/db.js";
import s3Client from "../../s3/s3Client.js";

import { upload } from "../skills.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

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
        role: true,
        resume: true,
        activeTheme: true,
      },
    });

    if (!user) throw new Error("this user not found!!");

    const hashedPassword = await bcrypt.hash(password, salt);

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) throw new Error("wrong email or password !!");

    const payload = {
      id: user.id,
      name: user.name,
      email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

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
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Body: file.buffer,
        Key: pictureKey,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);
    } catch (err) {
      res.status(500).json({ data: "error", message: err.message });
    }
    const theme = await prisma.theme.findMany();

    if (!theme || theme.length <= 0) {
      await prisma.theme.create({
        data: {
          themeName: "Dark",
          backgroundColor: "#0f172a",
          cardColor: "#1e293b",
          primaryText: "#f8fafc",
          secondaryText: "#94a3b8",
          borderColor: "#334155",
        },
      });
    }
    const newTheme = await prisma.theme.findMany();

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        picture: `${BUCKET_DOMAIN}/${pictureKey}`,
        activeTheme: theme ? theme[0].id : newTheme[0].id,
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
      email,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    await prisma.bio.create({
      data: {
        bio: "update your bio info...",
        bioName: newUser.name,
        jobTitle: "update your job title...",
        heroImage: `${BUCKET_DOMAIN}/${pictureKey}`,
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
