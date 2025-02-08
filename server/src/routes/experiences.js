import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../handlers/Exceptions.js";
import checkAccessUser from "../middlewares/checkAccessUser.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import s3Client from "../s3/s3Client.js";
import { experienceSchema } from "../schemas/validationSchemas.js";
import { upload } from "./skills.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import resizedImage from "../handlers/resizeImage.js";
import getImageKey from "../handlers/getImageKey.js";
// import verifyAccessToken from "../middlewares/verifyAccessToken.js";

const router = express.Router();

router.get("/:userId/experiences", async (req, res) => {
  try {
    const { userId } = req.params;
    const experiencesList = await prisma.experiences.findMany({
      where: {
        usersId: userId,
      },
    });
    if (!experiencesList) {
      return res.status(200).json({ experiencesList: "not items found" });
    }
    return res.status(200).json(experiencesList);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.post(
  "/:userId/experiences",
  upload.single("file"),
  checkUploadImageFormat,
  async (req, res) => {
    try {
      let uploadImgPath;
      const { userId } = req.params;
      const payload = req.body;
      const companyLogoImage = req.file;
      console.log(companyLogoImage);
      // console.log(payload);

      const validExperiencePayload = experienceSchema.safeParse(payload);
      console.log(validExperiencePayload.data);
      if (!validExperiencePayload.success) {
        const error = validExperiencePayload.error.flatten().fieldErrors;
        console.log(error);
        return res.status(400).json(new Exceptions(400, error));
      }
      uploadImgPath = `${userId}/experiences/${crypto.randomUUID()}`;

      const resizedCompanyLogoImage = await resizedImage(
        companyLogoImage.buffer,
        50,
        50,
        80
      );

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: uploadImgPath,
        Body: resizedCompanyLogoImage,
        ContentType: "image/webp",
      });

      await s3Client
        .send(command)
        .then(async (response) => {
          if (response.$metadata.httpStatusCode === 200) {
            console.log("upload company logo success");
            await prisma.experiences.create({
              data: {
                ...validExperiencePayload.data,
                cLogo: `https://presento-app.s3.amazonaws.com/${uploadImgPath}`,
                usersId: userId,
              },
            });
            console.log("a new experience was added to db");
            return res
              .status(201)
              .json(new Exceptions(201, "a new experiences was added."));
          }
        })
        .catch((error) => {
          console.log("upload cLogo error");
          return res.status(500).json(new Exceptions(500, error.message));
        });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);
router.put(
  "/:userId/experiences/:id",
  checkAccessUser,
  upload.single("file"),
  checkUploadImageFormat,
  async (req, res) => {
    try {
      const { userId, id } = req.params;
      const payload = req.body;
      const cLogoImage = req.file;

      const experience = await prisma.experiences.findUnique({
        where: {
          id,
          usersId: userId,
        },
      });

      if (!experience) {
        return res
          .status(404)
          .json(new Exceptions(404, "This experience not exist"));
      }
      console.log(payload);
      const validExperiencePayload = experienceSchema.safeParse(payload);
      if (!validExperiencePayload.success) {
        console.log(validExperiencePayload.error.issues);
        // validExperiencePayload.error.message.flatten().fieldErrors;
        throw new Error("not a valid experience data");
      }

      const experienceImageKey = getImageKey(experience.cLogo);
      const resizedExperienceImage = await resizedImage(
        cLogoImage.buffer,
        50,
        50,
        80
      );

      const uploadImageCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: experienceImageKey,
        Body: resizedExperienceImage,
        ContentType: "image/webp",
      });

      await s3Client
        .send(uploadImageCommand)
        .then(async (s3Response) => {
          if (s3Response.$metadata.httpStatusCode === 200) {
            console.log("company Logo image updated");

            await prisma.experiences.update({
              where: {
                id,
                usersId: userId,
              },
              data: { ...validExperiencePayload.data },
            });

            return res
              .status(200)
              .json(
                new Exceptions(
                  200,
                  "experience information was updated successfully"
                )
              );
          }
        })
        .catch((s3Error) => {
          return res.status(500).json(new Exceptions(500, s3Error.message));
        });
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.delete("/:userId/experiences/:id", checkAccessUser, async (req, res) => {
  try {
    const { userId, id } = req.params;
    const deletedItem = await prisma.experiences.findUnique({
      where: { id, usersId: userId },
    });

    if (!deletedItem) {
      return res
        .status(404)
        .json(new Exceptions(404, "This experience doesn't exist"));
    }

    const companyImageKey = getImageKey(deletedItem.cLogo);
    const deleteExperienceImageParams = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: companyImageKey,
    });

    await s3Client
      .send(deleteExperienceImageParams)
      .then(async () => {
        console.log("experience cLogo image deleted from s3");

        await prisma.experiences.delete({
          where: {
            id,
            usersId: userId,
          },
        });
        return res
          .status(200)
          .json(new Exceptions(200, "experience was deleted successfully."));
      })
      .catch((error) => {
        console.log("delete cLogo image failed.");
        return res.status(500).json(new Exceptions(500, error.message));
      });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
