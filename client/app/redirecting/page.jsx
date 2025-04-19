import { redirect } from "next/navigation";
import "../globals.css";
import { useAuth } from "../contexts/AuthProvider";

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
  const { user } = useAuth();

  const isAdmin = user.role === "ADMIN";

  return isAdmin
    ? redirect(`/${user?.id}/dashboard`)
    : redirect(`/${user?.id}`);
}

export default RedirectingPage;
