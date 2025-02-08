import dotenv from "dotenv";
import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../handlers/Exceptions.js";
import s3Client from "../s3/s3Client.js";
import { upload } from "./skills.js";
import { bioSchema } from "../schemas/validationSchemas.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import sharp from "sharp";
// import verifyAccessToken from "../middlewares/verifyAccessToken.js";
dotenv.config();

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
    console.log("get bio info ");

    return res.status(200).json({
      ...bio,
      heroImage: `${process.env.AWS_S3_BUCKET_DOMAIN}/${bio.heroImage}`,
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});
router.put("/:userId/bio/:bioId", async (req, res) => {
  const { userId, bioId } = req.params;
  const payload = req.body;
  try {
    const validBioPayload = bioSchema.safeParse(payload);
    if (!validBioPayload.success) {
      console.log(validBioPayload.error.flatten().fieldErrors);
      return res.json(new Exceptions(404, "Bad request not valid data"));
    }

    const { name, summary, jobTitle } = validBioPayload?.data;

    await prisma.bio.update({
      where: {
        id: bioId,
        usersId: userId,
      },
      data: {
        bio: summary,
        bioName: name,
        jobTitle,
      },
    });

    console.log("updated bio info in db success ");
    return res.status(200).json(new Exceptions(200, "bio info was updated"));
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.post(
  "/:userId/upload-image/:bioId",
  upload.single("hero-image"),
  checkUploadImageFormat,
  async (req, res) => {
    const { userId, bioId } = req.params;
    const image = req.file;
    let fileKeyPath;
    const bio = await prisma.bio.findUnique({
      where: {
        usersId: userId,
        id: bioId,
      },
      select: {
        heroImage: true,
      },
    });

    // resize the image and compress it to 80% and change the image format to .webp
    const resizedImage = await sharp(image.buffer)
      .resize(320, 320, { withoutEnlargement: true, fit: "cover" })
      .toFormat("webp")
      .keepMetadata()
      .webp({ quality: 80 })
      .toBuffer();

    // .toBuffer();

    if (!bio.heroImage) {
      fileKeyPath = `${userId}/bio/${crypto.randomUUID()}`;

      // console.log(resizedImage);

      const uploadHeroCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKeyPath,
        Body: resizedImage,
        ContentType: "image/webp",
      });

      await s3Client
        .send(uploadHeroCommand)
        .then(async () => {
          await prisma.bio.update({
            where: {
              usersId: userId,
              id: bioId,
            },
            data: {
              heroImage: fileKeyPath,
            },
          });
          console.log("update url path in db");
          return res
            .status(200)
            .json(
              new Exceptions(
                200,
                `${process.env.AWS_S3_BUCKET_DOMAIN}/${fileKeyPath}`
              )
            );
        })
        .catch((error) => {
          console.log("failed to upload  hero image");
          return res.status(500).json(new Exceptions(500, error.message));
        });
    } else {
      // console.log(resizedImage);
      const uploadHeroCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: bio.heroImage,
        Body: resizedImage,
        ContentType: "image/webp",
      });

      await s3Client
        .send(uploadHeroCommand)
        .then(() => {
          console.log("updated old hero image successfully");
          return res
            .status(200)
            .json(
              new Exceptions(
                200,
                `${process.env.AWS_S3_BUCKET_DOMAIN}/${bio.heroImage}`
              )
            );
        })
        .catch((error) => {
          console.log("failed to upload  hero image");
          return res.status(500).json(new Exceptions(500, error.message));
        });
    }
  }
);

export default router;
