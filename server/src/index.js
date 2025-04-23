import express from "express";
import dotenv from "dotenv";
import prisma from "./database/db.js";
import rootRouter from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();



const ENV = process.env.ENV;
const PORT = process.env.PORT;

const app = express();

const corsOptions = {
  origin:
    ENV === "development"
      ? "http://localhost:3000"
      : "https://animated-pegasus-c760ed.netlify.app",
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
  console.log(`Server running on port ${PORT || 4000}`);
});
