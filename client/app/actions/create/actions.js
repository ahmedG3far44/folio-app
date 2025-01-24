"use server";
import {
  experienceSchema,
  projectSchema,
  skillsSchema,
} from "@lib/schema";
import credentials from "@credentials";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addExperience(newExperience) {
  const { user, isLogged, accessToken } = await credentials();
  const result = experienceSchema.safeParse(newExperience);
  if (isLogged) {
    if (!result.success) {
      const errors = {
        error: "invalid server schema",
        message: "not valid data",
      };
      return errors;
    }
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.LOCAL_DOMAIN_URL
            : process.env.DOMAIN_URL
        }/${user?.id}/experiences`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}}`,
          },
          body: JSON.stringify(result?.data),
        }
      );
      console.log("experience post request done");
      response.json().then((res) => {
        console.log(res);
      });
      revalidatePath(`/experiences`);
      return;
    } catch (error) {
      const errors = {
        error: "can't add experiences",
        message: error.message,
      };
      return errors;
    }
  } else {
    redirect("api/auth/login");
  }
}
export async function addProject(formData, tags) {
  const { user } = await credentials();
  tags.map((tag) => {
    formData.append("tags", tag);
  });
  const thumbnail = formData.get("thumbnail");
  const images = formData.getAll("images");

  const project = {
    title: formData.get("title"),
    description: formData.get("description"),
    tags: formData.getAll("tags"),
    sourceLink: formData.get("sourceLink"),
  };

  try {
    const validProjectData = projectSchema.safeParse(project);

    if (!validateImages(thumbnail, images)) {
      throw new Error(
        "your images aren't valid maybe the format is wrong or size is to large"
      );
    }
    if (!validProjectData?.success) {
      validProjectData.error.errors.push((error) => {
        console.log(error);
        throw new Error(error);
      });
    }
    const request = await fetch(
      `http://localhost:4000/api/${user?.id}/project`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!request.status === 201) {
      throw new Error("connection error failed to add project");
    }

    const data = await request.json();
    revalidatePath("/projects");
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function addSkill(formData) {
  const { user, isLogged } = await credentials();
  const data = new FormData();
  try {
    if (isLogged) {
      const validPayload = skillsSchema.safeParse(newSkillInfo);
      if (!validPayload.success) {
        return validPayload.error.flatten().fieldErrors;
      }

      const response = await fetch(
        `http://localhost:4000/api/${user.id}/skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validPayload.data),
        }
      );
      console.log("new skill added  request done");
      response.json().then((res) => {
        console.log(res);
      });
      revalidatePath(`/skills`);
      return;
    } else {
      redirect("api/auth/login");
    }
  } catch (error) {
    return {
      error: "connection error can't add a new skill",
      message: error.message,
    };
  }
}

function validateImages(thumbnail, images) {
  const validImagesTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  images?.forEach((img) => {
    if (img.size > 1011868 || !validImagesTypes.includes(img.type)) {
      return false;
    }
  });

  if (thumbnail.size > 1011868 || !validImagesTypes.includes(thumbnail.type)) {
    return false;
  }

  return true;
}
