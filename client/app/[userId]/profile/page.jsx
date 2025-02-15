import { redirect } from "next/navigation";
import credentials from "@credentials";

async function Profile() {
  const { user, isLogged } = await credentials();
  const isAdmin = await checkIsAdmin(user?.id || userId);
  if (isAdmin && isLogged)
    return redirect(`http://localhost:3000/${user.id}/dashboard/users`);
}

export default Profile;
