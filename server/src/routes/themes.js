import express from "express";
import prisma from "../database/db.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import verifyAdminAccessToken from "../middlewares/verifyAdminAccessToken.js";

import { themeSchema } from "../utils/schemas.js";

const router = express.Router();

router.post("/theme", verifyAdminAccessToken, async (req, res) => {
  try {
    const user = req.user;

    if (user?.role !== "ADMIN") {
      throw new Error("your not authorized to do this action");
    }

    const newTheme = req.body;

    if (!newTheme) throw new Error("theme data is required!!");

    const validThemeData = themeSchema.safeParse(newTheme);

    if (!validThemeData.success) {
      throw new Error("not available input data!!");
    }

    const {
      themeName,
      backgroundColor,
      cardColor,
      primaryText,
      secondaryText,
      borderColor,
    } = validThemeData.data;

    console.log(newTheme);

    await prisma.theme.create({
      data: {
        themeName,
        backgroundColor,
        cardColor,
        primaryText,
        secondaryText,
        borderColor,
        usersId: user.id,
      },
    });
    const allThemes = await prisma.theme.findMany({
      orderBy: {
        themeName: "asc",
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
    res
      .status(200)
      .json({ data: allThemes, message: "updated theme successfully" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});
router.put("/theme", verifyAccessToken, async (req, res) => {
  try {
    const user = req.user;
    const newTheme = req.body;

    if (!user) throw new Error("user not available!!");
    const validThemeData = themeSchema.safeParse(newTheme);

    if (!validThemeData.success) {
      throw new Error("not available input data!!");
    }

    const {
      id,
      themeName,
      backgroundColor,
      cardColor,
      primaryText,
      secondaryText,
      borderColor,
    } = validThemeData.data;

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        theme: {
          update: {
            where: {
              id,
            },
            data: {
              themeName,
              backgroundColor,
              cardColor,
              primaryText,
              secondaryText,
              borderColor,
            },
          },
        },
      },
    });
    const activeTheme = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      select: {
        theme: {
          select: {
            id: true,
            themeName: true,
            backgroundColor: true,
            cardColor: true,
            primaryText: true,
            secondaryText: true,
            borderColor: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ data: activeTheme, message: "updated theme successfully" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});

router.get("/theme", async (req, res) => {
  try {
    // const user = req.user;
    const newTheme = await prisma.theme.findMany({
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
    res
      .status(200)
      .json({ data: newTheme, message: "all theme available themes" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});

router.delete("/theme/:themeId", verifyAdminAccessToken, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "ADMIN")
      throw new Error("your not authorized to do this action");

    const { themeId } = req.params;

    if (!themeId) throw new Error("theme id is required!!");

    const isThemeFound = await prisma.theme.findUnique({
      where: {
        id: themeId,
      },
    });

    if (!isThemeFound) throw new Error("this theme is not exist!!");

    await prisma.theme.delete({
      where: {
        id: themeId,
      },
    });

    const newThemes = await prisma.theme.findMany();
    console.log(newThemes);
    res
      .status(200)
      .json({ data: newThemes, message: "this theme was deleted!!" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});

export default router;
