import prisma from "../database/db.js";
import Exceptions from "../handlers/Exceptions.js";

export default async function checkAccessUser(req, res, next) {
  const { userId } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(401).json(new Exceptions(401, "UnAuthorized User"));
    }
    return next();
  } catch (error) {
    return res.status(500).json(new Exceptions(500, error.message));
  }
}
