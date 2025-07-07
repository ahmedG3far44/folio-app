import express from "express";
import bioRoute from "./bio.js";
import usersRoute from "./users.js";
import adminRoute from "./admin.js";
import skillsRoute from "./skills.js";
import themesRoute from "./themes.js";
import authRoute from "./auth/auth.js";
import uploadCvRoute from "./resume.js";
import expRoute from "./experiences.js";
import layoutsRoute from "./layouts.js";
import contactsRoute from "./contacts.js";
import projectsRoute from "./projects.js";
import feedbackRoute from "./feedbacks.js";
import uploadFilesRoute from "./uploadFiles.js";
import projectDetailsRoute from "./projectDetails.js";

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
rootRouter.use("/", uploadFilesRoute);
rootRouter.use("/", themesRoute);

export default rootRouter;
