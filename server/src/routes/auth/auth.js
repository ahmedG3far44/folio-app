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
        theme: {
          select: {
            id: true,
            themeName: true,
            backgroundColor: true,
            cardColor: true,
            primaryText: true,
            secondaryText: true,
            borderColor: true,
          },
        },
      },
    });

    if (!user) throw new Error("this user not found!!");

    const hashedPassowrd = await bcrypt.hash(password, salt);
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassowrd);
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
        theme: {
          select: {
            id: true,
            themeName: true,
            backgroundColor: true,
            cardColor: true,
            borderColor: true,
            secondaryText: true,
            primaryText: true,
          },
        },
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
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        picture: `${BUCKET_DOMAIN}/${pictureKey}`,
        theme: {
          create: {
            themeName: "Midnight Eclipse",
            backgroundColor: "#0a0a0a",
            cardColor: "#171717",
            primaryText: "#fafafa",
            secondaryText: "#a3a3a3",
            borderColor: "#262626",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        resume: true,
        theme: {
          select: {
            themeName: true,
            backgroundColor: true,
            cardColor: true,
            primaryText: true,
            secondaryText: true,
            borderColor: true,
          },
        },
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
        bio: "change your bio info...",
        bioName: newUser.name,
        jobTitle: "Change Your Job Title...",
        heroImage: `${BUCKET_DOMAIN}/${pictureKey}`,
        usersId: newUser.id,
      },
    });

    // await prisma.theme.create({
    //   data: {
    //     themeName: "midnight",
    //     backgroundColor: "#121212",
    //     cardColor: "#1F1F1F",
    //     primaryText: "#E0E0E0",
    //     secondaryText: "#B0B0B0",
    //     borderColor: "#5A5A5A",
    //     usersId: newUser.id,
    //   },
    // });

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
