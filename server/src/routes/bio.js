import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";

import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";

import { upload } from "./skills.js";
import { bioSchema } from "../utils/schemas.js";
import {
  getBioWithImage,
  processImage,
  uploadToS3,
  generateFileKey,
  updateBioImage,
} from "../utils/helpers.js";

const router = express.Router();

const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

router.get("/:userId/bio", async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.json(new Exceptions(404, "Bad request not valid user"));
    }
    const bio = await prisma.bio.findFirst({
      where: {
        usersId: userId,
      },
    });
    if (!bio) {
      return res.status(404).json(Exceptions(404, "bio not found"));
    }
    

    return res.status(200).json({
      ...bio,
      heroImage: bio.heroImage
        ? `${process.env.AWS_S3_BUCKET_DOMAIN}/${bio.heroImage}`
        : null,
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});
router.put("/bio/:bioId", verifyAccessToken, async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const { bioId } = req.params;

  try {
    const validBioPayload = bioSchema.safeParse(payload);

    if (!validBioPayload.success) {
      const error = validBioPayload.error.flatten().fieldErrors;
      let errorMessage = "";
      Object.keys(error).forEach((key) => {
        errorMessage += error[key] + " ";
      });
     
      throw new Error(`error in bio payload  ${errorMessage}`);
    }

    const { name, jobTitle, summary } = validBioPayload?.data;

    await prisma.bio.update({
      where: {
        id: bioId,
        usersId: user.id,
      },
      data: {
        bio: summary,
        bioName: name,
        jobTitle,
      },
    });

  
    const bio = await prisma.bio.findFirst({
      where: {
        id: bioId,
        usersId: user.id,
      },
    });
    res.status(200).json({ data: bio, message: "bio info was updated" });
  } catch (error) {
    res.status(500).json(new Exceptions(500, error.message));
  }
});

router.post(
  "/upload-image/:bioId",
  verifyAccessToken,
  upload.single("hero-image"),
  checkUploadImageFormat,
  async (req, res) => {
    try {
      const {
        user,
        file: image,
        params: { bioId },
      } = req;

      // Validate bio exists for this user
      const bio = await getBioWithImage(user.id, bioId);

      // Process and upload image
      const resizedImage = await processImage(image);
      const fileKeyPath = generateFileKey();
      await uploadToS3(fileKeyPath, resizedImage, image.mimetype);

      // Update bio with new image URL
      const imageUrl = `${BUCKET_DOMAIN}/${fileKeyPath}`;
      await updateBioImage(user.id, bioId, imageUrl);

      res.status(200).json(new Exceptions(200, imageUrl));
    } catch (error) {
      console.error("Error uploading hero image:", error.message);
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

// Helper functions

export default router;
