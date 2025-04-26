import sharp from "sharp";
import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import s3Client from "../s3/s3Client.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
// import resizedImage from "../utils/resizeImage.js";
import getImageKey from "../utils/getImageKey.js";

import { upload } from "./skills.js";
import { projectSchema } from "../utils/schemas.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const BUCKET_DOMAIN = process.env.AWS_S3_BUCKET_DOMAIN;

const router = express.Router();

router.post(
  "/project",
  verifyAccessToken,
  upload.any(),
  checkUploadImageFormat,
  async (req, res) => {
    try {
      const user = req.user;
      const payload = req.body;
      const projectImages = req.files;
      let keysArray = [];

      console.log(payload);

      const projectNumbers = await prisma.projects.count({
        where: {
          usersId: user.id,
        },
      });

      if (projectNumbers > 10) {
        throw new Error("your are not able to add more  than 10 project!!");
      }

      const validProjectData = projectSchema.safeParse(payload);

      if (!validProjectData?.success) {
        console.log(validProjectData.error.flatten().fieldErrors);
        return res
          .status(400)
          .json(new Exceptions(400, "not valid project data."));
      }

      console.log(projectImages);

      console.log(validProjectData.data);

      const { title, description, sourceUrl, tags } = validProjectData?.data;

      let thumbnailKey;
      let imageKey;

      projectImages.map(async (image, index) => {
        if (image.fieldname === "image") {
          imageKey = `original-${index + 1}-${crypto.randomUUID()}`;
          keysArray.push(imageKey);
        } else {
          thumbnailKey = `thumb-${crypto.randomUUID()}`;
        }
        await uploadToS3(
          image,
          image.fieldname === "image" ? imageKey : thumbnailKey
        );
      });

      await prisma.projects.create({
        data: {
          title,
          description,
          thumbnail: `${BUCKET_DOMAIN}/${thumbnailKey}`,
          source: sourceUrl,
          ImagesList: {
            createMany: {
              data: keysArray.map((url) => {
                return {
                  url: `${BUCKET_DOMAIN}/${url}`,
                };
              }),
            },
          },
          tags: {
            createMany: {
              data: tags.map((tagName) => {
                return {
                  tagName,
                };
              }),
            },
          },
          usersId: user.id,
        },
      });
      console.log("project basic info was created ");

      return res
        .status(201)
        .json(new Exceptions(201, "a new project was created"));
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.get("/project", verifyAccessToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user) throw new Error("user not found!!");

    const projectsList = await prisma.projects.findMany({
      where: {
        usersId: user.id,
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        description: true,
        source: true,
        tags: {
          select: {
            id: true,
            tagName: true,
          },
        },
        ImagesList: {
          select: {
            id: true,
            url: true,
          },
        },
        likes: true,
        views: true,
      },
    });

    if (!projectsList) throw new Error("not found projects!!");

    res.status(200).json(projectsList);
  } catch (error) {
    res.status(500).json(new Exceptions(500, error.message));
  }
});

router.get("/project/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) throw new Error("user not found!!");

    const projectsList = await prisma.projects.findMany({
      where: {
        usersId: userId,
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        description: true,
        source: true,
        tags: {
          select: {
            id: true,
            tagName: true,
          },
        },
        ImagesList: {
          select: {
            id: true,
            url: true,
          },
        },
        likes: true,
        views: true,
      },
    });

    if (!projectsList) throw new Error("not found projects!!");

    res.status(200).json(projectsList);
  } catch (error) {
    res.status(500).json(new Exceptions(500, error.message));
  }
});

router.get("/:userId/project/:projectId", async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await prisma.projects.findUnique({
      where: {
        id: projectId,
        usersId: userId,
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        description: true,
        tags: {
          select: {
            id: true,
            tagName: true,
          },
        },
        ImagesList: {
          select: {
            id: true,
            url: true,
          },
        },
        likes: true,
        views: true,
      },
    });
    if (!project) {
      return res
        .status(404)
        .json(new Exceptions(404, "this project doesn't exist"));
    }
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.put(
  "/project/:projectId",
  verifyAccessToken,
  upload.none(),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const user = req.user;
      const payload = req.body;

      const validProjectData = projectSchema.safeParse(payload);

      if (!validProjectData.success) {
        console.log(validProjectData.error.flatten().fieldErrors);
        return res
          .status(404)
          .json(new Exceptions(404, "Bad request not a valid data."));
      }
      const { title, description, sourceUrl } = validProjectData.data;
      await prisma.projects.update({
        where: {
          id: projectId,
          usersId: user.id,
        },
        data: {
          title,
          description,
          source: sourceUrl,
        },
      });

      return res
        .status(200)
        .json(new Exceptions(200, "updated project info success."));
    } catch (error) {
      return res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.delete("/project/:projectId", verifyAccessToken, async (req, res) => {
  const user = req.user;
  const { projectId } = req.params;

  let deletedProjectImageUrls = [];
  try {
    const project = await prisma.projects.findUnique({
      where: {
        id: projectId,
        usersId: user.id,
      },
      select: {
        ImagesList: true,
        id: true,
        tags: true,
        thumbnail: true,
      },
    });

    if (!project) {
      throw new Error("This project doesn't exsit!!");
    }

    deletedProjectImageUrls.push(getImageKey(project.thumbnail));

    project.ImagesList.map((image) => {
      let key = getImageKey(image?.url);
      deletedProjectImageUrls.push(key);
    });

    console.log(deletedProjectImageUrls);

    deletedProjectImageUrls.map(async (keyUrl) => {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: keyUrl,
      });

      try {
        await s3Client.send(command);
      } catch (err) {
        res.status(500).json(new Exceptions(500, err.message));
      }
    });

    await prisma.tags.deleteMany({
      where: {
        projectsId: projectId,
      },
    });

    await prisma.imagesList.deleteMany({
      where: {
        projectsId: projectId,
      },
    });
    console.log("all images deleted");

    await prisma.projects.delete({
      where: {
        id: projectId,
        usersId: user.id,
      },
    });
    console.log("the project deleted successful");

    res.status(200).json(new Exceptions(200, "project deleted successful."));
  } catch (error) {
    console.log(error.message);
    res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;

export async function uploadToS3(image, path) {
  const result = await sharp(image.buffer)
    .resize({
      width: 800,
      height: Math.round(800 * 0.5625),
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("webp", {
      quality: 80,
      alphaQuality: 90,
      effort: 6,
    })
    .toBuffer();

  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
    Body: result,
    ContentType: image.mimetype,
  };
  try {
    const command = new PutObjectCommand(params);

    const uploadProjectImages = await s3Client.send(command);

    if (uploadProjectImages.$metadata.httpStatusCode !== 200) {
      throw new Error("failed to upload img");
    }

    const imgURL = `${BUCKET_DOMAIN}/${path}`;
    return imgURL;
  } catch (error) {
    console.log(error.message);
    return error;
  }
}
