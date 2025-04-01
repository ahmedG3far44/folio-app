"use server";
import credentials from "@credentials";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteExperience(id) {
  const { user, isLogged } = await credentials();
  try {
    if (isLogged) {
      const requestDelete = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.LOCAL_DOMAIN_URL
            : process.env.DOMAIN_URL
        }/${user?.id}/experiences/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = requestDelete.json();
      revalidatePath("/experiences");
      return data;
    } else {
      redirect("/api/auth/login");
    }
  } catch (error) {
    return {
      error: "cant't delete experience",
      message: error.message,
    };
  }
}
export async function deleteProject(id) {
  const { user, isLogged } = await credentials();
  try {
    if (isLogged) {
      const requestDelete = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.LOCAL_DOMAIN_URL
            : process.env.DOMAIN_URL
        }/${user.id}/project/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = requestDelete.json();
      revalidatePath("/projects");
      return data;
    } else {
      redirect("/api/auth/login");
    }
  } catch (error) {
    return {
      error: "cant't delete this project",
      message: error.message,
    };
  }
}
export async function deleteSkill(id) {
  const { user, isLogged } = await credentials();
  try {
    if (isLogged) {
      const requestDelete = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.LOCAL_DOMAIN_URL
            : process.env.DOMAIN_URL
        }/${user?.id}/skills/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = requestDelete.json();
      revalidatePath("/skills");
      return data;
    } else {
      redirect("/api/auth/login");
    }
  } catch (error) {
    return {
      error: "cant't delete skill",
      message: error.message,
    };
  }
}
