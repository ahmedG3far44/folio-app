/* eslint-disable @typescript-eslint/no-explicit-any */
const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const payload = JSON.stringify({ email, password });
    const url = `${URL_SERVER}/auth/login`;
    console.log(url);
    const data = await RequestServer({ method: "POST", payload, url });
    return { data: data.data, message: data.message };
  } catch (err: any) {
    return { data: "error ", message: err?.message };
  }
}

interface RequestParamsType {
  method?: string | "GET" | "POST" | "PUT" | "DELETE";
  accessToken?: string;
  payload?: string;
  url: string;
}
export async function RequestServer({
  method,
  accessToken,
  payload,
  url,
}: RequestParamsType) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: payload,
    });

    if (!response.ok)
      throw new Error("somtheing went wrong check your connections!!");
    const data = await response.json();
    return { data, message: "success response " };
  } catch (err: unknown) {
    console.error(err);
    return { data: "error", message: err };
  }
}

export const addSkill = async ({
  file,
  skillName,
  token,
}: {
  file: File;
  skillName: string;
  token: string;
}) => {
  const formData = new FormData();
  formData.append("file", file!);
  formData.append("skillName", skillName);

  try {
    const response = await fetch(`${URL_SERVER}/skills`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("adding a new skill failed!!");
    }
    const data = await response.json();
    return {data , message:`A new skill was created success!!`};
  } catch (err) {
    console.log((err as Error).message);

    return { data: "create error", message: (err as Error).message };
  }
};
export const updateSkill = async ({
  file,
  skillName,
  token,
  skillId,
}: {
  file: File;
  skillName: string;
  token: string;
  skillId: string;
}) => {
  const formData = new FormData();
  formData.append("file", file!);
  formData.append("skillName", skillName);

  try {
    const response = await fetch(`${URL_SERVER}/skills/${skillId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("updating a skill failed!!");
    }
    const data = await response.json();
    return { data, message: `A skill ${skillId} was updated!!` };
  } catch (err) {
    console.log((err as Error).message);
    return { data: "update error", message: (err as Error).message };
  }
};
export const deleteSkillById = async ({
  skillId,
  token,
}: {
  skillId: string;
  token: string;
}) => {
  try {
    const response = await fetch(`${URL_SERVER}/skills/${skillId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("deleting a skill failed!!");
    }
    const data = await response.json();
    return { data, message: `a skill ${skillId} was delted!!` };
  } catch (err) {
    console.log((err as Error).message);
    return { data: "error", message: (err as Error).message };
  }
};
