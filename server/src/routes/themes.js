import express from "express";
import verifyAdminAccessToken from "../middlewares/verifyAdminAccessToken.js";
import prisma from "../database/db.js";

const router = express.Router();

router.post("/theme", verifyAdminAccessToken, async (req, res) => {
  try {
    const user = req.user;
    if (user?.role !== "ADMIN")
      throw new Error("your not authorized to do this action");

    const newTheme = req.body;
    const theme = await prisma.theme.create({
      data: {
        ...newTheme,
      },
    });
    res
      .status(200)
      .json({ data: theme, message: "updated theme successfully" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});
router.put("/theme/:themeId", verifyAdminAccessToken, async (req, res) => {
  try {
    const user = req.user;
    const { themeId } = req.params;
    const newTheme = req.body;

    if (user.role !== "ADMIN")
      throw new Error("your not authorized to do this action");

    if (!themeId) throw new Error("theme id is required!!");

    const theme = await prisma.theme.update({
      where: {
        id: themeId,
      },
      data: {
        ...newTheme,
      },
    });
    res
      .status(204)
      .json({ data: theme, message: "updated theme successfully" });
  } catch (err) {
    res.status(500).json({ data: "error", message: err.message });
  }
});

router.get("/theme", async (req, res) => {
  try {
    // const user = req.user;
    const newTheme = await prisma.theme.findMany();
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
