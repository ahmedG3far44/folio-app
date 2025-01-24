import express from "express";
import dotenv from "dotenv";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();



const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.HOST_DOMAIN_URL, 
  methods: "GET,POST, PUT, DELETE", 
  allowedHeaders: ["Content-Type", "Authorization"]
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
  res.send("APP is working....");
});

app.listen(process.env.PORT, () => {
  console.log("application is working...");
});
