
import jwt from 'jsonwebtoken';
import Exceptions from '../handlers/Exceptions.js';


async function verifyAccessToken(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token) return res.status(401).json(new Exceptions(401, "You are not authorized to do this action"));
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        console.log("user token is verified");
        next();
    }catch(error){
        return res.status(401).json(new Exceptions(401, "You are not authorized to do this action"));
    }
}

export default verifyAccessToken;