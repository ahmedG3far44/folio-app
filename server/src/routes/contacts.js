import express from "express";
import prisma from "../database/db.js";
import Exceptions from "../utils/Exceptions.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";

import { contactsSchema } from "../utils/schemas.js";

const router = express.Router();

router.get("/:userId/contacts", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json(new Exceptions(400, "not valid user"));
    }

    const contacts = await prisma.contacts.findFirst({
      where: {
        usersId: userId,
      },
    });

    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
});

router.put("/contacts/:contactsId", verifyAccessToken, async (req, res) => {
  try {
    const user = req.user;
    const payload = req.body;
    const { contactsId } = req.params;

    const validContactsUrls = contactsSchema.safeParse(payload);

    if (!validContactsUrls.success) {
      return res
        .status(400)
        .json(new Exceptions(400, "Bad request not a valid data"));
    }

    await prisma.contacts.update({
      where: {
        usersId: user.id,
        id: contactsId,
      },
      data: {
        ...validContactsUrls.data,
      },
    });

    const newContact = await prisma.contacts.findFirst({
      where: {
        usersId: user.id,
        id: contactsId,
      },
    });
    res.status(200).json({
      data: newContact,
      message: "contact information was updated successful.",
    });
  } catch (error) {
    res.status(500).json(new Exceptions(500, error.message));
  }
});

export default router;
