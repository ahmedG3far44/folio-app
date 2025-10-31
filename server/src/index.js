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
const allowedOrigins = process.env.ALLOWED_ORIGINS;

const app = express();

const corsOptions = {
  origin: allowedOrigins,
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
    <h1>Folio server is running good....</h1> 
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

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port 443 ==> ${ENV} environment `);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT} ==> ${ENV} environment`);
  });
}
