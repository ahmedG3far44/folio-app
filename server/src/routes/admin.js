import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";
import verifyAdminAccessToken from "../middlewares/verifyAdminAccessToken.js";

const router = express.Router();

router.get("/admin", verifyAdminAccessToken, async (req, res) => {
  try {
    const totalNumberProjects = await prisma.projects.count();
    const totalFeedbacks = await prisma.testimonials.count();
    const totalNumberUsers = await prisma.users.count();
    const allUsersInfo = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        resume: true,
        createdAt: true,
      },
    });
    const totalNumberThemes = await prisma.theme.count();
    const totalSkills = await prisma.skills.count();
    const totalExperiences = await prisma.experiences.count();

    return res.status(200).json({
      insights: {
        total_users: totalNumberUsers,
        total_projects: totalNumberProjects,
        total_feedbacks: totalFeedbacks,
        total_themes: totalNumberThemes,
        total_skills: totalSkills,
        total_experiences: totalExperiences,
      },
      users: allUsersInfo,
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
