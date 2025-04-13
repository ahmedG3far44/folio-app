import jwt from "jsonwebtoken";
import Exceptions from "../handlers/Exceptions.js";


async function verifyAdminAccessToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token)
          return res
            .status(401)
            .json(new Exceptions(401, "You are not authorized to do this action"));



        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        

        const { role } = decoded;

        if(role !== "ADMIN") throw new Error("your not Authorized to do this action")

        req.user = decoded;


        

        next();

      } catch (error) {
        return res
          .status(401)
          .json(new Exceptions(401, error.message));
      }
}

export default verifyAdminAccessToken;
