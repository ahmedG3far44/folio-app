import express from "express";
import usersRoute from "./users.js";
import expRoute from "./experiences.js";
import projectsRoute from "./projects.js";
import skillsRoute from "./skills.js";
import contactsRoute from "./contacts.js";
import bioRoute from "./bio.js";
import projectDetailsRoute from "./projectDetails.js";
import layoutsRoute from "./layouts.js";
import adminRoute from "./admin.js";
import uploadCvRoute from "./resume.js";
import feedbackRoute from "./feedbacks.js";
import authRoute from "./auth/auth.js"

const rootRouter = express.Router();

rootRouter.use("/", authRoute);
rootRouter.use("/", usersRoute);
rootRouter.use("/", bioRoute);
rootRouter.use("/", expRoute);
rootRouter.use("/", projectsRoute);
rootRouter.use("/", projectDetailsRoute);
rootRouter.use("/", skillsRoute);
rootRouter.use("/", contactsRoute);
rootRouter.use("/", layoutsRoute);
rootRouter.use("/", adminRoute);
rootRouter.use("/", uploadCvRoute);
rootRouter.use("/", feedbackRoute);

export default rootRouter;
