"use server";
import credentials from "@credentials";
import {
  experienceSchema,
  skillsSchema,
  projectSchema,
  layoutsSchema,
} from "@lib/schema";
import { revalidatePath } from "next/cache";

export async function updateExperience(id) {
  const { user, isLogged } = await credentials();

  try {
    if (isLogged) {
      const updatedExperienceInfo = {
        cName: fromData.get("cName"),
        cLogo: fromData.get("cLogo"),
        position: fromData.get("position"),
        role: fromData.get("role"),
        start: fromData.get("start"),
        end: fromData.get("end"),
        location: fromData.get("location"),
      };
      const validPayload = experienceSchema.safeParse(updatedExperienceInfo);

      if (!validPayload.success) {
        return validPayload.error.flatten().fieldErrors;
      }
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.LOCAL_DOMAIN_URL
            : process.env.DOMAIN_URL
        }/${user.id}/experiences/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validPayload.data),
        }
      );
      console.log("experience update request done");
      response.json().then((res) => {
        console.log(res);
      });
      revalidatePath("/experiences");
      return;
    } else {
      redirect("api/auth/login");
    }
  } catch (error) {
    return {
      error: "connection error can't add experience",
      message: error.message,
    };
  }
}

export async function updateSkill(id) {
  const { user, isLogged } = await credentials();

  try {
    if (isLogged) {
      const updatedSkill = {
        skillName: fromData.get("skillName"),
        skillLogo: fromData.get("skillLogo"),
      };
      const validPayload = skillsSchema.safeParse(updatedSkill);

      if (!validPayload.success) {
        return validPayload.error.flatten().fieldErrors;
      }
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? process.env.LOCAL_DOMAIN_URL
            : process.env.DOMAIN_URL
        }/${user?.id}/skills/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validPayload.data),
        }
      );
      console.log("skill updated  done");
      response.json().then((res) => {
        console.log(res);
      });
      return;
    } else {
      redirect("api/auth/login");
    }
  } catch (error) {
    return {
      error: "connection error can't add experience",
      message: error.message,
    };
  }
}

export const updateLayoutsAction = async (layouts) => {
  const { user } = await credentials();
  const validLayouts = layoutsSchema.safeParse(layouts);
  if (!validLayouts.success) {
    const errors = {
      error: "not valid data",
      message: {
        expLayout: validLayouts.error.flatten().fieldErrors.expLayout,
        projectsLayout: validLayouts.error.flatten().fieldErrors.projectsLayout,
        skillsLayout: validLayouts.error.flatten().fieldErrors.skillsLayout,
      },
    };
    return errors;
  }
  try {
    const request = await fetch(
      `${
        process.env.NODE_ENV === "development"
          ? process.env.LOCAL_DOMAIN_URL
          : process.env.DOMAIN_URL
      }/${layouts?.usersId}/layouts/${layouts?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...validLayouts?.data }),
      }
    );

    const data = request.json();
    if (request.ok) {
      response.then((res) => {
        console.log(res);
      });
      revalidatePath(`/${user.id}`);
      return data;
    }
  } catch (error) {
    return {
      error: "connection error",
      message: error.message,
    };
  }
};

// const domainUrl =
//   process.env.NODE_ENV === "development"
//     ? process.env.LOCAL_DOMAIN_URL
//     : process.env.DOMAIN_URL;

// const { isAdmin, isLogged, user, accessToken } = await credentials();

export const handleUpdateExperience = async (updatedExperience, formData) => {
  const { isAdmin, isLogged, user, accessToken } = await credentials();
  let actionState = {
    success: false,
    error: false,
    message: null,
  };
  try {
    const validPayload = experienceSchema.safeParse(updatedExperience);
    if (!validPayload.success) {
      let error = validPayload.error.flatten().fieldErrors;
      actionState.error = true;
      actionState.message = "updated experiences data is not valid";
      console.log(error);
      return actionState;
    }
    const request = await fetch(
      `${
        process.env.NODE_ENV === "development"
          ? process.env.LOCAL_DOMAIN_URL
          : process.env.DOMAIN_URL
      }/${updatedExperience.usersId}/experiences/${updatedExperience?.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!request.ok) {
      actionState.error = true;
      throw new Error("connection error can't update");
    }
    if (isLogged || request.status !== 200) {
      actionState.error = true;
      throw new Error("your not authorized to do this action");
    }
    const data = await request.json();
    actionState.success = true;
    actionState.message = "experience update successfully done";
    revalidatePath("/experiences");
    return actionState;
  } catch (error) {
    console.log(error.message);
    actionState.error = true;
    actionState.message = error.message;
    return actionState;
  }
};
export const handleUpdateProject = async (updatedProject) => {
  const { isAdmin, isLogged, user, accessToken } = await credentials();
  try {
    const validPayload = projectSchema.safeParse(updatedProject);

    if (!validPayload.success) {
      return validPayload.error.flatten().fieldErrors;
    }
    const request = await fetch(
      `${
        process.env.NODE_ENV === "development"
          ? process.env.LOCAL_DOMAIN_URL
          : process.env.DOMAIN_URL
      }/${initialUpdate?.usersId}/projects/${initialUpdate?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validPayload.data),
      }
    );
    const data = await request.json();
    console.log("the project updated");
    router.refresh("/projects");
    return data;
  } catch (error) {
    return error;
  }
};
export const handleUpdateSkill = async (updatedSkill, formData) => {
  let actionState = {
    success: false,
    error: false,
    message: null,
  };

  const { isAdmin, isLogged, user, accessToken } = await credentials();
  try {
    const validPayload = skillsSchema.safeParse(formData);
    if (!validPayload.success) {
      console.log(validPayload.error.flatten().fieldErrors);
      throw new Error("data is not valid");
    }
    const request = await fetch(
      `${
        process.env.NODE_ENV === "development"
          ? process.env.LOCAL_DOMAIN_URL
          : process.env.DOMAIN_URL
      }/${updatedSkill?.usersId}/skills/${updatedSkill?.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
    if (!request.ok) {
      throw new Error("connection error can't update");
    }
    if (isLogged || request.status !== 200) {
      throw new Error("your not authorized to do this action");
    }
    const data = await request.json();
    console.log("the skill updated");
    revalidatePath("/skills");
    actionState.success = true;
    actionState.message = "updated successfully";
    return actionState;
  } catch (error) {
    console.log(error.message);
    actionState.error = true;
    actionState.message = error.message;
    return actionState;
  }
};

export const handleUpdateLayout = async (layouts) => {
  const { isAdmin, isLogged, user, accessToken } = await credentials();
  try {
    const validPayload = experienceSchema.safeParse(updateItem);

    if (!validPayload.success) {
      toast({
        title: "field action",
        description: "data is not valid",
      });
      return validPayload.error.flatten().fieldErrors;
    }
    const request = await fetch(
      `${process.env.NODE_ENV === "development"
        ? process.env.LOCAL_DOMAIN_URL
        : process.env.DOMAIN_URL}/${initialUpdate?.usersId}/experiences/${initialUpdate?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validPayload.data),
      }
    );
    const data = request.json();
    console.log("the experiences updated");
    toast({
      title: "success action",
      description: "experience updated done",
    });
    router.refresh("/experiences");
    return data;
  } catch (error) {
    toast({
      title: "connection error can't update",
      description: error.message,
    });
  }
};
