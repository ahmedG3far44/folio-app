/* eslint-disable @typescript-eslint/no-explicit-any */
// const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const payload = JSON.stringify({ email, password });
    const url = "http://localhost:4000/api/auth/login";
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
