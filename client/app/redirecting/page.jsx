import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import "../globals.css";

const verifyUser = async (user) => {
  try {
    const request = await fetch("http://localhost:4000/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await request.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
async function RedirectingPage() {
  const { getUser, getPermission } = await getKindeServerSession();
  const isAdmin = await getPermission("admin:access");

  const user = await getUser();

  const payload = {
    id: user?.id,
    given_name: user?.given_name,
    family_name: user?.family_name,
    email: user?.email,
    picture: user?.picture,
    role: "USER",
  };
  
  await verifyUser(payload);

  return isAdmin
    ? redirect(`/${user?.id}/dashboard`)
    : redirect(`/${user?.id}`);
}

export default RedirectingPage;
