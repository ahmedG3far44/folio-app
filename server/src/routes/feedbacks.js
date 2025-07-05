import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";
import s3Client from "../s3/s3Client.js";
import crypto from "crypto";

import { upload } from "./skills.js";
import { uploadToS3 } from "./projects.js";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { feedbackSchema } from "../utils/schemas.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const router = express.Router();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

router.post(
  "/feedback/:userId",
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "profile",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    const { userId } = req.params;
    const payload = req.body;
    const files = req.files;
    const { profile, video } = req.files;
    let clientVideoKey;
    let clientProfileKey;
    try {
      if (!userId) {
        throw new Error("userId isn't defined ");
      }
      if (!files) {
        throw new Error("profile picture is required");
      }

      if (video) {
        clientVideoKey = `${crypto.randomUUID()}`;
       
        const videoFile = video[0];
        try {
          await s3Client.send(
            new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: clientVideoKey,
              Body: videoFile.buffer,
              ContentType: videoFile.mimetyep,
            })
          );
        } catch (err) {
          res.status(500).json(new Exceptions(500, err.message));
        }
      }

      clientProfileKey = `${crypto.randomUUID()}`;
      await uploadToS3(profile[0], clientProfileKey);

      const validFeedbackData = feedbackSchema.safeParse(payload);

      if (!validFeedbackData.success) {
        throw new Error("not valid data inputs");
      }

      await prisma.testimonials.create({
        data: {
          ...validFeedbackData.data,
          feedback: payload.feedback ? payload?.feedback : null,
          profile: clientProfileKey
            ? `${BUCKET_DOMAIN}/${clientProfileKey}`
            : null,
          video: clientVideoKey ? `${BUCKET_DOMAIN}/${clientVideoKey}` : null,
          usersId: userId,
        },
      });
      const newFeedback = await prisma.testimonials.findMany({
        where: {
          usersId: userId,
        },
      });
      res.status(201).json({
        data: newFeedback,
        message: "a new experiences was added.",
      });
    } catch (error) {
     
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.get("/feedback/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const feedbackList = await prisma.testimonials.findMany({
      where: {
        usersId: userId,
      },
    });
    return res.status(200).json(feedbackList);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});
router.delete("/feedback/:feedbackId", verifyAccessToken, async (req, res) => {
  const user = req.user;
  const { feedbackId } = req.params;
  

  try {
    const feedback = await prisma.testimonials.findUnique({
      where: {
        id: feedbackId,
        usersId: user.id,
      },
    });

    if (!feedback) {
      throw new Error("this items doesn't exist");
    }

    const deleteProfileParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: feedback.profile,
    };

    await s3Client.send(new DeleteObjectCommand(deleteProfileParams));
  

    if (feedback.video) {
      const deleteVideoFeedbackParams = {
        Bucket: BUCKET_NAME,
        Key: feedback.video,
      };
      await s3Client.send(new DeleteObjectCommand(deleteVideoFeedbackParams));
    
    }

    await prisma.testimonials.delete({
      where: {
        id: feedbackId,
        usersId: user.id,
      },
    });
  
    const newFeedback = await prisma.testimonials.findMany({
      where: {
        usersId: user.id,
      },
    });
    res
      .status(200)
      .json({ data: newFeedback, message: "feedback deleted successful." });
  } catch (error) {
    res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
