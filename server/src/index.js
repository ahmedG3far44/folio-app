import express from "express";
import dotenv from "dotenv";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  setupKinde,
  protectRoute,
  getUser,
  GrantType,
} from "@kinde-oss/kinde-node-express";
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

const config = {
  clientId: "6faed2bb9ba54138869c3543a2b53ad5",
  issuerBaseUrl: "https://presentoapp.kinde.com",
  siteUrl: "http://localhost:3000",
  secret: "316DsdF1CI6UzWxUYQhzvnKgSzIk3eTem580FYYOi2efADMnZi",
  redirectUrl: "http://localhost:3000/callback",
  scope: "openid profile email",
  grantType: GrantType.AUTHORIZATION_CODE,
  unAuthorisedUrl: "http://localhost:3000/unauthorised",
  postLogoutRedirectUrl: "http://localhost:3000",
};

setupKinde(config, app);

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


