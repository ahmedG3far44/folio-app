import { z } from "zod";

export const bioSchema = z.object({
  name: z
    .string("expected data type wrong!!")
    .min(5, {
      message: "short input value!!",
    })
    .max(70, {
      message: "too long input value!!",
    }),
  jobTitle: z.string("expected data type wrong!!"),
  summary: z
    .string("expected data type wrong!!")
    .min(10, {
      message: "short input value!!",
    })
    .max(400, {
      message: "too long input value!!",
    }),
});
export const experienceSchema = z.object({
  cName: z
    .string("expected wrong type of data!!")
    .min(5, {
      message: "short input value!!",
    })
    .max(70, {
      message: "too long input value!!",
    }),
  position: z
    .string("expected wrong type of data!!")
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
    .string("expected wrong type of data!!")
    .min(10, {
      message: "short input value!!",
    })
    .max(500, {
      message: "too long input value!!",
    }),
  location: z
    .string("expected type of data!!")
    .min(5, {
      message: "short input value!!",
    })
    .max(60, {
      message: "too long input value!!",
    }),
});

export const projectSchema = z.object({
  title: z
    .string("wrong type of data!!")
    .min(5, { message: "short input value!!" })
    .max(60, { message: "too long input value!!" }),
  description: z
    .string("wrong type of data")
    .min(10, { message: "short input value!!" })
    .max(350, { message: "too long input value!!" }),
  tags: z.string().array().max(10).optional(),
  sourceUrl: z
    .string("wrong type of data!!")
    .min(10, { message: "short input value!!" })
    .max(200, { message: "too long input value!!" })
    .optional(),
});
export const skillsSchema = z.object({
  skillName: z
    .string("expected type wrong!!")
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
  linkedin: z.string().min(0).optional(),
  github: z.string().min(0).optional(),
  youtube: z.string().min(0).optional(),
  twitter: z.string().min(0).optional(),
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
});
