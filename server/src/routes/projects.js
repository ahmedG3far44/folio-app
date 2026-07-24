import sharp from "sharp";
import crypto from "crypto";
import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";
import getImageKey from "../utils/getImageKey.js";
import authenticated from "../middlewares/authenticated.js";
import verifyUploading from "../middlewares/verifyUploading.js";

import { upload } from "../configs/multer.js";
import { uploadImage, uploadMedia, deleteImage } from "../utils/upload.js";
import { projectSchema } from "../utils/schemas.js";

const router = express.Router();

router.post(
  "/project",
  authenticated,
  upload.any(),
  verifyUploading,
  async (req, res) => {
    try {
      const user = req.user;
      const payload = req.body;
      const images = req.files;
      const keysArray = [];

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
      
        return res
          .status(400)
          .json(new Exceptions(400, "not valid project data."));
      }

      const { title, description, sourceUrl, tags } = validProjectData?.data;

      const source = sourceUrl && sourceUrl.trim() ? sourceUrl : null;

      let thumbnailUrl;
      for (const file of images) {
        const fileKey = crypto.randomUUID();
        if (file.fieldname === "image") {
          const processed = await sharp(file.buffer)
            .resize(800, 450, { fit: "inside", withoutEnlargement: true })
            .toFormat("webp", { quality: 80 })
            .toBuffer();
          const result = await uploadImage(processed, {
            folder: "folio/projects",
            publicId: fileKey,
          });
          keysArray.push(result.url);
        } else {
          const isVideo = file.mimetype.startsWith("video/");
          const result = await uploadMedia(file.buffer, {
            folder: "folio/projects",
            publicId: fileKey,
            resourceType: isVideo ? "video" : "image",
          });
          thumbnailUrl = result.url;
        }
      }

      await prisma.projects.create({
        data: {
          title,
          description,
          thumbnail: thumbnailUrl,
          source,
          ImagesList: {
            createMany: {
              data: keysArray.map((url) => {
                return {
                  url,
                };
              }),
            },
          },
          tags: {
            createMany: {
              data: (tags || []).map((tagName) => {
                return {
                  tagName,
                };
              }),
            },
          },
          usersId: user.id,
        },
      });
      
      const newProject = await prisma.projects.findMany({
        where: {
          usersId: user.id,
        },
      });
      res.status(201).json({
        data: newProject,
        message: "a new project was created.",
      });
    } catch (error) {
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.get("/project", authenticated, async (req, res) => {
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

router.get("/project/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("project id not valid !!");

    const project = await prisma.projects.findUnique({
      where: {
        id,
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

    if (!project) throw new Error("not found projects!!");

    res.status(200).json(project);
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
  authenticated,
  upload.none(),
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const user = req.user;
      const payload = req.body;

      const validProjectData = projectSchema.safeParse(payload);

      if (!validProjectData.success) {
      
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
      const newProject = await prisma.projects.findMany({
        where: {
          usersId: user.id,
        },
      });
      res
        .status(200)
        .json({ data: newProject, message: "updated project info success." });
    } catch (error) {
      res.status(500).json(new Exceptions(500, error.message));
    }
  }
);

router.delete("/project/:projectId", authenticated, async (req, res) => {
  const user = req.user;
  const { projectId } = req.params;

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

    const publicIds = [getImageKey(project.thumbnail)];
    project.ImagesList.forEach((image) => {
      const key = getImageKey(image?.url);
      if (key) publicIds.push(key);
    });

    await Promise.allSettled(publicIds.map((id) => deleteImage(id)));

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

    await prisma.projects.delete({
      where: {
        id: projectId,
        usersId: user.id,
      },
    });

    const newProject = await prisma.projects.findMany({
      where: {
        usersId: user.id,
      },
    });

    res
      .status(200)
      .json({ data: newProject, message: "project deleted successful." });
  } catch (error) {
    
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

  const uploadResult = await uploadImage(result, {
    folder: "folio/projects",
    publicId: path,
  });
  return uploadResult.url;
}
