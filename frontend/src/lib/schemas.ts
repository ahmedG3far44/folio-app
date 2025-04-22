import { z } from "zod";

export const bioSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "name is required!!",
    })
    .max(70, {
      message: "too long input value!!",
    }),
  jobTitle: z
    .string()
    .min(5, {
      message: "job title is required!!",
    })
    .max(70, {
      message: "too long input value!!",
    }),
  summary: z
    .string()
    .min(10, {
      message: "bio feild is less than 10 characters!!",
    })
    .max(400, {
      message: "too long input value!!",
    }),
});
export const experienceSchema = z.object({
  cName: z
    .string()
    .min(5, {
      message: "short input value!!",
    })
    .max(70, {
      message: "too long input value!!",
    }),
  position: z
    .string()
    .min(5, {
      message: "short input value!!",
    })
    .max(60, {
      message: "too long input value!!",
    }),
  duration: z.string().min(4, {
    message: "duration feild is required!!",
  }),

  role: z
    .string()
    .min(10, {
      message: "short input value!!",
    })
    .max(500, {
      message: "too long input value!!",
    }),
  location: z
    .string()
    .min(5, {
      message: "short input value!!",
    })
    .max(60, {
      message: "too long input value!!",
    }),
});

export const projectSchema = z.object({
  title: z
    .string()
    .min(5, { message: "short input value!!" })
    .max(60, { message: "too long input value!!" }),
  description: z
    .string()
    .min(10, { message: "short input value!!" })
    .max(350, { message: "too long input value!!" }),
  sourceUrl: z
    .string()
    .url({ message: "not a valid url!!" })
    .min(10, { message: "short input value!!" })
    .max(200, { message: "too long input value!!" })
    .optional(),
});
export const skillsSchema = z.object({
  skillName: z
    .string()
    .min(3, { message: "short input value!!" })
    .max(100, { message: "too long input value!!" }),
});
export const userSchema = z.object({
  id: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z
    .string()
    .min(10, { message: "too short url " })
    .max(300, { message: "too long url text" }),
  email: z.string(),
  role: z.string(),
});

export const contactsSchema = z.object({
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  youtube: z.string().url().optional(),
  twitter: z.string().url().optional(),
});

export const layoutsSchema = z.object({
  heroLayout: z.string().length(1, { message: "not valid experience layout" }),
  expLayout: z.string().length(1, { message: "not valid experience layout" }),
  projectsLayout: z
    .string()
    .length(1, { message: "not valid projects layout" }),
  skillsLayout: z.string().length(1, { message: "not valid skills layout" }),
});
export const feedbackSchema = z.object({
  name: z
    .string()
    .min(1, { message: "this field is required" })
    .max(100, { message: "too long input field" }),
  position: z
    .string()
    .min(1, { message: "this field is required" })
    .max(100, { message: "too long input field" }),
  feedback: z
    .string()
    .min(1, { message: "this field is required" })
    .max(200, { message: "too long input field" }),
});
