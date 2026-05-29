import jwt from "jsonwebtoken";
import Exceptions from "../utils/Exceptions.js";
import { env } from "../configs/env.js";

async function authenticated(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json(new Exceptions(401, "You are not authorized to do this action"));

    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new Exceptions(401, "You are not authorized to do this action"));
  }
}

export default authenticated;
