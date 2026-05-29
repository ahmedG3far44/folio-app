import cors from "cors";
import express from "express";
import prisma from "./configs/db.js";
import cookieParser from "cookie-parser";
import rootRouter from "./routes/index.js";

import { env } from "./configs/env.js";

const PORT = env.PORT;
const allowedOrigins = env.ALLOWED_ORIGINS;

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

app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT} ==> ${env.NODE_ENV} environment`);
});
