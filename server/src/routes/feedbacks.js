import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../handlers/Exceptions.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import { uploadToS3 } from "./projects.js";
import { upload } from "./skills.js";
import { feedbackSchema } from "../schemas/validationSchemas.js";
import s3Client from "../s3/s3Client.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

router.post(
  "/:userId/feedback",
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

      //   console.log(video[0]);
      //   console.log(profile[0]);
      console.log(userId);

      if (video) {
        // upload video
        // update profile & video url in db
        clientVideoKey = `${userId}/feedbacks/video_${crypto.randomUUID()}`;
        await uploadToS3(video[0], clientVideoKey);
      }
      clientProfileKey = `${userId}/feedbacks/profile_${crypto.randomUUID()}`;
      await uploadToS3(profile[0], clientProfileKey);
      // update profile url in db

      const validFeedbackData = feedbackSchema.safeParse(payload);
      if (!validFeedbackData.success) {
        throw new Error("not valid data inputs");
      }

      const feedback = await prisma.testimonials.create({
        data: {
          ...validFeedbackData.data,
          feedback: payload.feedback ? payload?.feedback : null,
          profile: clientProfileKey
            ? `${process.env.AWS_S3_BUCKET_DOMAIN}/${clientProfileKey}`
            : null,
          video: clientVideoKey
            ? `${process.env.AWS_S3_BUCKET_DOMAIN}/${clientVideoKey}`
            : null,
          usersId: userId,
        },
      });
      //   console.log(files.length);

      //   files.map(async (file) => {
      //     keyPath = `${userId}/feedbacks/${crypto.randomUUID()}`;
      //     const params = {
      //       Bucket: process.env.AWS_S3_BUCKET_NAME,
      //       Key: keyPath,
      //       Body: file.buffer,
      //       ContentType: file.mimetype,
      //     };
      //     const command = new PutObjectCommand(params);
      //     const uploadFeedbacks = await s3Client.send(command);
      //     await uploadToS3(file, keyPath);
      //     console.log(uploadFeedbacks.$metadata.httpStatusCode, "status s3 code");
      //     //   console.log(file.buffer);
      //   });

      return res.status(201).json({
        uploadedState: "uploaded profile & video success",
        feedback,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.get("/:userId/feedback", async (req, res) => {
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
router.delete("/:userId/feedback/:feedbackId", async (req, res) => {
  const { userId, feedbackId } = req.params;

  try {
    const feedback = await prisma.testimonials.findUnique({
      where: {
        id: feedbackId,
        usersId: userId,
      },
    });
    //=====================================
    if (!feedback) {
      throw new Error("this items doesn't exist");
    }
    //=====================================

    const deleteProfileParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: feedback.profile,
    };

    await s3Client.send(new DeleteObjectCommand(deleteProfileParams));
    console.log("feedback profile picture was deleted from S3");

    //=====================================
    if (feedback.video) {
      const deleteVideoFeedbackParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: feedback.video,
      };
      await s3Client.send(new DeleteObjectCommand(deleteVideoFeedbackParams));
      console.log("feedback video was deleted from S3");
    }

    //=====================================
    await prisma.testimonials.delete({
      where: {
        id: feedbackId,
        usersId: userId,
      },
    });
    console.log("feedback deleted successful");

    // ====================================

    return res
      .status(200)
      .json(new Exceptions(200, "feedback deleted successful."));
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
