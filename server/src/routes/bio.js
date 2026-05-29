import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";

import authenticated from "../middlewares/authenticated.js";
import verifyUploading from "../middlewares/verifyUploading.js";

import { upload } from "../configs/multer.js";
import { uploadImage } from "../utils/upload.js";
import { bioSchema } from "../utils/schemas.js";
import {
  getBioWithImage,
  processImage,
  generateFileKey,
  updateBioImage,
} from "../utils/helpers.js";

const router = express.Router();

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

    return res.status(200).json(bio);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});
router.put("/bio/:bioId", authenticated, async (req, res) => {
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
  authenticated,
  upload.single("hero-image"),
  verifyUploading,
  async (req, res) => {
    try {
      const {
        user,
        file: image,
        params: { bioId },
      } = req;

      const bio = await getBioWithImage(user.id, bioId);

      const resizedImage = await processImage(image);
      const fileKeyPath = generateFileKey();
      const result = await uploadImage(resizedImage, {
        folder: "folio/bio",
        publicId: fileKeyPath,
      });

      await updateBioImage(user.id, bioId, result.url);

      res.status(200).json(new Exceptions(200, result.url));
    } catch (error) {
      console.error("Error uploading hero image:", error.message);
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

export default router;
