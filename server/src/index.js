import express from "express";
import dotenv from "dotenv";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// import https from "https";
// import fs from "fs";

const ENV = process.env.ENV;
dotenv.config();

const app = express();

const corsOptions = {
  origin:
    ENV === "development"
      ? "http://localhost:3000"
      : "https://presentoapp.kinde.com",
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


app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});


