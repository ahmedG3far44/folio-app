import express from "express";
import verifyAdminAccessToken from "../middlewares/verifyAdminAccessToken.js";
import prisma from "../database/db.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import { themeSchema } from "../utils/schemas.js";

const router = express.Router();

router.post("/theme", verifyAdminAccessToken, async (req, res) => {
  try {
    const user = req.user;
    if (user?.role !== "ADMIN") {
      throw new Error("your not authorized to do this action");
    }

    const newTheme = req.body;

    console.log(newTheme);
    const {
      themeName,
      backgroundColor,
      cardColor,
      primaryText,
      secondaryText,
      borderColor,
    } = newTheme;
    // console.log(user.id);
    const theme = await prisma.theme.create({
      data: {
        themeName,
        backgroundColor,
        cardColor,
        primaryText,
        secondaryText,
        borderColor,
      },
    });
    const allThemes = await prisma.theme.findMany({
      orderBy: {
        themeName: "desc",
      },
      select: {
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
router.put("/theme/:themeId", verifyAccessToken, async (req, res) => {
  try {
    const user = req.user;
    const newTheme = req.body;
    const { themeId } = req.params;

    console.log(themeId);

    if (!themeId) throw new Error("theme id not available!!");
    if (!user) throw new Error("user not available!!");
    const validThemeData = themeSchema.safeParse(newTheme);
    if (!validThemeData.success) {
      console.log(validThemeData.error.flatten().fieldErrors);
      throw new Error("not available input data!!");
    }
    const updatedTheme = await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        theme: {
          update: {
            ...validThemeData.data,
          },
        },
      },
      select: {
        id: true,
        email: true,
        password: false,
        theme: true,
      },
    });
    res
      .status(200)
      .json({ data: updatedTheme, message: "updated theme successfully" });
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
    console.log("theme deleted success");
    const newTheme = await prisma.theme.findMany({
      where: {
        usersId: user.id,
      },
    });
    res
      .status(204)
      .json({ data: newTheme, message: "this theme was deleted!!" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});

export default router;
