import express from "express";
import prisma from "../database/db.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import verifyAdminAccessToken from "../middlewares/verifyAdminAccessToken.js";

import { themeSchema } from "../utils/schemas.js";

const router = express.Router();

const addNewTheme = async (req, res) => {
  try {
    const newTheme = req.body;
    const user = req.user;

    if (!newTheme) {
      throw new Error("theme data is required!!");
    }

    if (user.role !== "ADMIN") {
      throw new Error("you are not authorized to do this action!!");
    }

    const validThemeData = themeSchema.safeParse(newTheme);

    if (!validThemeData.success) {
      {
        throw new Error("not a valid theme data!!");
      }
    }

    await prisma.theme.create({
      data: {
        ...validThemeData.data,
      },
    });

    const themes = await prisma.theme.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(201).json({ data: themes, message: "a new theme was added!!" });
  } catch (error) {
    res
      .status(500)
      .json({ data: "Internal Server Error", message: error.message });
  }
};

const showAvailableThemes = async (req, res) => {
  try {
    const allThemes = await prisma.theme.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      data: allThemes,
      message: "showing available themes",
    });
  } catch (error) {
    res
      .status(500)
      .json({ data: "Internal Server Error", message: error.message });
  }
};

const getUserActiveTheme = async (req, res) => {
  try {
    const user = req.user;

    const { userId } = req.params;

    if (!(user || userId)) {
      throw new Error("user id is required!!");
    }

    const userInfo = await prisma.users.findFirst({
      where: {
        id: user ? user.id : userId,
      },
      select: {
        activeTheme: true,
      },
    });

    if (!userInfo) {
      throw new Error(
        "this user not found, make sure you provide the correct data!!"
      );
    }

    const { activeTheme } = userInfo;

    const theme = await prisma.theme.findUnique({
      where: {
        id: activeTheme,
      },
    });

    res.status(200).json({
      data: theme,
      message: "showing active user theme",
    });
  } catch (error) {
    res
      .status(500)
      .json({ data: "Internal Server Error", message: error.message });
  }
};

const updateUserActiveTheme = async (req, res) => {
  try {
    const user = req.user;

    const { themeId } = req.body;

    if (!themeId) {
      throw new Error("themeId is required to update!!");
    }

    const findTheme = await prisma.theme.findUnique({
      where: {
        id: themeId,
      },
    });

    if (!findTheme) {
      throw new Error(
        "this theme is not available, make sure you select the valid themes!!"
      );
    }

    const updatedActiveUserTheme = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        activeTheme: themeId,
      },
      select: {
        activeTheme: true,
      },
    });

    const { activeTheme } = updatedActiveUserTheme;

    const newActiveTheme = await prisma.theme.findUnique({
      where: {
        id: activeTheme,
      },
      select: {
        id: true,
        themeName: true,
        backgroundColor: true,
        cardColor: true,
        primaryText: true,
        secondaryText: true,
        borderColor: true,
      },
    });

    res.status(200).json({
      data: newActiveTheme,
      message: "user active theme was changed success!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ data: "Internal Server Error", message: error.message });
  }
};

const addDefaultThemes = async (req, res) => {
  try {
    const defaultThemesList = [
      {
        themeName: "Default",
        backgroundColor: "#ffffff",
        cardColor: "#ffffff",
        primaryText: "#0f172a",
        secondaryText: "#64748b",
        borderColor: "#e2e8f0",
      },
      {
        themeName: "Defualt Dark Slate",
        backgroundColor: "#020817",
        cardColor: "#0f172a",
        primaryText: "#f8fafc",
        secondaryText: "#94a3b8",
        borderColor: "#1e293b",
      },
      {
        themeName: "Slate",
        backgroundColor: "#f8fafc",
        cardColor: "#f1f5f9",
        primaryText: "#1e293b",
        secondaryText: "#475569",
        borderColor: "#cbd5e1",
      },
      {
        themeName: "Stone",
        backgroundColor: "#fafaf9",
        cardColor: "#f5f5f4",
        primaryText: "#1c1917",
        secondaryText: "#57534e",
        borderColor: "#d6d3d1",
      },
      {
        themeName: "Zinc",
        backgroundColor: "#fafafa",
        cardColor: "#f4f4f5",
        primaryText: "#18181b",
        secondaryText: "#52525b",
        borderColor: "#d4d4d8",
      },
      {
        themeName: "Neutral",
        backgroundColor: "#fafafa",
        cardColor: "#f5f5f5",
        primaryText: "#171717",
        secondaryText: "#525252",
        borderColor: "#d4d4d4",
      },
      {
        themeName: "Red",
        backgroundColor: "#fef2f2",
        cardColor: "#fef2f2",
        primaryText: "#7f1d1d",
        secondaryText: "#b91c1c",
        borderColor: "#fecaca",
      },
      {
        themeName: "Orange",
        backgroundColor: "#fff7ed",
        cardColor: "#fff7ed",
        primaryText: "#9a3412",
        secondaryText: "#ea580c",
        borderColor: "#fed7aa",
      },
      {
        themeName: "Blue",
        backgroundColor: "#eff6ff",
        cardColor: "#eff6ff",
        primaryText: "#1e3a8a",
        secondaryText: "#2563eb",
        borderColor: "#bfdbfe",
      },
      {
        themeName: "Green",
        backgroundColor: "#f0fdf4",
        cardColor: "#f0fdf4",
        primaryText: "#14532d",
        secondaryText: "#16a34a",
        borderColor: "#bbf7d0",
      },
    ];

    await prisma.theme.createMany({
      data: defaultThemesList,
    });

    const allThemes = await prisma.theme.findMany();

    res.status(200).json({
      data: allThemes,
      message: "a default themes was created success!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ data: "Internal Server Error", message: error.message });
  }
};

// adding default themes to test
router.post("/admin/default/themes", addDefaultThemes);

// admin add a new theme
router.post("/admin/themes", verifyAdminAccessToken, addNewTheme);

// show available themes list
router.get("/themes", verifyAccessToken, showAvailableThemes);

// get user active theme
router.get("/theme/:userId", getUserActiveTheme);

// user update active theme
router.put("/theme", verifyAccessToken, updateUserActiveTheme);

export default router;
