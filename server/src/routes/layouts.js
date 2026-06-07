import express from "express";
import prisma from "../configs/db.js";
import Exceptions from "../utils/Exceptions.js";
import authenticated from "../middlewares/authenticated.js";

import { layoutsSchema } from "../utils/schemas.js";

const router = express.Router();

router.get("/layouts", authenticated, async (req, res) => {
  try {
    const user = req.user;

    const userLayouts = await prisma.layouts.findFirst({
      where: {
        usersId: user.id,
      },
    });
    if (!userLayouts) {
      const layouts = await prisma.layouts.create({
        data: {
          heroLayout: "1",
          expLayout: "1",
          projectsLayout: "1",
          skillsLayout: "1",
          usersId: user.id,
        },
      });
      return res.status(200).json(layouts);
    }
    
    return res.status(200).json(userLayouts);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.put("/layouts/:id", authenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const payload = req.body;

    const validLayoutsPayload = layoutsSchema.safeParse(payload);

    if (!validLayoutsPayload.success) {
          return res.status(400).json(new Exceptions(400, "Bad request not valid data"));
    }

    const newLayout = await prisma.layouts.update({
      where: {
        usersId: user.id,
        id,
      },
      data: { ...validLayoutsPayload.data },
    });

    return res.status(200).json({
      data: newLayout,
      message: "layout info was updated successfully",
    });
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
