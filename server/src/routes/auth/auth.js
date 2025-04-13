import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../../database/db.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = 10;

    if (!email || !password)
      throw new Error("The email or password is wrong!!");

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error("this user not found!!");

    const hashedPassowrd = await bcrypt.hash(password, salt);
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassowrd);
    if (!isPasswordCorrect) throw new Error("wrong email or password !!");

    const payload = {
      id: user.id,
      name: user.name,
      email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    console.log(token);
    return res
      .status(200)
      .json({ data: { user, token }, message: "a user login success" });
  } catch (err) {
    return res.status(500).json({ data: "Error", message: err.message });
  }
});
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    const salt = 10;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user) throw new Error("This user already exist!!");

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword, 
        picture,
      },
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email,
      role: newUser.role,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    console.log(token);
    return res.status(200).json({
      data: { user: newUser, token },
      message: "a new user was created!",
    });
  } catch (err) {
    return res.status(500).json({ data: "Error", message: err.message });
  }
});

export default router;
