import crypto from "crypto";
import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";
import authenticated from "../middlewares/authenticated.js";

import { upload } from "../configs/multer.js";
import { uploadImage, deleteImage, getPublicIdFromUrl } from "../utils/upload.js";
import { feedbackSchema } from "../utils/schemas.js";

const router = express.Router();

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
    let videoUrl;
    let profileUrl;
    try {
      if (!userId) {
        throw new Error("userId isn't defined ");
      }
      if (!files) {
        throw new Error("profile picture is required");
      }

      if (video) {
        const videoFile = video[0];
        try {
          const result = await uploadImage(videoFile.buffer, {
            folder: "folio/feedbacks",
            publicId: crypto.randomUUID(),
            resource_type: "video",
          });
          videoUrl = result.url;
        } catch (err) {
          res.status(500).json(new Exceptions(500, err.message));
        }
      }

      const profileResult = await uploadImage(profile[0].buffer, {
        folder: "folio/feedbacks",
        publicId: crypto.randomUUID(),
      });
      profileUrl = profileResult.url;

      const validFeedbackData = feedbackSchema.safeParse(payload);

      if (!validFeedbackData.success) {
        throw new Error("not valid data inputs");
      }

      await prisma.testimonials.create({
        data: {
          ...validFeedbackData.data,
          feedback: payload.feedback ? payload?.feedback : null,
          profile: profileUrl || null,
          video: videoUrl || null,
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
router.delete("/feedback/:feedbackId", authenticated, async (req, res) => {
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

    if (feedback.profile) {
      const publicId = getPublicIdFromUrl(feedback.profile);
      if (publicId) await deleteImage(publicId);
    }

    if (feedback.video) {
      const publicId = getPublicIdFromUrl(feedback.video);
      if (publicId) await deleteImage(publicId);
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
