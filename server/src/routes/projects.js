import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../handlers/Exceptions.js";
import checkAccessUser from "../middlewares/checkAccessUser.js";
import { projectSchema } from "../schemas/validationSchemas.js";
import checkUploadImageFormat from "../middlewares/checkUploadImageFormat.js";
import { upload } from "./skills.js";
import s3Client from "../s3/s3Client.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import sharp from "sharp";
// import resizedImage from "../handlers/resizeImage.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post(
  "/:userId/project",
  upload.any(),
  checkUploadImageFormat,
  async (req, res) => {
    try {
      const payload = req.body;
      const { userId } = req.params;
      const projectImages = req.files;
      const projectId = crypto.randomUUID();
      let keysArray = [];

      const projectNumbers = await prisma.projects.count({
        where: {
          usersId: userId,
        },
      });

      if (projectNumbers > 10) {
        return res
          .status(400)
          .json(
            new Exceptions(
              400,
              "you where not be able to add more than 10 projects"
            )
          );
      }

      const validProjectData = projectSchema.safeParse(payload);

      if (!validProjectData?.success) {
        console.log(validProjectData.error.flatten().fieldErrors)
        return res
          .status(400)
          .json(new Exceptions(400, "not valid project data."));
      }

      console.log(projectImages);

      console.log(validProjectData.data);

      const { title, description, sourceUrl, tags } = validProjectData?.data;

      let thumbnailKey;
      let imageKey;
      console.log("valid ")
      projectImages.map(async (image, index) => {
        if (image.fieldname === "images") {
          imageKey = `${userId}/projects/${projectId}/photo-${index + 1}`;
          keysArray.push(imageKey);
        } else {
          thumbnailKey = `${userId}/projects/${projectId}/thumbnail-photo`;
        }
        await uploadToS3(
          image,
          image.fieldname === "images" ? imageKey : thumbnailKey
        );
      });

      await prisma.projects.create({
        data: {
          title,
          description,
          thumbnail: `${process.env.AWS_S3_BUCKET_DOMAIN}/${thumbnailKey}`,
          source: sourceUrl,
          ImagesList: {
            createMany: {
              data: keysArray.map((url) => {
                return {
                  url: `${process.env.AWS_S3_BUCKET_DOMAIN}/${url}`,
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
          usersId: userId,
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

router.get("/:userId/project/:projectId", async (req, res) => {
  try {
    const { userId, projectId } = req.params;

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

router.get("/:userId/project", async (req, res) => {
  try {
    const { userId } = req.params;

    const projectsList = await prisma.projects.findMany({
      where: {
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
    if (!projectsList) {
      return res
        .status(404)
        .json(new Exceptions(404, "this project doesn't exist"));
    }
    return res.status(200).json(projectsList);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.put("/:userId/project/:projectId", checkAccessUser, async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const payload = req.body;
    const validProjectData = projectSchema.safeParse(payload);
    if (!validProjectData.success) {
      return res
        .status(404)
        .json(new Exceptions(404, "Bad request not a valid data."));
    }

    //==============================================
    const { title, thumbnail, likes, views, description } =
      validProjectData.data;
    await prisma.projects.update({
      where: {
        id: projectId,
        usersId: userId,
      },
      data: {
        title,
        thumbnail,
        description,
        likes,
        views,
      },
    });

    return res
      .status(200)
      .json(new Exceptions(200, "updated project info success."));
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.delete(
  "/:userId/project/:projectId",
  checkAccessUser,
  async (req, res) => {
    const { userId, projectId } = req.params;

    let deletedProjectImageUrls = [];
    try {
      const project = await prisma.projects.findUnique({
        where: {
          id: projectId,
          usersId: userId,
        },
        select: {
          ImagesList: true,
          id: true,
          tags: true,
          thumbnail: true,
        },
      });

      if (!project) {
        return res
          .status(404)
          .json(new Exceptions(404, "this project doesn't exist"));
      }

      // const deleteProjectImagesPath = project.thumbnail
      //   .split("/")
      //   .slice(0, 3)
      //   .join("/");

      deletedProjectImageUrls.push(splitImageUrl(project.thumbnail));

      project.ImagesList.map((image) => {
        let key = splitImageUrl(image?.url);
        deletedProjectImageUrls.push(key);
      });

      console.log(deletedProjectImageUrls);

      deletedProjectImageUrls.map(async (keyUrl) => {
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: keyUrl,
        });

        await s3Client
          .send(command)
          .then(async () => {
            console.log(`${keyUrl}, was deleted from s3`);
          })
          .catch((s3Error) => {
            return res.status(500).json(new Exceptions(500, s3Error.message));
          });
      });

      await prisma.tags.deleteMany({
        where: {
          projectsId: projectId,
        },
      });
      console.log("all tags deleted");
      await prisma.imagesList.deleteMany({
        where: {
          projectsId: projectId,
        },
      });
      console.log("all images deleted");

      await prisma.projects.delete({
        where: {
          id: projectId,
          usersId: userId,
        },
      });
      console.log("the project deleted successful");

      return res
        .status(200)
        .json(new Exceptions(200, "project deleted successful"));
    } catch (error) {
      console.log(error.message);
      return res.status(400).json(new Exceptions(400, error.message));
    }
  }
);

export default router;

export async function uploadToS3(image, path) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: path,
    Body: image.buffer,
    ContentType: image.mimetype,
  };
  try {
    const command = new PutObjectCommand(params);
    const uploadProjectImages = await s3Client.send(command);
    if (uploadProjectImages.$metadata.httpStatusCode !== 200) {
      throw new Error("failed to upload img");
    }
    let imgURL = `${process.env.AWS_S3_BUCKET_DOMAIN}/${path}`;
    return imgURL;
  } catch (error) {
    return console.log(error.message);
  }
}

// function splitImageUrl(url) {
//   let key = url.split(".com/")[1];
//   return key;
// }
