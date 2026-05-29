import crypto from "crypto";
import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";
import authenticated from "../middlewares/authenticated.js";

import { upload } from "../configs/multer.js";
import { uploadResume } from "../utils/upload.js";

const router = express.Router();

router.get("/resume", authenticated, async (req, res) => {
  try {
    const user = req.user;
    const resumeUrl = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      select: {
        resume: true,
      },
    });
    if (!resumeUrl.resume) {
      return res.status(404).json(new Exceptions(404, "not found item"));
    }
    return res.status(200).json({
      resume: resumeUrl.resume,
    });
  } catch (error) {
    return res.status(200).json(new Exceptions(500, error.message));
  }
});

router.get("/:userId/resume", async (req, res) => {
  try {
    const { userId } = req.params;
    const resumeUrl = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        resume: true,
      },
    });
    if (!resumeUrl.resume) {
      return res.status(404).json(new Exceptions(404, "not found item"));
    }
    return res.status(200).json({
      resume: resumeUrl.resume,
    });
  } catch (error) {
    return res.status(200).json(new Exceptions(500, error.message));
  }
});

router.post(
  "/resume",
  authenticated,
  upload.single("resume"),
  async (req, res) => {
    const user = req.user;
    const resumeFile = req.file;

    if (!validResumeFile(resumeFile)) {
      throw new Error("resume format not accepted!!");
    }

    try {
      const result = await uploadResume(resumeFile.buffer, resumeFile.mimetype, "folio/resumes");

      const resume = await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          resume: result.url,
        },
        select: {
          id: true,
          resume: true,
        },
      });

      res.status(201).json({
        success: "a cv file uploaded successfully",
        ...resume,
        url: result.url,
      });
    } catch (error) {
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.put(
  "/resume",
  authenticated,
  upload.single("resume"),
  async (req, res) => {
    const user = req.user;
    const newCvFile = req.file;

    if (!validResumeFile(newCvFile)) {
      throw new Error("resume format not accepted!!");
    }

    const userCvKeyName = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      select: {
        resume: true,
      },
    });

    if (!userCvKeyName.resume) {
      throw new Error("user cv not found");
    }

    try {
      const result = await uploadResume(newCvFile.buffer, newCvFile.mimetype, "folio/resumes");

      const url = result.url;

      return res.status(201).json({
        success: "a cv file updated",
        url,
      });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

export default router;

export function validResumeFile(file) {
  const supportedFilesTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];
  if (supportedFilesTypes.includes(file.mimetype)) {
    if (file.size > 4000000) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}
