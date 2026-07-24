import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";
import requiredAdmin from "../middlewares/requiredAdmin.js";
import getImageKey from "../utils/getImageKey.js";
import { deleteImage } from "../utils/upload.js";

const router = express.Router();

router.get("/admin", requiredAdmin, async (req, res) => {
  try {
    const {
      page = "1",
      pageSize = "30",
      status,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 30));
    const skip = (pageNum - 1) * size;

    const where = {};
    if (status && (status === "ACTIVE" || status === "BLOCKED")) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [totalUsers, users, totalNumberUsers, totalNumberProjects, totalFeedbacks, totalNumberThemes, totalSkills, totalExperiences] = await Promise.all([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        skip,
        take: size,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          picture: true,
          role: true,
          resume: true,
          status: true,
          provider: true,
          createdAt: true,
        },
      }),
      prisma.users.count(),
      prisma.projects.count(),
      prisma.testimonials.count(),
      prisma.theme.count(),
      prisma.skills.count(),
      prisma.experiences.count(),
    ]);

    return res.status(200).json({
      insights: {
        total_users: totalNumberUsers,
        total_projects: totalNumberProjects,
        total_feedbacks: totalFeedbacks,
        total_themes: totalNumberThemes,
        total_skills: totalSkills,
        total_experiences: totalExperiences,
      },
      users,
      pagination: {
        total: totalUsers,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(totalUsers / size),
      },
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.patch("/admin/users/:userId/status", requiredAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status || !["ACTIVE", "BLOCKED"].includes(status)) {
      return res.status(400).json({ message: "Status must be ACTIVE or BLOCKED" });
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updated = await prisma.users.update({
      where: { id: userId },
      data: { status },
      select: { id: true, name: true, email: true, picture: true, role: true, resume: true, status: true, provider: true, createdAt: true },
    });

    return res.status(200).json({
      data: updated,
      message: status === "BLOCKED" ? "User blocked successfully" : "User activated successfully",
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.delete("/admin/users/:userId", requiredAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        picture: true,
        Bio: { select: { heroImage: true } },
        ProjectsList: { select: { thumbnail: true, ImagesList: { select: { url: true } } } },
        SkillsList: { select: { skillLogo: true } },
        ExperiencesList: { select: { cLogo: true } },
        Testimonials: { select: { profile: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const publicIds = [];
    if (user.picture) {
      const key = getImageKey(user.picture);
      if (key) publicIds.push(key);
    }
    user.Bio.forEach((b) => {
      if (b.heroImage) {
        const key = getImageKey(b.heroImage);
        if (key) publicIds.push(key);
      }
    });
    user.ProjectsList.forEach((p) => {
      const key = getImageKey(p.thumbnail);
      if (key) publicIds.push(key);
      p.ImagesList.forEach((img) => {
        const imgKey = getImageKey(img.url);
        if (imgKey) publicIds.push(imgKey);
      });
    });
    user.SkillsList.forEach((s) => {
      if (s.skillLogo) {
        const key = getImageKey(s.skillLogo);
        if (key) publicIds.push(key);
      }
    });
    user.ExperiencesList.forEach((e) => {
      if (e.cLogo) {
        const key = getImageKey(e.cLogo);
        if (key) publicIds.push(key);
      }
    });
    user.Testimonials.forEach((t) => {
      if (t.profile) {
        const key = getImageKey(t.profile);
        if (key) publicIds.push(key);
      }
    });

    await Promise.allSettled(publicIds.map((id) => deleteImage(id)));

    await prisma.testimonials.deleteMany({ where: { usersId: userId } });
    await prisma.tags.deleteMany({ where: { Projects: { usersId: userId } } });
    await prisma.imagesList.deleteMany({ where: { Project: { usersId: userId } } });
    await prisma.projects.deleteMany({ where: { usersId: userId } });
    await prisma.skills.deleteMany({ where: { usersId: userId } });
    await prisma.experiences.deleteMany({ where: { usersId: userId } });
    await prisma.contacts.deleteMany({ where: { usersId: userId } });
    await prisma.bio.deleteMany({ where: { usersId: userId } });
    await prisma.layouts.deleteMany({ where: { usersId: userId } });
    await prisma.users.delete({ where: { id: userId } });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
