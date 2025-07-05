import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import https from "https";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const ENV = process.env.ENV;
const PORT = process.env.PORT;
const ALLOWED_CLIENT_ORIGIN = process.env.ALLOWED_CLIENT_ORIGIN;



const app = express();






const corsOptions = {
  origin: ENV === "development"? "*" : ALLOWED_CLIENT_ORIGIN,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

prisma
  .$connect()
  .then(() => {
    console.log("db connection successful");
  })
  .catch(() => {
    console.log("db connection error");
  });

  

  
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());


app.get("/", async (req, res) => {
  return res.send("APP is working....");
});
app.get("/healthz", async (req, res) => {
  return res.send({ status: "ok", message: "Server is running" });
});
app.use("/api", rootRouter);



if (ENV === "production") {
  const certPath = process.env.CERTBOT_CERT_PATH;
  const keyPath = process.env.CERTBOT_KEY_PATH;

  const normalizedCertPath = path.normalize(certPath);
  const normalizedKeyPath = path.normalize(keyPath);
    
  const key = fs.readFileSync(normalizedKeyPath, "utf-8");
  const cert =  fs.readFileSync(normalizedCertPath, "utf-8");

  https.createServer({
    key, cert
  }, app).listen(PORT, () => {
    console.log(
      `HTTPS Server running on port ${PORT} calling from ${ENV} environment`
    );
  });
} else {
  app.listen(PORT, () => {
    console.log(
      `HTTP Server running on port ${
        PORT
      } calling from ${ENV} environment`
    );
  });
}
