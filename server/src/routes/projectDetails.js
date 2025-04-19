import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";

const projectDetailsRoute = express.Router();

projectDetailsRoute.get("/:userId/project", async (req, res) => {
  const { userId } = req.params;
  try {
    const userProjects = await prisma.projects.findMany({
      where: {
        usersId: userId,
      },
      select: {
        id: true,
        thumbnail: true,
        title: true,
        tags: {
          select: {
            id: true,
            tagName: true,
          },
        },
        ImagesList: {
          select: {
            url: true,
          },
        },
        likes: true,
        views: true,
      },
    });

    if (!userProjects) {
      return res
        .status(404)
        .json(new Exceptions(404, "this user doesn't exist"));
    }
    return res.status(200).json(userProjects);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default projectDetailsRoute;
