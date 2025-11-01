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
        themeName: "Light",
        backgroundColor: "#ffffff",
        cardColor: "#f8fafc",
        primaryText: "#0f172a",
        secondaryText: "#64748b",
        borderColor: "#e2e8f0",
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
        themeName: "Dark",
        backgroundColor: "#020617",
        cardColor: "#0f172a",
        primaryText: "#f8fafc",
        secondaryText: "#94a3b8",
        borderColor: "#1e293b",
      },
      {
        themeName: "Dark Slate",
        backgroundColor: "#0f172a",
        cardColor: "#1e293b",
        primaryText: "#f1f5f9",
        secondaryText: "#94a3b8",
        borderColor: "#334155",
      },
      {
        themeName: "Dark Stone",
        backgroundColor: "#0c0a09",
        cardColor: "#1c1917",
        primaryText: "#fafaf9",
        secondaryText: "#a8a29e",
        borderColor: "#292524",
      },
      {
        themeName: "Dark Zinc",
        backgroundColor: "#09090b",
        cardColor: "#18181b",
        primaryText: "#fafafa",
        secondaryText: "#a1a1aa",
        borderColor: "#27272a",
      },
      {
        themeName: "Midnight",
        backgroundColor: "#0a0a0a",
        cardColor: "#171717",
        primaryText: "#fafafa",
        secondaryText: "#a3a3a3",
        borderColor: "#262626",
      },
      {
        themeName: "Green Light",
        backgroundColor: "#f0fdf4",
        cardColor: "#dcfce7",
        primaryText: "#14532d",
        secondaryText: "#15803d",
        borderColor: "#bbf7d0",
      },
      {
        themeName: "Green",
        backgroundColor: "#ecfdf5",
        cardColor: "#d1fae5",
        primaryText: "#065f46",
        secondaryText: "#059669",
        borderColor: "#a7f3d0",
      },
      {
        themeName: "Green Dark",
        backgroundColor: "#022c22",
        cardColor: "#064e3b",
        primaryText: "#d1fae5",
        secondaryText: "#6ee7b7",
        borderColor: "#065f46",
      },
      {
        themeName: "Emerald Dark",
        backgroundColor: "#052e16",
        cardColor: "#14532d",
        primaryText: "#dcfce7",
        secondaryText: "#86efac",
        borderColor: "#166534",
      },
      {
        themeName: "Blue Light",
        backgroundColor: "#eff6ff",
        cardColor: "#dbeafe",
        primaryText: "#1e3a8a",
        secondaryText: "#1d4ed8",
        borderColor: "#bfdbfe",
      },
      {
        themeName: "Blue",
        backgroundColor: "#dbeafe",
        cardColor: "#bfdbfe",
        primaryText: "#1e40af",
        secondaryText: "#2563eb",
        borderColor: "#93c5fd",
      },
      {
        themeName: "Blue Dark",
        backgroundColor: "#172554",
        cardColor: "#1e3a8a",
        primaryText: "#dbeafe",
        secondaryText: "#93c5fd",
        borderColor: "#1e40af",
      },
      {
        themeName: "Navy",
        backgroundColor: "#0c1e3d",
        cardColor: "#1e3a5f",
        primaryText: "#e0f2fe",
        secondaryText: "#7dd3fc",
        borderColor: "#1e40af",
      },
    
      {
        themeName: "Orange Light",
        backgroundColor: "#fff7ed",
        cardColor: "#ffedd5",
        primaryText: "#7c2d12",
        secondaryText: "#c2410c",
        borderColor: "#fed7aa",
      },
      {
        themeName: "Orange",
        backgroundColor: "#ffedd5",
        cardColor: "#fed7aa",
        primaryText: "#9a3412",
        secondaryText: "#ea580c",
        borderColor: "#fdba74",
      },
      {
        themeName: "Orange Dark",
        backgroundColor: "#431407",
        cardColor: "#7c2d12",
        primaryText: "#fed7aa",
        secondaryText: "#fdba74",
        borderColor: "#9a3412",
      },
      {
        themeName: "Amber Dark",
        backgroundColor: "#451a03",
        cardColor: "#78350f",
        primaryText: "#fef3c7",
        secondaryText: "#fcd34d",
        borderColor: "#92400e",
      },

      {
        themeName: "Purple Light",
        backgroundColor: "#faf5ff",
        cardColor: "#f3e8ff",
        primaryText: "#581c87",
        secondaryText: "#7e22ce",
        borderColor: "#e9d5ff",
      },
      {
        themeName: "Purple",
        backgroundColor: "#f3e8ff",
        cardColor: "#e9d5ff",
        primaryText: "#6b21a8",
        secondaryText: "#9333ea",
        borderColor: "#d8b4fe",
      },
      {
        themeName: "Purple Dark",
        backgroundColor: "#2e1065",
        cardColor: "#4c1d95",
        primaryText: "#f3e8ff",
        secondaryText: "#d8b4fe",
        borderColor: "#6b21a8",
      },
      {
        themeName: "Violet Dark",
        backgroundColor: "#1e1b4b",
        cardColor: "#312e81",
        primaryText: "#ede9fe",
        secondaryText: "#c4b5fd",
        borderColor: "#4c1d95",
      },
    
     
      {
        themeName: "Black",
        backgroundColor: "#000000",
        cardColor: "#0a0a0a",
        primaryText: "#ffffff",
        secondaryText: "#a3a3a3",
        borderColor: "#262626",
      },
      {
        themeName: "Black Elevated",
        backgroundColor: "#000000",
        cardColor: "#171717",
        primaryText: "#fafafa",
        secondaryText: "#a3a3a3",
        borderColor: "#404040",
      },
      {
        themeName: "Pure Black",
        backgroundColor: "#000000",
        cardColor: "#121212",
        primaryText: "#ffffff",
        secondaryText: "#b3b3b3",
        borderColor: "#333333",
      },

      {
        themeName: "Rose Light",
        backgroundColor: "#fff1f2",
        cardColor: "#ffe4e6",
        primaryText: "#881337",
        secondaryText: "#be123c",
        borderColor: "#fecdd3",
      },
      {
        themeName: "Rose Dark",
        backgroundColor: "#4c0519",
        cardColor: "#881337",
        primaryText: "#ffe4e6",
        secondaryText: "#fecdd3",
        borderColor: "#9f1239",
      },
      {
        themeName: "Teal Light",
        backgroundColor: "#f0fdfa",
        cardColor: "#ccfbf1",
        primaryText: "#134e4a",
        secondaryText: "#0f766e",
        borderColor: "#99f6e4",
      },
      {
        themeName: "Teal Dark",
        backgroundColor: "#042f2e",
        cardColor: "#134e4a",
        primaryText: "#ccfbf1",
        secondaryText: "#5eead4",
        borderColor: "#0f766e",
      },
      {
        themeName: "Indigo Light",
        backgroundColor: "#eef2ff",
        cardColor: "#e0e7ff",
        primaryText: "#3730a3",
        secondaryText: "#4f46e5",
        borderColor: "#c7d2fe",
      },
      {
        themeName: "Indigo Dark",
        backgroundColor: "#1e1b4b",
        cardColor: "#312e81",
        primaryText: "#e0e7ff",
        secondaryText: "#a5b4fc",
        borderColor: "#4338ca",
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

router.post("/admin/default/themes", addDefaultThemes);

router.post("/admin/themes", verifyAdminAccessToken, addNewTheme);

router.get("/themes", verifyAccessToken, showAvailableThemes);

router.get("/theme/:userId", getUserActiveTheme);

router.put("/theme", verifyAccessToken, updateUserActiveTheme);

export default router;
