import express from "express";
import dotenv from "dotenv";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const ENV = process.env.ENV;
const PORT = process.env.PORT;
const LOCAL_CLIENT_URL = process.env.LOCAL_CLIENT_URL;
const PRODUCTION_CLIENT_URL = process.env.PRODUCTION_CLIENT_URL;

const app = express();

const corsOptions = {
  origin: ENV === "development" ? LOCAL_CLIENT_URL : PRODUCTION_CLIENT_URL,
  methods: "GET,POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api", rootRouter);

app.get("/", async (req, res) => {
  return res.send("APP is working....");
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT || 4000} calling ${
      ENV === "development" ? LOCAL_CLIENT_URL : PRODUCTION_CLIENT_URL
    }`
  );
});
