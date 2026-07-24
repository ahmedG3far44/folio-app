import cors from "cors";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import prisma from "./configs/db.js";
import cookieParser from "cookie-parser";
import rootRouter from "./routes/index.js";


import { env } from "./configs/env.js";


const PORT = env.PORT;
const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const app = express();

const corsOptions = {
  origin:allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

prisma
  .$connect()
  .then(() => {
    console.log("db connection successful");
  })
  .catch((err) => {
    console.error("db connection error:", err.message);
  });

app.set("trust proxy", 1);

app.use(compression());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.get("/", async (req, res) => {
  return res.send(`
    <h1>Folio server is running good....</h1> 
    `);
});

app.get("/healthz", async (req, res) => {
  return res.send({ status: "ok", message: "Server is running" });
});

app.use("/api", rootRouter);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT} ==> ${env.NODE_ENV} environment`);
});
