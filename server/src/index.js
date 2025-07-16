import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import https from "https";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const ENV = process.env.ENV;
const PORT = process.env.PORT;

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
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

app.enable("trust proxy");

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  return res.send(`
    <h1>Folio app is working....</h1> 
    
    PORT: ${process.env.PORT} <br>
    
    ENV: ${process.env.ENV} <br>
    
    JWT_SECRET: ${process.env.JWT_SECRET}  <br>
    
    AWS_S3_ACCESS_KEY: ${process.env.AWS_S3_ACCESS_KEY} <br>
    
    AWS_S3_ACCESS_SECRETE_KEY: ${process.env.AWS_S3_ACCESS_SECRETE_KEY} <br>
    
    AWS_S3_REGION: ${process.env.AWS_S3_REGION} <br>
    
    AWS_S3_BUCKET_NAME: ${process.env.AWS_S3_BUCKET_NAME} <br>
    
    AWS_S3_BUCKET_DOMAIN: ${process.env.AWS_S3_BUCKET_DOMAIN} <br>
    
    SSL_CERT: ${process.env.SSL_CERT} <br>
    
    SSL_KEY: ${process.env.SSL_KEY} <br>
    
    `);
});

app.get("/healthz", async (req, res) => {
  return res.send({ status: "ok", message: "Server is running" });
});

app.use("/api", rootRouter);

if (ENV === "production") {
  const options = {
    cert: fs.readFileSync(process.env.SSL_CERT, "utf-8"),
    key: fs.readFileSync(process.env.SSL_KEY, "utf-8"),
    minVersion: "TLSv1.2",
  };

  https.createServer(options, app).listen(443, () => {
    console.log(`HTTPS server running on port 443 ==> ${ENV} environment`);
  });
} else {
  app.listen(PORT || 80, () => {
    console.log(`HTTP Server running on port ${PORT} ==> ${ENV} environment`);
  });
}
